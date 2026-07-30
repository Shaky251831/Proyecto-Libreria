## Nombre del proyecto 
Sistema de Gestión para Librería en Línea: “Mundos de Tinta”.

## Integrantes del equipo:

- Márquez Agustín Briseida.

- López Guerrero Ariel Betsabe.

## Problemática:

La librería física actual sufre de descontrol en su inventario de libros, pérdida de registros en los préstamos/ventas a clientes y falta de un canal digital donde los usuarios puedan consultar disponibilidad, realizar pedidos y gestionar sus compras.
## Módulos principales que tendrá el sistema:

 
- **Módulo de Autenticación y Usuarios**: registro, login, recuperación de contraseña y control de accesos según roles (Sanctum + tokens Bearer).
- **Módulo de Catálogo e Inventario**: gestión de libros, autores y categorías, con búsqueda y paginación.
- **Módulo de Transacciones (Ventas/Préstamos)**: registro de ventas, detalle de venta y préstamos asociados a clientes.
- **Módulo de Reportes y Administración**: panel (Dashboard) para el administrador/empleado.

## Roles de usuario que manejará el sistema

- **Administrador**: acceso total al sistema, gestión de usuarios, auditoría y CRUD completo de todos los módulos (incluye eliminar libros/categorías).
- **Empleado**: puede crear y editar libros y categorías (sin permisos de eliminación).
- **Cliente**: acceso a la vitrina de libros, carrito de compras, historial de sus propias transacciones y gestión de su perfil.

## Tecnologías utilizadas
 
**Backend**

- PHP 8.3
- Laravel 13
- Laravel Sanctum (autenticación por tokens Bearer)
- MySQL
  
**Frontend**

- React 19
- Vite 8
- React Router DOM 7
- Axios

**Herramientas**

- Composer (gestor de dependencias PHP)
- npm (gestor de dependencias JS)
- GitHub / GitHub Projects (control de versiones y gestión de tareas)
- Figma (prototipo de diseño)

## Instrucciones de instalación
 
### Requisitos previos
 
- PHP >= 8.3 y Composer
- Node.js >= 18 y npm
- MySQL en ejecución
### 1. Clonar el repositorio
 
```bash
git clone https://github.com/Shaky251831/Proyecto-Libreria.git
cd Proyecto-Libreria
```
 
### 2. Backend (Laravel)
 
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
 
Editar el archivo `.env` y configurar la conexión a base de datos (por defecto el proyecto usa el puerto `3307`, pero puede que se el puerto ´3306´):
 
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=libreria_mundos_de_tinta
DB_USERNAME=root
DB_PASSWORD=
```
 
Crea la base de datos `libreria_mundos_de_tinta` en el gestor MySQL y luego correr las migraciones junto con el seeder (que carga roles, usuarios de prueba, autores, categorías, libros, préstamos y ventas de ejemplo):
 
```bash
php artisan migrate --seed
```
 
Levantar el servidor de desarrollo:
 
```bash
php artisan serve
```
 
La API queda disponible en `http://127.0.0.1:8000`.
 
### 3. Frontend (React + Vite)
 
En otra terminal:
 
```bash
cd frontend
npm install
npm run dev
```
## Credenciales de prueba
 
Estos usuarios se crean automáticamente al correr `php artisan migrate --seed`:
 
| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@libreria.com` | `Admin123!` |
| Empleado | `vendedor@libreria.com` | `Admin123!` |
| Cliente (demostración) | `cliente@libreria.com` | `Admin123!` |
| Cliente (frecuente) | `cliente2@libreria.com` | `Admin123!` |

## Link al repositorio de GitHub (debe estar ya creado y ser público)
- https://github.com/Shaky251831/Proyecto-Libreria 
## Link al tablero de GitHub Projects (debe estar ya creado con visibilidad pública).
- https://github.com/users/Shaky251831/projects/3/views/1 
## Link del FIGMA:
- https://www.figma.com/design/fB6bQ1u0Z33kEPJuDXUgiE/Libreria?node-id=14-669&t=cE2hQwPPbrI3Uzef-1
