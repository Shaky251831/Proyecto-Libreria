<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LibroController;
use App\Http\Controllers\Api\CategoriaController;

/* RUTAS PÚBLICAS (Accesibles por cualquier visitante / cliente)*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Recuperación de contraseña
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Ver el catálogo completo (con paginación y filtros)
Route::get('/libros', [LibroController::class, 'index']);
// Ver detalle de un libro en específico
Route::get('/libros/{libro}', [LibroController::class, 'show']);

// Ver categorías
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{categoria}', [CategoriaController::class, 'show']);


/* RUTAS PROTEGIDAS (Requieren Bearer Token - Admin / Empleado)
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Logout
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Crear, Editar y Eliminar Libros
    Route::middleware('role:Administrador,Empleado')->group(function () {
        Route::post('/libros', [LibroController::class, 'store']);
        Route::put('/libros/{libro}', [LibroController::class, 'update']);

        Route::post('/categorias', [CategoriaController::class, 'store']);
        Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);
    });

    // Crear, Editar y Eliminar Categorías
     Route::middleware('role:Administrador')->group(function () {
        Route::delete('/libros/{libro}', [LibroController::class, 'destroy']);
        Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy']);
        Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);
    });
});