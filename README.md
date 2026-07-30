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


## Link al repositorio de GitHub (debe estar ya creado y ser público)
- https://github.com/Shaky251831/Proyecto-Libreria 
## Link al tablero de GitHub Projects (debe estar ya creado con visibilidad pública).
- https://github.com/users/Shaky251831/projects/3/views/1 
## Link del FIGMA:
- https://www.figma.com/design/fB6bQ1u0Z33kEPJuDXUgiE/Libreria?node-id=14-669&t=cE2hQwPPbrI3Uzef-1
