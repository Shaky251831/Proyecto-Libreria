<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetalleVenta;
use App\Models\Libro;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'metodo_pago' => 'required|string|max:50',
            'items' => 'required|array|min:1',
            'items.*.libro_id' => 'required|integer|exists:libros,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ]);

        $venta = DB::transaction(function () use ($validated, $request) {
            $total = 0;
            $lineas = [];
            foreach ($validated['items'] as $item) {
                $libro = Libro::lockForUpdate()->findOrFail($item['libro_id']);
                if ($libro->stock < $item['cantidad']) abort(422, "Stock insuficiente para \"{$libro->titulo}\". Disponible: {$libro->stock}.");
                $subtotal = $libro->precio * $item['cantidad'];
                $total += $subtotal;
                $lineas[] = compact('libro', 'subtotal') + ['cantidad' => $item['cantidad']];
            }
            $venta = Venta::create([
                'usuario_id' => $request->user()->id, 'monto_total' => $total,
                'metodo_pago' => $validated['metodo_pago'], 'tipo' => 'Compra',
                'estado' => 'completada', 'fecha_venta' => now(),
            ]);
            foreach ($lineas as $linea) {
                DetalleVenta::create([
                    'venta_id' => $venta->id, 'libro_id' => $linea['libro']->id,
                    'cantidad' => $linea['cantidad'], 'precio_unitario' => $linea['libro']->precio,
                    'subtotal' => $linea['subtotal'],
                ]);
                $linea['libro']->decrement('stock', $linea['cantidad']);
            }
            return $venta;
        });

        return response()->json(['status' => 'success', 'message' => 'Compra registrada con éxito.', 'venta' => $venta->load('detalles.libro')], 201);
    }

    public function misCompras(Request $request)
    {
        return response()->json(Venta::with('detalles.libro')->where('usuario_id', $request->user()->id)->where('tipo', 'Compra')->orderByDesc('fecha_venta')->get()->map(fn (Venta $venta) => [
            'id' => $venta->id, 'fecha' => $venta->fecha_venta->format('Y-m-d'),
            'total' => $venta->monto_total, 'estado' => $venta->estado,
            'libros' => $venta->detalles->map(fn ($detalle) => $detalle->libro->titulo ?? 'Libro eliminado')->implode(', '),
        ]));
    }
}
