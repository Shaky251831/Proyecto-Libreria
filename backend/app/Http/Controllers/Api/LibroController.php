<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Libro;
use Illuminate\Http\Request;

class LibroController extends Controller
{
    /**
     * Listar libros con paginación server-side y filtro de búsqueda.
     */
    public function index(Request $request)
    {
        $query = Libro::with('categoria');

        // Filtro de búsqueda por título o autor (ej. ?buscar=Hobbit)
        if ($request->has('buscar') && !empty($request->buscar)) {
            $busqueda = $request->buscar;
            $query->where(function($q) use ($busqueda) {
                $q->where('titulo', 'like', '%' . $busqueda . '%')
                  ->orWhere('autor', 'like', '%' . $busqueda . '%');
            });
        }

        // Filtro por categoría 
        if ($request->has('categoria_id') && !empty($request->categoria_id)) {
            $query->where('categoria_id', $request->categoria_id);
        }

        // Paginación server-side 
        $perPage = $request->get('per_page', 10);
        $libros = $query->paginate($perPage);

        return response()->json($libros, 200);
    }

    /*** Crear un nuevo libro.*/
    public function store(Request $request)
    {
        $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'titulo'       => 'required|string|max:255',
            'autor'        => 'required|string|max:255',
            'precio'       => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'img_portada'  => 'nullable|string',
            'descripcion'  => 'nullable|string',
        ]);

        $libro = Libro::create($request->all());

        return response()->json([
            'message' => 'Libro creado exitosamente',
            'data'    => $libro->load('categoria')
        ], 201);
    }

    /*** Mostrar un libro específico por su ID.*/
    public function show(string $id)
    {
        $libro = Libro::with('categoria')->find($id);

        if (!$libro) {
            return response()->json(['message' => 'Libro no encontrado'], 404);
        }

        return response()->json($libro, 200);
    }

    /**
     * Actualizar datos de un libro.
     */
    public function update(Request $request, string $id)
    {
        $libro = Libro::find($id);

        if (!$libro) {
            return response()->json(['message' => 'Libro no encontrado'], 404);
        }

        $request->validate([
            'categoria_id' => 'sometimes|exists:categorias,id',
            'titulo'       => 'sometimes|string|max:255',
            'autor'        => 'sometimes|string|max:255',
            'precio'       => 'sometimes|numeric|min:0',
            'stock'        => 'sometimes|integer|min:0',
            'img_portada'  => 'nullable|string',
            'descripcion'  => 'nullable|string',
        ]);

        $libro->update($request->all());

        return response()->json([
            'message' => 'Libro actualizado exitosamente',
            'data'    => $libro->load('categoria')
        ], 200);
    }

    /*** Eliminar un libro.*/
    public function destroy(string $id)
    {
        $libro = Libro::find($id);

        if (!$libro) {
            return response()->json(['message' => 'Libro no encontrado'], 404);
        }

        $libro->delete();

        return response()->json(['message' => 'Libro eliminado exitosamente'], 200);
    }
}