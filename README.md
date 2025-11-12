# Living Stone Contractors - Website

Sitio web profesional para Living Stone Contractors, LLC con frontend en Astro y backend en NestJS.

## 🏗️ Arquitectura del Proyecto

### Frontend
- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS
- **Gestión de Contenido**: Content Collections + API REST

### Backend
- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL (Neon en producción, Docker local)
- **Autenticación**: JWT con Passport

## 📁 Estructura del Proyecto

```
living_stone_contractors/
├── src/                        # Frontend Astro
│   ├── components/            # Componentes reutilizables
│   ├── layouts/               # Layouts principales
│   ├── pages/                 # Páginas del sitio
│   ├── content/               # Content Collections (para SSG inicial)
│   └── styles/                # Estilos globales
├── backend/                   # Backend NestJS
│   └── src/
│       ├── modules/           # Módulos de la aplicación
│       │   ├── auth/         # Autenticación
│       │   ├── services/     # Gestión de servicios
│       │   ├── gallery/      # Gestión de galería
│       │   └── contact/      # Formularios de contacto
│       ├── database/         # Entidades y migraciones
│       │   ├── entities/    # Modelos de TypeORM
│       │   └── seeds/       # Scripts de seed
│       └── config/          # Configuración de la app
├── public/                   # Archivos estáticos
│   └── images/              # Imágenes del sitio
└── docker-compose.yaml      # PostgreSQL para desarrollo local
```

## 🚀 Configuración e Instalación

### Prerequisitos

- Node.js 18+
- npm o yarn
- Docker y Docker Compose (para desarrollo local)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd living_stone_contractors
```

### 2. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Database (Local Development)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=living_stone_db

# Database (Production - Neon)
# DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Backend
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Admin User
ADMIN_EMAIL=admin@livingstonecontractors.com
ADMIN_PASSWORD=changeme

# Frontend
FRONTEND_URL=http://localhost:4321
```

### 3. Instalar Dependencias

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cd ..
```

### 4. Iniciar la Base de Datos (Desarrollo Local)

```bash
docker-compose up -d
```

Esto iniciará PostgreSQL en el puerto 5432.

### 5. Ejecutar Migraciones y Seeds

```bash
cd backend
npm run seed
cd ..
```

Esto creará:
- Todas las tablas necesarias
- Los 8 servicios predefinidos
- Un usuario administrador (ver credenciales en `.env`)

### 6. Iniciar el Proyecto

Abre dos terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend corriendo en: http://localhost:3000/api

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend corriendo en: http://localhost:4321

## 🎨 Personalización

### Imágenes

1. Navega a `public/images/placeholders/`
2. Lee el archivo `README.md` para ver las especificaciones
3. Reemplaza los placeholders con tus imágenes reales

### Logo

Reemplaza el logo en:
- `/public/images/logo.png` (200x200px)
- Actualiza el componente Header si necesitas un tamaño diferente

### Colores

Los colores están configurados en `tailwind.config.mjs`:

```js
colors: {
  primary: {
    // Personaliza estos colores
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  }
}
```

## 🔐 Panel de Administración

### Acceso al Dashboard

El usuario administrador se crea automáticamente con el seed. Credenciales por defecto:
- Email: `admin@livingstonecontractors.com`
- Password: `changeme`

**⚠️ IMPORTANTE**: Cambia estas credenciales en producción.

### Endpoints de la API

#### Servicios
- `GET /api/services` - Listar todos los servicios publicados
- `GET /api/services/:id` - Obtener un servicio por ID
- `GET /api/services/slug/:slug` - Obtener un servicio por slug
- `POST /api/services` - Crear servicio (requiere auth)
- `PATCH /api/services/:id` - Actualizar servicio (requiere auth)
- `DELETE /api/services/:id` - Eliminar servicio (requiere auth)

#### Galería
- `GET /api/gallery` - Listar todas las imágenes
- `GET /api/gallery?serviceId=xxx` - Filtrar por servicio
- `POST /api/gallery` - Añadir imagen (requiere auth)
- `PATCH /api/gallery/:id` - Actualizar imagen (requiere auth)
- `DELETE /api/gallery/:id` - Eliminar imagen (requiere auth)

#### Contacto
- `POST /api/contact` - Enviar formulario de contacto
- `GET /api/contact` - Listar mensajes (requiere auth)
- `PATCH /api/contact/:id/status` - Actualizar estado (requiere auth)
- `DELETE /api/contact/:id` - Eliminar mensaje (requiere auth)

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Crear un Dashboard Web

Para crear un dashboard de administración, puedes:

1. **Opción 1**: Crear páginas Astro protegidas en `/src/pages/admin/`
2. **Opción 2**: Usar un framework separado (React, Vue) que consuma la API
3. **Opción 3**: Integrar [Astro Admin](https://github.com/example) u otra solución

## 🌐 Despliegue

### Frontend (Astro)

#### Vercel (Recomendado)
```bash
npm run build
```

Deploy en Vercel:
1. Conecta tu repositorio de GitHub
2. Configura el proyecto como Astro
3. Añade las variables de entorno necesarias
4. Deploy automático

#### Netlify
Similar a Vercel, conecta el repositorio y despliega.

### Backend (NestJS)

#### Railway / Render / Fly.io

1. Crea una aplicación nueva
2. Conecta tu repositorio
3. Configura las variables de entorno
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm run start:prod`

### Base de Datos (Neon)

1. Ve a [Neon](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string
4. Actualiza `DATABASE_URL` en tus variables de entorno de producción
5. Ejecuta las migraciones:
   ```bash
   cd backend
   npm run migration:run
   npm run seed
   ```

## 📝 Scripts Disponibles

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

### Backend
- `npm run start:dev` - Servidor de desarrollo con hot-reload
- `npm run start:prod` - Servidor de producción
- `npm run build` - Compilar TypeScript
- `npm run seed` - Ejecutar seeds de base de datos
- `npm run migration:generate` - Generar nueva migración
- `npm run migration:run` - Ejecutar migraciones

## 🔧 Desarrollo

### Añadir un Nuevo Servicio

1. Usa el endpoint POST `/api/services` o añade directamente en el seed
2. Sube la imagen del servicio
3. El servicio aparecerá automáticamente en el sitio

### Modificar Servicios Existentes

1. Usa el endpoint PATCH `/api/services/:id`
2. Los cambios se reflejarán inmediatamente

### Gestionar Galería de Imágenes

Usa los endpoints de `/api/gallery` para:
- Añadir imágenes a servicios específicos
- Organizar orden de visualización
- Mostrar/ocultar imágenes

## 🐛 Troubleshooting

### La base de datos no se conecta

1. Verifica que Docker esté corriendo: `docker ps`
2. Revisa las credenciales en `.env`
3. Reinicia los contenedores: `docker-compose restart`

### Error en migraciones

```bash
# Elimina la base de datos y vuelve a crearla
docker-compose down -v
docker-compose up -d
cd backend && npm run seed
```

### Puerto en uso

Cambia el puerto en `.env`:
```env
PORT=3001  # o cualquier otro puerto disponible
```

## 📞 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.

## 📄 Licencia

Proyecto propietario de Living Stone Contractors, LLC.

---

**Desarrollado con ❤️ usando Astro + NestJS**
