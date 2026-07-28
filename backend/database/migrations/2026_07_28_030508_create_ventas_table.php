<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            
            // Llave foránea hacia la tabla usuarios
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            
            $table->decimal('monto_total', 10, 2);
            $table->string('metodo_pago', 50); // Agregado: ej. 'Efectivo', 'Tarjeta'
            $table->enum('estado', ['pendiente', 'completada', 'cancelada'])->default('completada');
            $table->dateTime('fecha_venta');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};