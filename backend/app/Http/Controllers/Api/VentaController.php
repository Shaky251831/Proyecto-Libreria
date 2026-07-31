<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Venta; 

class VentaController extends Controller
{
    public function misCompras(Request $request)
    {
        // 1. Obtenemos al usuario que está haciendo la petición (gracias al token de Sanctum)
        $usuario = $request->user();

        // 2. Buscamos sus ventas e incluimos las relaciones hacia el detalle y el libro
        $compras = Venta::with('detalles.libro')
            ->where('usuario_id', $usuario->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // 3. Transformamos la información para que coincida 100% con tu frontend de React
        $historial = $compras->map(function ($venta) {
            
            // Extraemos los nombres de los libros de cada detalle y los unimos con comas
            $nombresLibros = $venta->detalles->map(function ($detalle) {
                // Asegúrate de que la relación se llame 'libro' y la columna 'titulo'
                return $detalle->libro->titulo ?? 'Libro Desconocido'; 
            })->implode(', ');

            return [
                'id'     => $venta->id,
                'fecha'  => $venta->created_at->format('Y-m-d'),
                'total'  => $venta->total,
                // Si en tu tabla ventas no tienes una columna 'estado', puedes dejarlo fijo como 'Completado' o 'En proceso'
                'estado' => $venta->estado ?? 'Completado', 
                'libros' => $nombresLibros,
            ];
        });

        // 4. Devolvemos la respuesta en formato JSON
        return response()->json($historial);
    }
}
