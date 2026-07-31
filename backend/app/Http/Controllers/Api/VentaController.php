<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Libro;

class VentaController extends Controller
{
    /**
     * Procesa una compra o préstamo: valida stock, descuenta inventario
     * y registra la venta + sus detalles.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo'                  => 'required|in:Compra,Préstamo',
            'metodo_pago'           => 'required|string|max:50',
            'items'                 => 'required|array|min:1',
            'items.*.libro_id'      => 'required|integer|exists:libros,id',
            'items.*.cantidad'      => 'required|integer|min:1',
        ]);

        $usuario = $request->user();

        $venta = DB::transaction(function () use ($validated, $usuario) {
            $montoTotal = 0;
            $lineas = [];

            foreach ($validated['items'] as $item) {
                // Bloqueamos la fila del libro para evitar condiciones de carrera
                $libro = Libro::where('id', $item['libro_id'])->lockForUpdate()->first();

                if (!$libro) {
                    abort(404, 'Uno de los libros del carrito ya no existe.');
                }

                if ($libro->stock < $item['cantidad']) {
                    abort(422, "Stock insuficiente para \"{$libro->titulo}\". Disponible: {$libro->stock}.");
                }

                $subtotal = $libro->precio * $item['cantidad'];
                $montoTotal += $subtotal;

                $lineas[] = [
                    'libro'    => $libro,
                    'cantidad' => $item['cantidad'],
                    'precio'   => $libro->precio,
                    'subtotal' => $subtotal,
                ];
            }

            $venta = Venta::create([
                'usuario_id'  => $usuario->id,
                'monto_total' => $montoTotal,
                'metodo_pago' => $validated['metodo_pago'],
                'tipo'        => $validated['tipo'],
                'estado'      => 'completada',
                'fecha_venta' => now(),
            ]);

            foreach ($lineas as $linea) {
                DetalleVenta::create([
                    'venta_id'        => $venta->id,
                    'libro_id'        => $linea['libro']->id,
                    'cantidad'        => $linea['cantidad'],
                    'precio_unitario' => $linea['precio'],
                    'subtotal'        => $linea['subtotal'],
                ]);

                // Descontamos el stock del libro
                $linea['libro']->decrement('stock', $linea['cantidad']);
            }

            return $venta;
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Transacción registrada con éxito.',
            'venta'   => $venta->load('detalles.libro'),
        ], 201);
    }

    public function misCompras(Request $request)
    {
        $usuario = $request->user();

        $compras = Venta::with('detalles.libro')
            ->where('usuario_id', $usuario->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $historial = $compras->map(function ($venta) {
            $nombresLibros = $venta->detalles->map(function ($detalle) {
                return $detalle->libro->titulo ?? 'Libro Desconocido';
            })->implode(', ');

            return [
                'id'     => $venta->id,
                'fecha'  => $venta->created_at->format('Y-m-d'),
                // FIX: la columna real es 'monto_total', no 'total'
                'total'  => $venta->monto_total,
                'estado' => $venta->estado ?? 'Completado',
                'libros' => $nombresLibros,
            ];
        });

        return response()->json($historial);
    }
}