<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Venta; // Asumiendo que guardas los préstamos en la misma tabla de transacciones/ventas

class PrestamoController extends Controller
{
    // Función para el ADMINISTRADOR (Ve todas las transacciones)
    public function indexAdmin()
    {
        // Traemos todas las transacciones (compras y préstamos) con los datos del usuario y los libros
        $transacciones = Venta::with(['usuario', 'detalles.libro'])
            ->orderBy('created_at', 'desc')
            ->get();

        $formateado = $transacciones->map(function ($t) {
            $nombresLibros = $t->detalles->map(function ($detalle) {
                return $detalle->libro->titulo ?? 'Desconocido'; 
            })->implode(', ');

            return [
                'id'      => $t->id,
                'usuario' => $t->usuario->name ?? 'Usuario Eliminado', // Ajusta 'name' al campo de nombre de tu tabla users
                'libro'   => $nombresLibros,
                'tipo'    => $t->tipo ?? 'Compra', // 'Compra' o 'Préstamo'
                'estado'  => $t->estado ?? 'Completado',
                'fecha'   => $t->created_at->format('Y-m-d')
            ];
        });

        return response()->json($formateado);
    }

    // Función para el CLIENTE (Ve solo sus propios préstamos)
    public function misPrestamos(Request $request)
    {
        $usuario = $request->user();

        // Filtramos solo por el usuario logueado y que el tipo sea 'Préstamo'
        $prestamos = Venta::with('detalles.libro')
            ->where('usuario_id', $usuario->id)
            ->where('tipo', 'Préstamo') // Asegúrate de que este campo exista en tu base de datos
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
                'fecha'  => $p->created_at->format('Y-m-d')
            ];
        });

        return response()->json($formateado);
    }
}
