<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id(); // ID de usuario
            
            // Llave foránea hacia la tabla roles
            $table->foreignId('rol_id')->constrained('roles')->onDelete('cascade');
            
            $table->string('nombre', 100);
            $table->string('email', 150)->unique();
            $table->string('password');
            $table->string('telefono', 20)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};