<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    /**
     * Listar todas las categorías.
     */
    public function index()
    {
        $categorias = Categoria::all();
        return response()->json($categorias, 200);
    }

    /**
     * Guardar una nueva categoría.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
        ]);

        $categoria = Categoria::create($request->all());

        return response()->json([
            'message' => 'Categoría creada exitosamente',
            'data' => $categoria
        ], 201);
    }

    /**
     * Mostrar una categoría específica.
     */
    public function show(string $id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        return response()->json($categoria, 200);
    }

    /**
     * Actualizar una categoría.
     */
    public function update(Request $request, string $id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:100|unique:categorias,nombre,' . $id,
            'descripcion' => 'nullable|string',
        ]);

        $categoria->update($request->all());

        return response()->json([
            'message' => 'Categoría actualizada exitosamente',
            'data' => $categoria
        ], 200);
    }

    /**
     * Eliminar una categoría.
     */
    public function destroy(string $id)
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada exitosamente'], 200);
    }
}