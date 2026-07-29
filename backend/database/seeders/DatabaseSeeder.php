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
        // 1. ROLES (3 Niveles de acceso)
        DB::table('roles')->insert([
            ['id' => 1, 'nombre' => 'Administrador', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'nombre' => 'Empleado',      'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'nombre' => 'Cliente',       'created_at' => now(), 'updated_at' => now()],
        ]);

        // 2. USUARIOS INICIALES (Credenciales Fijas)
        $passwordGenerica = Hash::make('Admin123!'); 

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

        // 3. CATEGORÍAS 
        DB::table('categorias')->insert([
            ['id' => 1, 'nombre' => 'Fantasía y Épica', 'descripcion' => 'Mundos mágicos, criaturas y grandes aventuras épicas.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'nombre' => 'Ciencia Ficción', 'descripcion' => 'Novelas futuristas, viajes espaciales y distopías.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'nombre' => 'Novela Clásica', 'descripcion' => 'Obras cumbre de la literatura universal.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'nombre' => 'Manga y Novela Gráfica', 'descripcion' => 'Cómics, novelas visuales e historias ilustradas del este asiático.', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'nombre' => 'Desarrollo Personal y Ciencia', 'descripcion' => 'Libros sobre mente, hábitos, divulgación científica y psicología.', 'created_at' => now(), 'updated_at' => now()],
        ]);


        // 4. LIBROS 
        DB::table('libros')->insert([
            [
                'categoria_id' => 1,
                'titulo' => 'El Hobbit',
                'autor' => 'J.R.R. Tolkien',
                'precio' => 320.00,
                'stock' => 15,
                'img_portada' => 'portadas/el_hobbit.jpg',
                'descripcion' => 'Las aventuras del hobbit Bilbo Bolsón en su búsqueda del tesoro custodiado por el dragón Smaug.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 1,
                'titulo' => 'El Nombre del Viento',
                'autor' => 'Patrick Rothfuss',
                'precio' => 480.00,
                'stock' => 10,
                'img_portada' => 'portadas/el_nombre_del_viento.jpg',
                'descripcion' => 'La historia relatada por el propio Kvothe, un héroe, músico y mago legendario.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 1,
                'titulo' => 'El Camino de los Reyes',
                'autor' => 'Brandon Sanderson',
                'precio' => 650.00,
                'stock' => 8,
                'img_portada' => 'portadas/camino_de_los_reyes.jpg',
                'descripcion' => 'El primer libro de la saga del Archivo de las Tormentas ambientado en el continente de Roshar.',
                'created_at' => now(), 'updated_at' => now(),
            ],

            
            [
                'categoria_id' => 2,
                'titulo' => 'Dune',
                'autor' => 'Frank Herbert',
                'precio' => 420.00,
                'stock' => 12,
                'img_portada' => 'portadas/dune.jpg',
                'descripcion' => 'Paul Atreides se traslada al desértico planeta Arrakis para asegurar el recurso más valioso del universo: la especia.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 2,
                'titulo' => 'Fahrenheit 451',
                'autor' => 'Ray Bradbury',
                'precio' => 280.00,
                'stock' => 20,
                'img_portada' => 'portadas/fahrenheit_451.jpg',
                'descripcion' => 'Una visión distópica del futuro donde los bomberos tienen la misión de quemar todos los libros.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 2,
                'titulo' => 'Neuromante',
                'autor' => 'William Gibson',
                'precio' => 310.00,
                'stock' => 9,
                'img_portada' => 'portadas/neuromante.jpg',
                'descripcion' => 'Obra cumbre del género cyberpunk sobre un hacker de datos contratado para un último trabajo.',
                'created_at' => now(), 'updated_at' => now(),
            ],

            [
                'categoria_id' => 3,
                'titulo' => 'Cien Años de Soledad',
                'autor' => 'Gabriel García Márquez',
                'precio' => 290.00,
                'stock' => 25,
                'img_portada' => 'portadas/cien_anos_de_soledad.jpg',
                'descripcion' => 'La épica historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 3,
                'titulo' => 'Crimen y Castigo',
                'autor' => 'Fiódor Dostoyevski',
                'precio' => 350.00,
                'stock' => 14,
                'img_portada' => 'portadas/crimen_y_castigo.jpg',
                'descripcion' => 'Dilemas morales y psicológicos del joven estudiante Raskólnikov tras cometer un asesinato.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 3,
                'titulo' => '1984',
                'autor' => 'George Orwell',
                'precio' => 260.00,
                'stock' => 30,
                'img_portada' => 'portadas/1984.jpg',
                'descripcion' => 'Novela política de ficción distópica que introdujo el concepto del Gran Hermano y la vigilancia total.',
                'created_at' => now(), 'updated_at' => now(),
            ],

            [
                'categoria_id' => 4,
                'titulo' => 'Jujutsu Kaisen Vol. 1',
                'autor' => 'Gege Akutami',
                'precio' => 190.00,
                'stock' => 18,
                'img_portada' => 'portadas/jujutsu_kaisen_1.jpg',
                'descripcion' => 'Yuji Itadori se traga un objeto maldito para salvar a un amigo y termina compartiendo cuerpo con Sukuna.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 4,
                'titulo' => 'Blue Lock Vol. 1',
                'autor' => 'Muneyuki Kaneshiro',
                'precio' => 185.00,
                'stock' => 12,
                'img_portada' => 'portadas/blue_lock_1.jpg',
                'descripcion' => '300 delanteros de fútbol compiten en una instalación extrema para convertirse en el delantero definitivo.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 4,
                'titulo' => 'Haikyu!! Vol. 1',
                'autor' => 'Haruichi Furudate',
                'precio' => 180.00,
                'stock' => 15,
                'img_portada' => 'portadas/haikyu_1.jpg',
                'descripcion' => 'Shoyo Hinata entra al equipo de voleibol de Karasuno para competir a nivel nacional a pesar de su baja estatura.',
                'created_at' => now(), 'updated_at' => now(),
            ],

        
            [
                'categoria_id' => 5,
                'titulo' => 'Hábitos Atómicos',
                'autor' => 'James Clear',
                'precio' => 380.00,
                'stock' => 22,
                'img_portada' => 'portadas/habitos_atomicos.jpg',
                'descripcion' => 'Un marco revolucionario para mejorar un 1% cada día mediante pequeños cambios en tus rutinas.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 5,
                'titulo' => 'Sapiens: De animales a dioses',
                'autor' => 'Yuval Noah Harari',
                'precio' => 410.00,
                'stock' => 11,
                'img_portada' => 'portadas/sapiens.jpg',
                'descripcion' => 'Breve historia de la humanidad desde la evolución del Homo sapiens hasta el siglo XXI.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'categoria_id' => 5,
                'titulo' => 'El Jeque que vendió su Ferrari',
                'autor' => 'Robin Sharma',
                'precio' => 270.00,
                'stock' => 16,
                'img_portada' => 'portadas/monje_ferrari.jpg',
                'descripcion' => 'Una fábula espiritual sobre cómo encontrar tu propósito y cultivar la paz mental.',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);

        }
}
