# Living Stone Contractors - Complete Setup Guide

## 📋 Overview

You now have a complete admin panel system with:
- ✅ PostgreSQL database (persistent data)
- ✅ Express.js API server
- ✅ Beautiful admin dashboard
- ✅ Docker setup for local development
- ✅ Ready for production on Render + Neon

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Client Browser                  │
│  (Visitors see the Astro website)       │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
   ┌─────▼────────┐  ┌───▼──────────────┐
   │  Astro Site  │  │  Admin Panel     │
   │  (Static)    │  │  (Dynamic)       │
   │              │  │  /admin/         │
   └─────┬────────┘  └───┬──────────────┘
         │                │
         └────────┬───────┘
                  │
           ┌──────▼───────────┐
           │  Express API     │
           │  (Node.js)       │
           │  localhost:3001  │
           └──────┬───────────┘
                  │
           ┌──────▼───────────┐
           │ PostgreSQL DB    │
           │ (Neon/Docker)    │
           │ Persistent Data  │
           └──────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Step 1: Clone and Install

```bash
cd living_stone_contractors
npm install
```

### Step 2: Start PostgreSQL

```bash
docker-compose up -d
```

Verify:
```bash
docker ps | grep living_stone_db
```

### Step 3: Run Development Server

```bash
npm run dev
```

This starts both:
- **Astro Dev Server**: http://localhost:3000
- **API Server**: http://localhost:3001

### Step 4: Access Admin Panel

1. Open: http://localhost:3001/admin/
2. Password: `admin123`
3. Start editing!

---

## 📁 Project Structure

```
living_stone_contractors/
├── src/
│   ├── pages/           # Astro pages
│   ├── components/      # Astro components
│   ├── layouts/         # Page layouts
│   └── content/         # Content collection (services, etc)
│
├── server/
│   ├── server.js        # Express API
│   ├── package.json     # Server dependencies
│   └── db/
│       ├── config.js    # PostgreSQL connection pool
│       └── init.sql     # Database schema
│
├── public/
│   ├── admin/           # Admin panel UI
│   │   ├── index.html
│   │   └── app.js
│   └── uploads/         # User uploaded images
│
├── docker-compose.yaml  # PostgreSQL container setup
├── .env.local          # Local environment variables
├── package.json        # Main project dependencies
└── README.md           # Project documentation
```

---

## 🛠️ Commands Reference

### Development

```bash
# Start everything (Astro + API + Docker)
npm run dev

# Start API server only
npm run server:dev

# Start Astro only
npm start

# Build for production
npm run build
```

### Docker

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs db

# Enter PostgreSQL shell
docker-compose exec db psql -U postgres -d living_stone
```

### Database

```bash
# Connect to local database
psql postgresql://postgres:postgres@localhost:5432/living_stone

# List all tables
\dt

# View services table
SELECT * FROM services;

# Exit
\q
```

---

## 🌍 Local Development Workflow

### 1. Edit Website Content

**Option A: Through Admin Panel**
1. Go to http://localhost:3001/admin/
2. Login with password
3. Edit content
4. Changes appear immediately on website

**Option B: Edit Source Files**
1. Edit files in `src/`
2. Astro hot-reloads automatically
3. Visit http://localhost:3000

### 2. Database

Data is automatically persisted in PostgreSQL. When you restart:
```bash
docker-compose down
docker-compose up -d
npm run dev
```

All your changes are still there! ✅

---

## 🚢 Production Deployment (Render + Neon)

### Step 1: Create Neon Account

1. Go to https://console.neon.tech
2. Sign up (free)
3. Create new project
4. Copy connection string

### Step 2: Create Render Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: `living-stone-contractors`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

### Step 3: Add Environment Variables

In Render dashboard:
```
DATABASE_URL = (paste Neon connection string)
ADMIN_PASSWORD = (strong password)
```

### Step 4: Deploy Schema to Neon

Option A - SQL Editor:
1. Go to Neon console
2. Click "SQL Editor"
3. Paste `server/db/init.sql`
4. Execute

Option B - CLI:
```bash
psql (neon_connection_string) < server/db/init.sql
```

### Step 5: Deploy

1. Click "Deploy" in Render
2. Wait for build
3. Done! 🎉

### Step 6: Test

Visit: `https://your-app.onrender.com/admin/`

---

## 📊 What Client Can Edit

| Feature | Where | What |
|---------|-------|------|
| **Pages** | /admin/ → Pages Content | Hero text, images, about section |
| **Services** | /admin/ → Services | Add/edit/delete services |
| **Testimonials** | /admin/ → Testimonials | Client reviews with ratings |
| **Contact** | /admin/ → Contact Info | Email, phone, address, hours |

---

## 🔑 Important Notes

### Default Password
- Local: `admin123` (change before production)
- Production: Set via `ADMIN_PASSWORD` env variable

### Database
- Local: PostgreSQL in Docker
- Production: Neon PostgreSQL (serverless)

### Data Persistence
- ✅ All changes persist automatically
- ✅ Database backups included (Neon)
- ✅ No manual export/import needed

### File Uploads
- Images stored in `public/uploads/`
- Support for jpg, png, gif, webp
- Max 50MB per file

---

## 🐛 Troubleshooting

### "Port 5432 already in use"
```bash
# Kill existing process
lsof -ti:5432 | xargs kill -9

# Or change port in docker-compose.yaml
```

### "Database connection refused"
```bash
# Restart Docker
docker-compose down
docker-compose up -d
```

### "Admin panel shows blank page"
1. Check browser console (F12)
2. Verify API is running on :3001
3. Check network tab for errors

### "Password incorrect"
- Make sure you're using the right password
- Passwords are case-sensitive
- Clear browser cache

---

## 📈 Performance Tips

1. **Database Indexes**: Already created on frequently queried columns
2. **Connection Pooling**: Max 20 connections (adjustable in `config.js`)
3. **API Response**: All queries are optimized
4. **Image Optimization**: Use compressed images

---

## 🔒 Security Checklist

- [ ] Change default password from `admin123`
- [ ] Use strong password (mix of letters, numbers, symbols)
- [ ] Keep `.env.local` out of Git (already in `.gitignore`)
- [ ] Don't share admin password unencrypted
- [ ] Render provides HTTPS automatically
- [ ] Regular backups (Neon: 7-30 days automatic)

---

## 📚 Files You Created

### Core Files
- `server/server.js` - Express API
- `server/db/config.js` - Database connection
- `server/db/init.sql` - Database schema
- `public/admin/index.html` - Admin UI
- `public/admin/app.js` - Admin logic

### Configuration
- `docker-compose.yaml` - Docker setup
- `.env.local` - Local environment
- `render.yaml` - Render deployment

### Documentation
- `ADMIN_SETUP.md` - Admin setup
- `NEON_SETUP.md` - Neon + Render
- `CLIENT_GUIDE.md` - Client instructions
- `COMPLETE_SETUP_GUIDE.md` - This file

---

## 🎯 Next Steps

### Immediate (Before Production)
1. [ ] Test everything locally with `npm run dev`
2. [ ] Create Neon account
3. [ ] Create Render service
4. [ ] Deploy schema to Neon
5. [ ] Deploy to Render
6. [ ] Change admin password
7. [ ] Give client login credentials

### Optional (Nice to Have)
- [ ] Add more services/testimonials
- [ ] Customize admin panel styling
- [ ] Add email notifications on changes
- [ ] Setup automated backups
- [ ] Create API documentation

---

## 📞 Support Resources

### Documentation
- [Neon Docs](https://neon.tech/docs)
- [Render Docs](https://render.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Express.js Docs](https://expressjs.com/)
- [Astro Docs](https://docs.astro.build/)

### Problem Solving
1. Check error logs in Render dashboard
2. Check browser console (F12)
3. Check PostgreSQL logs: `docker-compose logs db`
4. Review documentation files in this project

---

## ✅ You're All Set!

Your admin panel is now:
- ✅ Built
- ✅ Documented
- ✅ Ready for local development
- ✅ Ready for production deployment

**Start with:** `npm run dev`

**Deploy with:** Follow steps in "Production Deployment" section

**Questions?** Check the documentation files in the project root.

**Happy coding! 🚀**
