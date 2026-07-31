<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Venta;

class PrestamoController extends Controller
{
    // Función para el ADMINISTRADOR (Ve todas las transacciones)
    public function indexAdmin()
    {
        $transacciones = Venta::with(['usuario', 'detalles.libro'])
            ->orderBy('created_at', 'desc')
            ->get();

        $formateado = $transacciones->map(function ($t) {
            $nombresLibros = $t->detalles->map(function ($detalle) {
                return $detalle->libro->titulo ?? 'Desconocido';
            })->implode(', ');

            return [
                'id'      => $t->id,
                // FIX: el campo del modelo User es 'nombre', no 'name'
                'usuario' => $t->usuario->nombre ?? 'Usuario Eliminado',
                'libro'   => $nombresLibros,
                'tipo'    => $t->tipo ?? 'Compra',
                'estado'  => $t->estado ?? 'Completado',
                'fecha'   => $t->created_at->format('Y-m-d'),
            ];
        });

        return response()->json($formateado);
    }

    // Función para el CLIENTE (Ve solo sus propios préstamos)
    public function misPrestamos(Request $request)
    {
        $usuario = $request->user();

        $prestamos = Venta::with('detalles.libro')
            ->where('usuario_id', $usuario->id)
            ->where('tipo', 'Préstamo')
            ->orderBy('created_at', 'desc')
            ->get();

        $formateado = $prestamos->map(function ($p) {
            $nombresLibros = $p->detalles->map(function ($detalle) {
                return $detalle->libro->titulo ?? 'Desconocido';
            })->implode(', ');

            return [
                'id'     => $p->id,
                'libro'  => $nombresLibros,
                'estado' => $p->estado ?? 'Pendiente de devolución',
                'fecha'  => $p->created_at->format('Y-m-d'),
            ];
        });

        return response()->json($formateado);
    }
}