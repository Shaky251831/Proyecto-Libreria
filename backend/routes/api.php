<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LibroController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\PrestamoController;
use App\Http\Controllers\Api\VentaController;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (Accesibles por cualquier visitante / cliente)
|--------------------------------------------------------------------------
*/

// Autenticación y Recuperación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Catálogo y Vistas Públicas
Route::get('/libros', [LibroController::class, 'index']);
Route::get('/libros/{libro}', [LibroController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{categoria}', [CategoriaController::class, 'show']);


/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Requieren Bearer Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // ==========================================
    // 1. ZONA DEL CLIENTE (Cualquier usuario logueado)
    // ==========================================
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Historial y compras del usuario
    Route::get('/mis-prestamos', [PrestamoController::class, 'misPrestamos']);
    Route::get('/mis-compras', [VentaController::class, 'misCompras']);


    // ==========================================
    // 2. ZONA DE EMPLEADOS Y ADMINISTRADORES
    // ==========================================
    Route::middleware('role:Administrador,Empleado')->group(function () {
        
        // Creación y edición de Libros
        Route::post('/libros', [LibroController::class, 'store']);
        Route::put('/libros/{libro}', [LibroController::class, 'update']);
        
        // Creación de Categorías
        Route::post('/categorias', [CategoriaController::class, 'store']);
        // Nota: Tenías el update de categorías repetido en los dos grupos, con dejarlo aquí es suficiente para ambos
        Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);
        
        // Panel de Préstamos y Estados
        Route::get('/prestamos', [PrestamoController::class, 'index']);
        Route::put('/prestamos/{id}/estado', [PrestamoController::class, 'cambiarEstado']);
        
    });


    // ==========================================
    // 3. ZONA EXCLUSIVA DEL ADMINISTRADOR
    // ==========================================
    Route::middleware('role:Administrador')->group(function () {
        
        // Acciones destructivas (Solo el Admin puede eliminar)
        Route::delete('/libros/{libro}', [LibroController::class, 'destroy']);
        Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy']);
        
    });

});
