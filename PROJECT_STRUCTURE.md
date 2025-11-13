# Living Stone Contractors - Project Structure

This is a monorepo project containing both frontend (Astro) and backend (NestJS) applications.

## 📁 Root Directory Structure

```
living_stone_contractors/
├── 🎨 Frontend (Astro)
│   ├── src/                    # Frontend source code
│   │   ├── components/        # Reusable Astro components
│   │   ├── content/           # Content collections (services)
│   │   ├── layouts/           # Page layouts
│   │   ├── pages/             # Route pages
│   │   └── styles/            # Global styles
│   │
│   ├── public/                # Static assets
│   │   ├── images/           # Images and media
│   │   ├── favicon.ico       # Website favicon
│   │   └── robots.txt        # SEO robots file
│   │
│   ├── astro.config.mjs      # Astro configuration
│   ├── tailwind.config.mjs   # Tailwind CSS configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── package.json          # Frontend dependencies
│   └── package-lock.json     # Locked dependency versions
│
├── 🔧 Backend (NestJS)
│   └── backend/              # Backend application directory
│       ├── src/              # Backend source code
│       │   ├── modules/     # Feature modules
│       │   ├── database/    # Entities, migrations, seeds
│       │   └── config/      # Configuration files
│       │
│       ├── dist/            # Compiled JavaScript (build output)
│       ├── package.json     # Backend dependencies
│       └── tsconfig.json    # Backend TypeScript config
│
├── 📚 Documentation
│   └── docs/
│       └── brand-assets/    # Brand manual and official logos
│           └── 1. Logo_LSC/ # Official logo files (PNG, JPG, PDF)
│
├── 🐳 Infrastructure
│   ├── docker-compose.yaml  # PostgreSQL database container
│   ├── .env.example         # Environment variables template
│   └── .env                 # Local environment variables (gitignored)
│
└── 📄 Project Files
    ├── README.md            # Main project documentation
    ├── PROJECT_STRUCTURE.md # This file
    └── .gitignore          # Git ignore rules
```

## 🎯 Key Directories

### Frontend (Astro) - Root Level
The frontend lives at the **root level** of the project because Astro requires its configuration files and directories (`src/`, `public/`, etc.) to be in the project root.

**Main Files:**
- `astro.config.mjs` - Astro configuration (sitemap, integrations)
- `tailwind.config.mjs` - Brand colors, fonts, and Tailwind configuration
- `tsconfig.json` - TypeScript compiler options

**Source Code** (`src/`):
- `components/` - Header, Footer, ServiceCard, etc.
- `pages/` - Routes (index, about, contact, services)
- `layouts/` - BaseLayout with SEO, MainLayout with Header/Footer
- `content/` - Markdown content for services
- `styles/` - Global CSS and Tailwind directives

**Static Assets** (`public/`):
- `images/logos/` - Official brand logos
- `images/placeholders/` - Service images
- `favicon.ico` - Brand favicon
- `robots.txt` - SEO configuration

### Backend (NestJS) - `/backend`
The backend is contained in its own directory with its own `package.json` and dependencies.

**Structure:**
- `src/modules/` - Authentication, Services, Gallery, Contact modules
- `src/database/` - TypeORM entities, migrations, and seed scripts
- `src/config/` - Database and application configuration
- `dist/` - Compiled build output (gitignored)

### Documentation - `/docs`
All project documentation and brand assets are organized here:
- `brand-assets/1. Logo_LSC/` - Official logos in multiple formats
- Brand manual PDF with official colors and guidelines

## 🚀 Running the Project

### Frontend (Development)
```bash
npm install              # Install frontend dependencies
npm run dev             # Start Astro dev server (localhost:4321)
```

### Backend (Development)
```bash
cd backend
npm install             # Install backend dependencies
npm run start:dev       # Start NestJS dev server (localhost:3000)
```

### Database (Docker)
```bash
docker-compose up -d    # Start PostgreSQL container
cd backend
npm run seed           # Run database migrations and seeds
```

## 📦 Separate Dependency Management

Each part of the monorepo has its own dependencies:

- **Frontend**: `package.json` (root) - Astro, Tailwind, etc.
- **Backend**: `backend/package.json` - NestJS, TypeORM, etc.

Both use npm and have separate `node_modules/` and `package-lock.json` files.

## 🔄 Build Process

### Frontend Build
```bash
npm run build           # Creates dist/ folder with static site
```

### Backend Build
```bash
cd backend
npm run build          # Creates backend/dist/ with compiled JS
```

## 📝 Notes

- **Why is frontend at root?** Astro projects require their configuration and source files at the root level. This is standard for Astro monorepos.

- **Why separate backend?** The backend is a completely separate NestJS application with its own dependencies, build process, and deployment strategy.

- **Deployment**: Frontend and backend can be deployed independently to different services (e.g., Vercel for frontend, Railway for backend).

## 🎨 Brand Assets Location

All brand-related assets are centralized:
- **Brand Manual**: `docs/brand-assets/1. Logo_LSC/MANUAL_Living Stone Contractors.pdf`
- **Official Logos**: `docs/brand-assets/1. Logo_LSC/PNG - unicolor/`
- **Web Logos**: `public/images/logos/` (optimized copies for web)

## 🔐 Environment Variables

- Frontend uses: Site URL, API endpoint
- Backend uses: Database credentials, JWT secrets, admin credentials

See `.env.example` for required variables.

---

**Last Updated**: November 2025
**Structure Version**: 1.0
