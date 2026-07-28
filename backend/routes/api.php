<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;


/*Rutas Públicas (Sin autenticación)*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*Rutas Protegidas (Requieren Token de Sanctum)*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Cierre de sesión
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas protegidas por Rol
    Route::middleware(CheckRole::class . ':Administrador')->group(function () {
        // Endpoints exclusivos de Admin
    });
});