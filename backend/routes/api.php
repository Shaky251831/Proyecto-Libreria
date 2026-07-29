<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LibroController; // Importa tu LibroController
use App\Http\Controllers\Api\CategoriaController; // Importa tu CategoriaController

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Auth)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Logout
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // CRUD de Libros (GET, POST, PUT, DELETE /api/libros)
    Route::apiResource('libros', LibroController::class);

    // CRUD de Categorías (GET, POST, PUT, DELETE /api/categorias)
    Route::apiResource('categorias', CategoriaController::class);
});