# Backend Integration Guide - Living Stone Contractors

## 🔧 Cómo Funciona el Backend

El backend es una **REST API** construida con **NestJS** que proporciona endpoints para gestionar servicios, galería, formularios de contacto y autenticación.

---

## 🚀 Iniciar el Backend

### 1. **Iniciar la Base de Datos** (Primera vez)
```bash
# En la raíz del proyecto
docker-compose up -d

# Verificar que PostgreSQL está corriendo
docker ps
```

### 2. **Instalar Dependencias** (Primera vez)
```bash
cd backend
npm install
```

### 3. **Ejecutar Seeds** (Primera vez)
```bash
cd backend
npm run seed
```
Esto creará:
- 8 servicios predefinidos
- Usuario admin con credenciales del `.env`

### 4. **Iniciar el Backend**
```bash
cd backend
npm run start:dev
```

El backend estará disponible en: **`http://localhost:3000/api`**

---

## 📡 API Endpoints Disponibles

### **Services** (Servicios)

**Públicos** (no requieren autenticación):
```bash
GET    /api/services              # Listar todos los servicios
GET    /api/services/:id          # Obtener servicio por ID
GET    /api/services/slug/:slug   # Obtener servicio por slug
```

**Protegidos** (requieren autenticación - comentado por ahora):
```bash
POST   /api/services              # Crear nuevo servicio
PATCH  /api/services/:id          # Actualizar servicio
DELETE /api/services/:id          # Eliminar servicio
```

### **Contact** (Formularios de Contacto)

**Público**:
```bash
POST   /api/contact               # Enviar mensaje de contacto
```

**Protegidos** (admin):
```bash
GET    /api/contact               # Listar todos los mensajes
GET    /api/contact/:id           # Ver mensaje específico
PATCH  /api/contact/:id/status    # Actualizar estado (read/unread)
DELETE /api/contact/:id           # Eliminar mensaje
```

### **Gallery** (Galería de Imágenes)

**Públicos**:
```bash
GET    /api/gallery               # Listar todas las imágenes
GET    /api/gallery?serviceId=xxx # Filtrar por servicio
```

**Protegidos**:
```bash
POST   /api/gallery               # Añadir imagen
PATCH  /api/gallery/:id           # Actualizar imagen
DELETE /api/gallery/:id           # Eliminar imagen
```

### **Auth** (Autenticación)

```bash
POST   /api/auth/login            # Iniciar sesión
GET    /api/auth/profile          # Obtener perfil (requiere token)
```

---

## 🔌 Integración Frontend → Backend

### Configuración Actual

**CORS Configurado** (`backend/src/main.ts`):
```typescript
app.enableCors({
  origin: 'http://localhost:4321',  // Frontend Astro
  credentials: true,
});
```

**Prefijo Global**:
- Todos los endpoints tienen el prefijo `/api`
- Ejemplo: `http://localhost:3000/api/services`

### Opción 1: Fetch Directo (Actual)

El formulario de contacto **ya está configurado**:

```typescript
// src/pages/contact.astro (línea 214)
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

**⚠️ Problema**: `/api/contact` apunta al mismo dominio del frontend (4321), pero el backend está en puerto 3000.

### Opción 2: Proxy con Astro (Recomendado para Desarrollo)

Agregar proxy en `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://livingstonecontractors.com',
  integrations: [tailwind(), sitemap()],
  output: 'static',
  compressHTML: true,

  // Proxy para desarrollo
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
});
```

Con esto, las llamadas a `/api/contact` se redirigen automáticamente a `http://localhost:3000/api/contact`.

### Opción 3: Variable de Entorno (Recomendado para Producción)

**1. Crear archivo de configuración:**

```typescript
// src/config/api.ts
export const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';
```

**2. Agregar a `.env`:**
```env
PUBLIC_API_URL=http://localhost:3000/api
```

**3. Usar en el frontend:**
```typescript
import { API_URL } from '../config/api';

const response = await fetch(`${API_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Obtener Servicios desde el Backend

Actualmente usas **Content Collections** (archivos Markdown). Puedes **cambiar** a consumir desde el backend:

**Antes** (Content Collections):
```typescript
// src/pages/services/index.astro
import { getCollection } from 'astro:content';
const allServices = await getCollection('services');
```

**Después** (API REST):
```typescript
// src/pages/services/index.astro
const API_URL = 'http://localhost:3000/api';
const response = await fetch(`${API_URL}/services`);
const allServices = await response.json();
```

### Ejemplo 2: Formulario de Contacto (Ya implementado)

```typescript
// src/pages/contact.astro
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Message sent successfully!');
      form.reset();
    }
  } catch (error) {
    alert('Error sending message');
  }
});
```

### Ejemplo 3: Autenticación JWT

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@livingstonecontractors.com',
    password: 'changeme'
  }),
});

const { access_token } = await response.json();
localStorage.setItem('token', access_token);

// Usar token en requests protegidos
const protectedResponse = await fetch('/api/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(newService),
});
```

---

## 🔄 Flujo de Datos

### Arquitectura Actual (Híbrida)

```
┌─────────────────────────────────────────┐
│         FRONTEND (Astro)                │
│         localhost:4321                   │
│                                          │
│  ┌──────────────┐    ┌───────────────┐ │
│  │   Content    │    │   API Calls   │ │
│  │ Collections  │    │  (Contact,    │ │
│  │  (Services)  │    │   Gallery)    │ │
│  └──────────────┘    └───────┬───────┘ │
│         │                     │         │
└─────────┼─────────────────────┼─────────┘
          │                     │
          ├─────────────────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│        BACKEND (NestJS)                  │
│        localhost:3000/api                │
│                                          │
│  ┌──────────┐  ┌─────────┐  ┌────────┐ │
│  │ Services │  │ Gallery │  │Contact │ │
│  │  Module  │  │ Module  │  │ Module │ │
│  └────┬─────┘  └────┬────┘  └───┬────┘ │
│       │             │            │      │
│       └─────────────┴────────────┘      │
│                     │                   │
│                     ▼                   │
│            ┌────────────────┐           │
│            │   PostgreSQL   │           │
│            │  (Docker/Neon) │           │
│            └────────────────┘           │
└─────────────────────────────────────────┘
```

### Flujo Recomendado (Completo con Backend)

1. **Usuario accede al sitio** → Astro SSG carga páginas estáticas
2. **Interacción dinámica** → JavaScript hace fetch a `/api/*`
3. **Backend procesa** → NestJS valida, procesa y guarda en DB
4. **Respuesta JSON** → Frontend actualiza UI

---

## 🎯 Estrategias de Integración

### Estrategia 1: **Híbrida** (Recomendada - Actual)

✅ **Usa Content Collections para:**
- Servicios (contenido estático, SEO)
- Páginas informativas
- Blog posts

✅ **Usa Backend API para:**
- Formulario de contacto (datos dinámicos)
- Galería de imágenes (admin puede subir)
- Autenticación de admin
- Métricas y analytics

**Ventajas:**
- Mejor SEO (contenido estático)
- Menos carga en backend
- Más rápido (SSG)
- Flexibilidad para contenido dinámico

### Estrategia 2: **100% API** (Dinámico)

❌ **Todo desde el backend:**
- Servicios desde API
- Galería desde API
- Contacto desde API

**Ventajas:**
- Contenido editable sin rebuilds
- Panel admin completo
- Más fácil de actualizar

**Desventajas:**
- Peor SEO (contenido no pre-renderizado)
- Más lento (requests en runtime)
- Más carga en backend

### Estrategia 3: **ISR** (Incremental Static Regeneration)

✨ **Lo mejor de ambos:**
- Build estático inicial
- Revalidación periódica (cada X minutos)
- Contenido fresco sin sacrificar SEO

**Requiere:**
- Hosting con soporte ISR (Vercel, Netlify)
- Configurar revalidación en Astro

---

## 🔧 Configuración Recomendada

### Para Desarrollo Local

**1. Agregar proxy en `astro.config.mjs`:**
```javascript
export default defineConfig({
  // ... otras configuraciones
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    }
  }
});
```

**2. Iniciar ambos servidores:**
```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
npm run dev
```

### Para Producción

**1. Variables de entorno:**
```env
# .env
PUBLIC_API_URL=https://api.livingstonecontractors.com
```

**2. Deploy separado:**
- **Frontend**: Vercel/Netlify (Astro SSG)
- **Backend**: Railway/Render/Fly.io (NestJS)
- **Database**: Neon (PostgreSQL serverless)

**3. Configurar CORS en producción:**
```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://livingstonecontractors.com',
    'https://www.livingstonecontractors.com'
  ],
  credentials: true,
});
```

---

## 📊 Testing de Endpoints

### Usar cURL:
```bash
# Obtener servicios
curl http://localhost:3000/api/services

# Enviar contacto
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "message": "Test message"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@livingstonecontractors.com",
    "password": "changeme"
  }'
```

### Usar Postman/Insomnia:
Importar colección de endpoints y probar visualmente.

---

## 🔐 Autenticación (Opcional)

Actualmente los endpoints protegidos están **comentados** (`// @UseGuards(JwtAuthGuard)`).

Para habilitarlos:
1. Descomentar los guards en los controladores
2. Implementar login en el frontend
3. Guardar token en localStorage
4. Enviar token en headers de requests protegidos

---

## 💡 Próximos Pasos

1. ✅ **Agregar proxy en Astro** para desarrollo
2. ✅ **Probar formulario de contacto** con backend corriendo
3. 🔜 **Crear panel admin** (opcional) para gestionar contenido
4. 🔜 **Implementar upload de imágenes** para galería
5. 🔜 **Habilitar autenticación JWT** para endpoints protegidos

---

## 📞 ¿Preguntas?

- **¿El backend es obligatorio?** No, puedes usar solo Content Collections
- **¿Puedo usar el backend solo para contacto?** Sí, estrategia híbrida recomendada
- **¿Cómo deploy en producción?** Frontend (Vercel) + Backend (Railway) + DB (Neon)

---

**Documentación actualizada**: Noviembre 2025
