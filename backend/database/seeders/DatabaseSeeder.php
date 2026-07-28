<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ----------------------------------------------------
        // 1. ROLES (3 Niveles de acceso)
        // ----------------------------------------------------
        DB::table('roles')->insert([
            ['id' => 1, 'nombre' => 'Administrador', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'nombre' => 'Empleado',      'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'nombre' => 'Cliente',       'created_at' => now(), 'updated_at' => now()],
        ]);

        // ----------------------------------------------------
        // 2. USUARIOS INICIALES (Credenciales Fijas)
        // ----------------------------------------------------
        $passwordGenerica = Hash::make('Admin123!'); // Cumple requisitos de seguridad

        DB::table('usuarios')->insert([
            [
                'rol_id' => 1,
                'nombre' => 'Professora Eval',
                'email' => 'admin@libreria.com',
                'password' => $passwordGenerica,
                'telefono' => '9511111111',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'rol_id' => 2,
                'nombre' => 'Empleado Vendedor',
                'email' => 'vendedor@libreria.com',
                'password' => $passwordGenerica,
                'telefono' => '9512222222',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'rol_id' => 3,
                'nombre' => 'Cliente Demostración',
                'email' => 'cliente@libreria.com',
                'password' => $passwordGenerica,
                'telefono' => '9513333333',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // ----------------------------------------------------
        // 3. CATEGORÍAS (10 registros)
        // ----------------------------------------------------
        $categorias = [
            'Novela Ficción', 'Ciencia Ficción', 'Desarrollo Personal', 'Historia', 
            'Fantasía', 'Biografías', 'Misterio y Thriller', 'Poesía', 'Infantil', 'Filosofía'
        ];

        foreach ($categorias as $cat) {
            DB::table('categorias')->insert([
                'nombre' => $cat,
                'descripcion' => "Libros pertenecientes a la categoría de $cat",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ----------------------------------------------------
        // 4. LIBROS (12 registros)
        // ----------------------------------------------------
        $titulos = [
            'Cien Años de Soledad', '1984', 'El Principito', 'Fundación', 
            'Hábitos Atómicos', 'El Hobbit', 'Fahrenheit 451', 'Sapiens', 
            'Don Quijote de la Mancha', 'Crimen y Castigo', 'El Creador de Reyes', 'La Odisea'
        ];

        foreach ($titulos as $index => $titulo) {
            DB::table('libros')->insert([
                'categoria_id' => ($index % 10) + 1,
                'titulo' => $titulo,
                'autor' => 'Autor Ejemplo ' . ($index + 1),
                'precio' => rand(150, 650) + 0.99,
                'stock' => rand(10, 50),
                'img_portada' => null,
                'descripcion' => "Descripción detallada para el libro $titulo.",
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ----------------------------------------------------
        // 5. VENTAS Y DETALLES (10 registros de prueba)
        // ----------------------------------------------------
        for ($i = 1; $i <= 10; $i++) {
            $ventaId = DB::table('ventas')->insertGetId([
                'usuario_id' => 3, // Asignadas al cliente
                'monto_total' => rand(200, 1000) + 0.50,
                'metodo_pago' => ($i % 2 == 0) ? 'Efectivo' : 'Tarjeta',
                'estado' => 'completada',
                'fecha_venta' => now()->subDays(rand(1, 30)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Detalle de la venta
            DB::table('detalle_ventas')->insert([
                'venta_id' => $ventaId,
                'libro_id' => rand(1, 12),
                'cantidad' => rand(1, 3),
                'precio_unitario' => 299.99,
                'subtotal' => 299.99,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
