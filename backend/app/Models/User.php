<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Importante para la API y Tokens

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    // Le indicamos a Laravel el nombre exacto de tu tabla en la BD
    protected $table = 'usuarios';

    // Campos que permites llenar al registrar/crear usuarios
    protected $fillable = [
        'rol_id',
        'nombre',
        'email',
        'password',
        'telefono',
    ];

    // Ocultar datos sensibles en las respuestas JSON
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relación 1:N -> Un Usuario pertenece a un Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }
}