# Neon PostgreSQL Setup for Production

## Overview

This guide covers setting up Neon PostgreSQL for production deployment on Render.

Neon provides:
- ✅ Serverless PostgreSQL
- ✅ Free tier (up to 3 projects)
- ✅ Auto-scaling
- ✅ Connection pooling
- ✅ Automatic backups

---

## Local Development Setup

### Step 1: Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `living_stone`
- User: `postgres`
- Password: `postgres`

### Step 2: Verify Connection

```bash
# Check if container is running
docker ps | grep living_stone_db

# Test connection
docker exec living_stone_db psql -U postgres -d living_stone -c "SELECT 1"
```

### Step 3: Run Development Server

```bash
npm run dev
```

The server will:
1. Connect to PostgreSQL
2. Create tables automatically (if not exist)
3. Start Express API on `http://localhost:3001`
4. Start Astro dev server on `http://localhost:3000`

### Step 4: Test Admin Panel

1. Visit: `http://localhost:3001/admin/`
2. Login with: `admin123`
3. Try creating/editing content

---

## Production Setup on Neon + Render

### Step 1: Create Neon Account

1. Go to https://console.neon.tech/
2. Sign up (free)
3. Create a new project

### Step 2: Get Connection String

1. In Neon console, click your project
2. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxxxxx.us-east-1.neon.tech/dbname?sslmode=require
   ```
3. Save it somewhere safe

### Step 3: Configure Render Environment Variables

In your Render service:

1. Go to **Environment**
2. Add these variables:

```
DATABASE_URL = (paste your Neon connection string here)
ADMIN_PASSWORD = (set a strong password)
```

### Step 4: Database Schema

The `init.sql` file has the schema, but for production with Neon, you need to run it manually:

**Option A: Run SQL in Neon Console (Easiest)**

1. In Neon console, click **SQL Editor**
2. Paste contents of `server/db/init.sql`
3. Click **Execute**

**Option B: Use psql CLI**

```bash
psql (connection_string_from_neon) < server/db/init.sql
```

### Step 5: Deploy to Render

Update your `render.yaml`:

```yaml
services:
  - type: web
    name: living-stone-contractors
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: DATABASE_URL
        value: ${DATABASE_URL}
        sync: false
      - key: ADMIN_PASSWORD
        value: ${ADMIN_PASSWORD}
        sync: false
```

Then:
1. Commit and push to GitHub
2. Render auto-deploys
3. Done!

---

## Environment Variables

### Local Development (`.env.local`)

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=living_stone
ADMIN_PASSWORD=admin123
PORT=3001
NODE_ENV=development
```

### Production (Neon + Render)

Just set:
```
DATABASE_URL = (from Neon)
ADMIN_PASSWORD = (your password)
```

The app will detect `DATABASE_URL` and parse it automatically.

---

## Useful Commands

### Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U postgres -d living_stone

# Drop database (careful!)
docker-compose exec db psql -U postgres -c "DROP DATABASE living_stone;"
```

### PostgreSQL Commands

```bash
# Connect
psql postgresql://postgres:postgres@localhost:5432/living_stone

# List tables
\dt

# View table structure
\d services

# Run SQL file
\i server/db/init.sql

# Exit
\q
```

---

## Backup & Export

### Export Data from Neon

```bash
pg_dump (connection_string) > backup.sql
```

### Restore Data

```bash
psql (connection_string) < backup.sql
```

---

## Troubleshooting

### Connection Refused

**Local:**
- Make sure Docker container is running: `docker ps`
- Check logs: `docker-compose logs db`

**Production:**
- Verify `DATABASE_URL` is set correctly in Render
- Check Render logs for connection errors
- Ensure IP is whitelisted in Neon (usually automatic)

### Tables Don't Exist

**Local:**
- Run schema: `docker-compose exec db psql -U postgres -d living_stone < server/db/init.sql`

**Production:**
- Run SQL in Neon console
- Or use psql CLI with Neon connection string

### Slow Queries

- Check indexes: `SELECT * FROM pg_indexes;`
- Monitor in Neon dashboard
- Upgrade Neon plan if needed

---

## Scaling

When you grow:

1. **Neon Free** → **Neon Pro** ($15/mo)
2. **Render Free** → **Render Paid** ($7+/mo)
3. Both scale automatically

---

## Cost Estimate

| Component | Free Tier | Cost |
|-----------|-----------|------|
| Neon PostgreSQL | ✅ (up to 3 projects) | Free - $15/mo |
| Render Hosting | ✅ (limited) | Free - $7/mo |
| Total | **$0/month** | ~$7-15/mo if upgraded |

---

## Security

1. **Connection String**: Keep it secret, never commit
2. **SSL**: Neon requires SSL (automatic)
3. **Admin Password**: Use strong password
4. **Backups**: Neon auto-backups (free tier: 7 days)

---

## Next Steps

1. Create Neon account
2. Copy connection string
3. Set env vars in Render
4. Run schema in Neon console
5. Deploy and test

---

## Support

- Neon Docs: https://neon.tech/docs
- Render Docs: https://render.com/docs
- PostgreSQL: https://www.postgresql.org/docs/
