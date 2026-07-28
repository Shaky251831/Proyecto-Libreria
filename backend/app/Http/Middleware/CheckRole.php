<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Verificar si el usuario está autenticado
        if (!$request->user()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autenticado.'
            ], 401);
        }

        // Cargar la relación del rol si no está cargada
        $userRole = $request->user()->rol->nombre;

        // Verificar si el rol del usuario está dentro de los roles permitidos
        if (!in_array($userRole, $roles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Acceso denegado: No tienes los permisos necesarios para realizar esta acción.'
            ], 403);
        }

        return $next($request);
    }
}
