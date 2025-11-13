# Living Stone Contractors - Website

Professional website for Living Stone Contractors, LLC - Home Remodeling & Improvement Specialists.

## 🏠 About Living Stone Contractors

Living Stone Contractors is a company specialized in home remodeling and improvement, committed to transforming spaces into functional, modern, and durable places. We are passionate about every detail of the process, from planning to execution, ensuring high-quality results that reflect the style and needs of each client.

We work hand in hand with homeowners, architects, designers, and contractors with the goal of offering comprehensive and personalized solutions. Our approach combines technical expertise, premium materials, and reliable service, guaranteeing projects that not only meet expectations but exceed them.

## 🏗️ Project Architecture

### Frontend
- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS (with custom brand colors)
- **Typography**: Montserrat (alternative to Gotham Pro)
- **Content Management**: Content Collections + REST API
- **Icons**: MDI (Material Design Icons)

### Backend
- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL (Neon in production, Docker local)
- **Authentication**: JWT with Passport

## 📁 Project Structure

```
living_stone_contractors/
├── src/                        # Astro Frontend
│   ├── components/            # Reusable components
│   │   ├── Header.astro      # Navigation with brand logo
│   │   ├── Footer.astro      # Footer with brand logo
│   │   └── ServiceCard.astro # Service cards
│   ├── layouts/               # Main layouts
│   │   ├── BaseLayout.astro  # Base HTML layout
│   │   └── MainLayout.astro  # Main page layout
│   ├── pages/                 # Site pages
│   │   ├── index.astro       # Home page
│   │   ├── about.astro       # About page
│   │   ├── contact.astro     # Contact page
│   │   └── services/         # Services pages
│   ├── content/               # Content Collections
│   │   └── services/         # Service markdown files
│   └── styles/                # Global styles
│       └── global.css        # Tailwind + custom styles
├── backend/                   # NestJS Backend
│   └── src/
│       ├── modules/           # Application modules
│       │   ├── auth/         # Authentication
│       │   ├── services/     # Services management
│       │   ├── gallery/      # Gallery management
│       │   └── contact/      # Contact forms
│       ├── database/         # Entities and migrations
│       │   ├── entities/    # TypeORM models
│       │   └── seeds/       # Seed scripts
│       └── config/          # App configuration
├── public/                   # Static files
│   └── images/
│       ├── logos/           # Brand logos (official)
│       └── placeholders/    # Service images
├── docs/                    # Documentation
│   └── brand-assets/       # Brand manual and logos
│       └── 1. Logo_LSC/   # Official brand assets
└── docker-compose.yaml     # PostgreSQL for local dev
```

## 🎨 Brand Identity

### Official Brand Colors

Based on Living Stone Contractors Brand Manual:

```javascript
// Primary - Asparagus (Verde)
primary-500: #6B8F4E

// Secondary - Eerie Black (Negro verdoso)
secondary-900: #1F2117

// Accent - Coffee (Café/Marrón)
accent: #694E3B

// Neutral - Bone & Cream
bone: #E5DDD2    // Beige/Hueso
cream: #FCF9F3   // Baby Powder
```

### Typography

**Primary Font**: Montserrat (Google Fonts)
- Used as alternative to Gotham Pro (requires commercial license)
- Applied to headings and body text
- Modern, neutral, and simple aesthetic

**Note**: When Gotham Pro license is obtained, update font references in:
- `tailwind.config.mjs`
- `src/layouts/BaseLayout.astro`

### Logos

Official logos are located in `public/images/logos/`:

- **Header**: `LSC_secundario_Verde.png` (green, on white background)
- **Footer**: `LSC_secundario_Blanco.png` (white, on dark background)
- **About Section**: `LSC_sublogo_Verde.png` (full branding with icon)

All logos sourced from: `docs/brand-assets/1. Logo_LSC/`

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for local development)

### 1. Clone Repository

```bash
git clone <repository-url>
cd living_stone_contractors
```

### 2. Configure Environment Variables

Copy example file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (Local Development)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=living_stone_db

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

### 3. Install Dependencies

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

### 4. Start Database (Local Development)

```bash
docker-compose up -d
```

PostgreSQL will start on port 5432.

### 5. Run Migrations & Seeds

```bash
cd backend
npm run seed
cd ..
```

This creates:
- All necessary tables
- 8 predefined services
- Admin user (credentials in `.env`)

### 6. Start Project

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend running at: http://localhost:3000/api

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend running at: http://localhost:4321

## 📝 Services

The website features 8 core services:

1. **Interior** - Interior renovation and remodeling
2. **Exterior** - Exterior improvements and curb appeal
3. **Additions/Alterations** - Home expansions and modifications
4. **Masonry** - Structural and decorative stonework
5. **Kitchens and Baths** - Complete kitchen & bathroom remodeling
6. **Siding** - Siding installation and replacement
7. **Basements** - Basement finishing and remodeling
8. **Roofing** - Roof installation, repair, and replacement

### Service Images

Service images are located in `public/images/placeholders/`:
- `interior.png`
- `exterior.png`
- `additions.png`
- `masonry.png`
- `kitchens_baths.png`
- `roofing.png`

## 🎨 Customization

### Updating Brand Colors

Colors are configured in `tailwind.config.mjs`:

```javascript
colors: {
  primary: {
    500: '#6B8F4E',  // Asparagus - Main brand green
    // ... other shades
  },
  secondary: {
    900: '#1F2117',  // Eerie Black
    // ... other shades
  }
}
```

### Updating Logos

Replace logos in `public/images/logos/`:
- Maintain PNG format with transparency
- Use appropriate color version (green/white/black)
- Reference official brand manual in `docs/brand-assets/`

### Updating Service Images

1. Navigate to `public/images/placeholders/`
2. Replace with high-quality images (recommended: 1200x800px minimum)
3. Maintain PNG format for best quality
4. Use descriptive filenames matching service slugs

## 🔐 Admin Panel

### API Endpoints

#### Services
- `GET /api/services` - List all published services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/slug/:slug` - Get service by slug
- `POST /api/services` - Create service (requires auth)
- `PATCH /api/services/:id` - Update service (requires auth)
- `DELETE /api/services/:id` - Delete service (requires auth)

#### Gallery
- `GET /api/gallery` - List all images
- `GET /api/gallery?serviceId=xxx` - Filter by service
- `POST /api/gallery` - Add image (requires auth)
- `PATCH /api/gallery/:id` - Update image (requires auth)
- `DELETE /api/gallery/:id` - Delete image (requires auth)

#### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List messages (requires auth)
- `PATCH /api/contact/:id/status` - Update status (requires auth)
- `DELETE /api/contact/:id` - Delete message (requires auth)

#### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (requires auth)

### Default Admin Credentials

- Email: `admin@livingstonecontractors.com`
- Password: `changeme`

**⚠️ IMPORTANT**: Change these credentials in production!

## 🌐 Deployment

### Frontend (Astro) - Vercel/Netlify

```bash
npm run build
```

1. Connect GitHub repository
2. Configure as Astro project
3. Add environment variables
4. Auto-deploy on push

### Backend (NestJS) - Railway/Render/Fly.io

1. Create new application
2. Connect repository
3. Configure environment variables
4. Set build: `cd backend && npm install && npm run build`
5. Set start: `cd backend && npm run start:prod`

### Database - Neon

1. Create project at [Neon](https://neon.tech)
2. Copy connection string
3. Update `DATABASE_URL` in production env vars
4. Run migrations:
   ```bash
   cd backend
   npm run migration:run
   npm run seed
   ```

## 📝 Available Scripts

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build

### Backend
- `npm run start:dev` - Development server with hot-reload
- `npm run start:prod` - Production server
- `npm run build` - Compile TypeScript
- `npm run seed` - Run database seeds
- `npm run migration:generate` - Generate new migration
- `npm run migration:run` - Run migrations

## 🔧 Development

### Logo Scaling

Logos use CSS `transform: scale()` for size without affecting layout:

**Header**:
```css
h-20 md:h-24 lg:h-28 scale-125 md:scale-150
```

**Footer**:
```css
h-20 scale-[2] origin-center md:origin-left
```

### Adding New Services

1. Use POST `/api/services` endpoint or add to seed
2. Upload service image
3. Service appears automatically on site

## 🐛 Troubleshooting

### Database Connection Issues

1. Verify Docker is running: `docker ps`
2. Check credentials in `.env`
3. Restart containers: `docker-compose restart`

### Migration Errors

```bash
# Drop database and recreate
docker-compose down -v
docker-compose up -d
cd backend && npm run seed
```

### Port Already in Use

Change port in `.env`:
```env
PORT=3001  # or any available port
```

## 📞 Contact

For questions or issues, contact the development team.

## 📄 License

Proprietary project of Living Stone Contractors, LLC.

---

**Built with ❤️ using Astro + NestJS**

**Brand Identity**: Living Stone Contractors Brand Manual 2024
