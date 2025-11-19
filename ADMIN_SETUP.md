# Admin Panel Setup Guide

## Overview

This project includes a built-in admin panel for managing:
- Page content (Hero, About, etc.)
- Services
- Testimonials
- Contact Information

The admin panel runs on a separate server and stores data in JSON files in the `public/data/` directory.

## Local Development

### Running Both Astro and Admin Server

```bash
npm install
npm run dev
```

This will start:
- **Astro dev server**: http://localhost:3000 (or 3100)
- **Admin API**: http://localhost:3001

### Accessing the Admin Panel Locally

1. Open http://localhost:3001/admin/
2. Login with the default password: `admin123`
3. Start editing content

### Changing the Admin Password

Edit the default password in `server/server.js`:

```javascript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
```

## Deployment to Render

### Step 1: Connect Your GitHub Repository

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Choose "Deploy an existing repository"
4. Select your GitHub repository
5. Click "Connect"

### Step 2: Configure the Service

**Name:** `living-stone-contractors` (or your preferred name)

**Environment:** Node

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start:prod
```

### Step 3: Set Environment Variables

1. In the Render dashboard, go to **"Environment"**
2. Add this environment variable:

```
ADMIN_PASSWORD = your_secure_password_here
```

⚠️ **Important:** Use a strong password! Example: `MySecureAdminPassword123!`

### Step 4: Deploy

Click **"Deploy"** and wait for the build to complete.

Once deployed, your site will be at: `https://your-app-name.onrender.com`

### Step 5: Access the Admin Panel

After deployment, go to:
```
https://your-app-name.onrender.com/admin/
```

Login with the password you set in the environment variables.

## Using the Admin Panel

### Managing Page Content

1. Go to **"Pages Content"** section
2. Edit:
   - Hero title and subtitle
   - Hero description
   - Hero background image URL
   - About section content
3. Click **"Save Pages"**

### Managing Services

1. Go to **"Services"** section
2. Click **"+ Add New Service"** or edit existing ones
3. Fill in:
   - Title
   - Slug (URL-friendly name)
   - Description
   - Content (supports Markdown)
   - Image URL
   - Icon class (optional)
   - Featured (checkbox to highlight)
   - Meta info for SEO
4. Click **"Save Service"**

### Managing Testimonials

1. Go to **"Testimonials"** section
2. Click **"+ Add New Testimonial"**
3. Fill in:
   - Client name
   - Company (optional)
   - Testimonial text
   - Star rating
   - Client photo URL (optional)
   - Mark as featured
4. Click **"Save Testimonial"**

### Managing Contact Info

1. Go to **"Contact Info"** section
2. Update:
   - Email address
   - Phone number
   - Physical address
   - Business hours
3. Click **"Save Contact Info"**

## Data Files

The admin panel stores data in JSON files:

- `public/data/pages.json` - Page content
- `public/data/services.json` - Services data
- `public/data/testimonials.json` - Testimonials
- `public/data/contact.json` - Contact information

⚠️ **Important:** Do NOT manually edit these files. Use the admin panel instead.

## Integrating Admin Data into Pages

To display data from the admin panel on your Astro pages, create Astro components that fetch from the API:

```astro
---
// src/components/AdminContent.astro
const response = await fetch('https://your-app-name.onrender.com/api/pages');
const pages = await response.json();
const home = pages.home || {};
---

<h1>{home.heroTitle}</h1>
<p>{home.heroDescription}</p>
```

## Troubleshooting

### "Connection refused" error

- Make sure the server is running
- Check that port 3001 is available
- On Render, wait 30 seconds after deployment for the server to start

### Admin panel shows blank

- Check browser console for errors (F12)
- Verify the API URL is correct
- Make sure `ADMIN_PASSWORD` environment variable is set

### Images not showing

- Use full URLs (e.g., `https://example.com/image.jpg`)
- Or upload to `public/uploads/` and use `/uploads/filename.jpg`

### Password not working

- Verify the password matches the `ADMIN_PASSWORD` environment variable
- Passwords are case-sensitive
- Clear browser cache and try again

## Security Notes

1. **Use a strong password** - Change from default `admin123`
2. **Use HTTPS** - Render automatically provides HTTPS
3. **Limit access** - Share the admin password only with authorized people
4. **Regular backups** - Download JSON files periodically

## File Structure

```
living-stone-contractors/
├── server/
│   ├── server.js          # Express API server
│   └── package.json       # Server dependencies
├── public/
│   ├── data/              # JSON data files (auto-created)
│   ├── uploads/           # User uploaded images
│   └── admin/
│       ├── index.html     # Admin panel UI
│       └── app.js         # Admin panel JavaScript
├── src/
│   └── ...                # Astro source files
└── package.json           # Main project dependencies
```

## API Endpoints

All endpoints require the `x-admin-password` header:

```javascript
headers: {
  'x-admin-password': 'your_password'
}
```

### Pages
- `GET /api/pages` - Get all page content
- `PUT /api/pages/:page` - Update page content

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Contact
- `GET /api/contact` - Get contact info
- `PUT /api/contact` - Update contact info

## Support

For issues or questions, check:
1. Browser console (F12) for error messages
2. Render logs in the deployment dashboard
3. Verify all environment variables are set correctly
