<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ForgotPasswordRequest;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\ResetPasswordRequest;
use App\Http\Resources\UsuarioResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    // Registro de nuevos usuarios (Rol Cliente por defecto)
    public function register(RegisterRequest $request)
    {
        $usuario = User::create([
            'rol_id'   => 3, // Cliente
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 'success',
            'message'      => 'Usuario registrado exitosamente.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => new UsuarioResource($usuario->load('rol')),
        ], 201); // 201 Created
    }

    // Inicio de sesión
    public function login(LoginRequest $request)
    {
        $usuario = User::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Las credenciales proporcionadas son incorrectas.'
            ], 401); // 401 Unauthorized
        }

        // Borrar tokens previos y crear uno nuevo
        $usuario->tokens()->delete();
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 'success',
            'message'      => 'Inicio de sesión exitoso.',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => new UsuarioResource($usuario->load('rol')),
        ], 200); // 200 OK
    }

    // Ver datos del usuario autenticado
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user'   => new UsuarioResource($request->user()->load('rol')),
        ], 200);
    }

    // Cierre de sesión
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Cierre de sesión exitoso.'
        ], 200);
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::broker('users')->sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No se pudo enviar el enlace de recuperación. Intenta de nuevo más tarde.',
            ], 422);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Se envió un enlace de recuperación a tu correo electrónico.',
        ], 200);
    }
    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::broker('users')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $usuario, string $password) {
                $usuario->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                $usuario->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'status'  => 'error',
                'message' => 'El token es inválido o ha expirado.',
            ], 422);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Contraseña actualizada correctamente.',
        ], 200);
    }
    
}
