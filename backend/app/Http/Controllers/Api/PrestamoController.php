<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Libro;
use App\Models\Prestamo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrestamoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.libro_id' => 'required|integer|exists:libros,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ]);

        $prestamos = DB::transaction(function () use ($validated, $request) {
            $creados = collect();
            foreach ($validated['items'] as $item) {
                $libro = Libro::lockForUpdate()->findOrFail($item['libro_id']);
                if ($libro->stock < $item['cantidad']) {
                    abort(422, "Stock insuficiente para \"{$libro->titulo}\". Disponible: {$libro->stock}.");
                }
                for ($unidad = 0; $unidad < $item['cantidad']; $unidad++) {
                    $creados->push(Prestamo::create([
                        'usuario_id' => $request->user()->id,
                        'libro_id' => $libro->id,
                        'estado' => 'activo',
                        'fecha_inicial' => today(),
                        'fecha_limite' => today()->addDays(14),
                    ]));
                }
                $libro->decrement('stock', $item['cantidad']);
            }
            return $creados;
        });

        return response()->json(['status' => 'success', 'message' => 'Préstamo registrado con éxito.', 'prestamos' => $prestamos->load('libro')], 201);
    }

    public function indexAdmin()
    {
        return response()->json(Prestamo::with(['usuario', 'libro'])->orderByDesc('created_at')->get()->map(fn (Prestamo $prestamo) => $this->formatear($prestamo, true)));
    }

    public function misPrestamos(Request $request)
    {
        return response()->json(Prestamo::with('libro')->where('usuario_id', $request->user()->id)->orderByDesc('fecha_inicial')->get()->map(fn (Prestamo $prestamo) => $this->formatear($prestamo)));
    }

    public function cambiarEstado(Request $request, int $id)
    {
        $validated = $request->validate(['estado' => 'required|in:activo,devuelto,atrasado']);
        $prestamo = DB::transaction(function () use ($validated, $id) {
            $prestamo = Prestamo::with('libro')->lockForUpdate()->findOrFail($id);
            $eraDevuelto = $prestamo->estado === 'devuelto';
            $seraDevuelto = $validated['estado'] === 'devuelto';
            $libro = Libro::lockForUpdate()->findOrFail($prestamo->libro_id);
            if (!$eraDevuelto && $seraDevuelto) {
                $libro->increment('stock');
                $prestamo->fecha_devolucion = today();
            } elseif ($eraDevuelto && !$seraDevuelto) {
                if ($libro->stock < 1) abort(422, 'No hay existencias para reabrir este préstamo.');
                $libro->decrement('stock');
                $prestamo->fecha_devolucion = null;
            }
            $prestamo->estado = $validated['estado'];
            $prestamo->save();
            return $prestamo->fresh(['usuario', 'libro']);
        });
        return response()->json(['status' => 'success', 'prestamo' => $this->formatear($prestamo, true)]);
    }

    private function formatear(Prestamo $prestamo, bool $incluirUsuario = false): array
    {
        return array_filter([
            'id' => $prestamo->id,
            'usuario' => $incluirUsuario ? ($prestamo->usuario->nombre ?? 'Usuario eliminado') : null,
            'libro' => $prestamo->libro->titulo ?? 'Libro eliminado',
            'tipo' => 'Préstamo', 'estado' => $prestamo->estado,
            'fecha' => $prestamo->fecha_inicial->format('Y-m-d'),
            'fecha_limite' => $prestamo->fecha_limite->format('Y-m-d'),
        ], fn ($value) => $value !== null);
    }
}
