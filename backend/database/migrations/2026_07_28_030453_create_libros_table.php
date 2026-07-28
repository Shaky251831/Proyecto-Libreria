<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('libros', function (Blueprint $table) {
            $table->id();
            
            // Llave foránea hacia la tabla categorias
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            
            $table->string('titulo', 200);
            $table->string('autor', 150);
            $table->decimal('precio', 8, 2);
            $table->integer('stock')->default(0);
            $table->string('img_portada')->nullable();
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('libros');
    }
};
