<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prestamos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('libro_id')->constrained('libros')->onDelete('cascade');
            $table->enum('estado', ['activo', 'devuelto', 'atrasado'])->default('activo');
            $table->date('fecha_inicial');
            $table->date('fecha_limite');
            $table->date('fecha_devolucion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};