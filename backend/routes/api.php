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

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

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

    Route::get('/mis-prestamos', [PrestamoController::class, 'misPrestamos']);
    Route::get('/mis-compras', [VentaController::class, 'misCompras']);

    // NUEVO: procesa compra o préstamo (crea venta + detalle + descuenta stock)
    Route::post('/ventas', [VentaController::class, 'store']);


    // ==========================================
    // 2. ZONA DE EMPLEADOS Y ADMINISTRADORES
    // ==========================================
    Route::middleware('role:Administrador,Empleado')->group(function () {

        Route::post('/libros', [LibroController::class, 'store']);
        Route::put('/libros/{libro}', [LibroController::class, 'update']);

        Route::post('/categorias', [CategoriaController::class, 'store']);
        Route::put('/categorias/{categoria}', [CategoriaController::class, 'update']);

        // FIX: apuntaba a 'index', que no existe en el controlador
        Route::get('/prestamos', [PrestamoController::class, 'indexAdmin']);
        Route::put('/prestamos/{id}/estado', [PrestamoController::class, 'cambiarEstado']);

    });


    // ==========================================
    // 3. ZONA EXCLUSIVA DEL ADMINISTRADOR
    // ==========================================
    Route::middleware('role:Administrador')->group(function () {

        Route::delete('/libros/{libro}', [LibroController::class, 'destroy']);
        Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy']);

    });

});