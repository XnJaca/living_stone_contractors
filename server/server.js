import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import pool from './db/config.js';
import { v2 as cloudinary } from 'cloudinary';

const __dirname_root = fileURLToPath(new URL('..', import.meta.url));
dotenv.config({ path: join(__dirname_root, '.env.local') });

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Admin password from env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Cloudinary configuration
const CLOUDINARY_ENABLED = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️ Cloudinary storage enabled');
} else {
  console.log('📁 Using local file storage');
}

// Function to upload file to Cloudinary
async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'living-stone',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
}

// Function to delete file from Cloudinary
async function deleteFromCloudinary(imageUrl) {
  if (!CLOUDINARY_ENABLED || !imageUrl) return;

  // Only delete if it's a Cloudinary URL
  if (!imageUrl.includes('cloudinary.com')) return;

  try {
    // Extract public_id from URL
    // Example URL: https://res.cloudinary.com/dclhd8w8v/image/upload/v1234567890/living-stone/filename.jpg
    const matches = imageUrl.match(/\/living-stone\/(.+)\.[^.]+$/);
    if (matches && matches[1]) {
      const publicId = `living-stone/${matches[1]}`;
      await cloudinary.uploader.destroy(publicId);
      console.log(`🗑️ Deleted image from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup storage for uploaded files
const uploadDir = join(__dirname, '..', 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage when Cloudinary is enabled, disk storage otherwise
const storage = CLOUDINARY_ENABLED
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${uuidv4()}.${ext}`);
      }
    });

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Helper function to get image URL from uploaded file
async function getImageUrl(file) {
  if (!file) return null;

  if (CLOUDINARY_ENABLED) {
    return await uploadToCloudinary(file);
  } else {
    return `/uploads/${file.filename}`;
  }
}

// Auth middleware
const checkAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ============ AUTH ENDPOINTS ============

// Validate login
app.post('/api/auth/login', (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ============ PAGE CONTENT ENDPOINTS ============

// Get all page content
app.get('/api/pages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages WHERE slug = $1', ['home']);
    const page = result.rows[0] || {};

    res.json({
      home: {
        heroTitle: page.hero_title,
        heroSubtitle: page.hero_subtitle,
        heroDescription: page.hero_description,
        heroImage: page.hero_image,
        aboutTitle: page.about_title,
        aboutDescription: page.about_description
      }
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Update page content
app.put('/api/pages/:page', checkAuth, upload.single('heroImage'), async (req, res) => {
  try {
    const { page } = req.params;

    if (page !== 'home') {
      return res.status(400).json({ error: 'Invalid page' });
    }

    const {
      heroTitle,
      heroSubtitle,
      heroDescription,
      heroImage,
      aboutTitle,
      aboutDescription
    } = req.body;

    const imageUrl = req.file ? await getImageUrl(req.file) : heroImage;

    const result = await pool.query(
      `UPDATE pages
       SET hero_title = $1, hero_subtitle = $2, hero_description = $3,
           hero_image = $4, about_title = $5, about_description = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE slug = $7
       RETURNING *`,
      [heroTitle, heroSubtitle, heroDescription, imageUrl, aboutTitle, aboutDescription, 'home']
    );

    res.json({
      success: true,
      data: {
        heroTitle: result.rows[0].hero_title,
        heroSubtitle: result.rows[0].hero_subtitle,
        heroDescription: result.rows[0].hero_description,
        heroImage: result.rows[0].hero_image,
        aboutTitle: result.rows[0].about_title,
        aboutDescription: result.rows[0].about_description
      }
    });
  } catch (error) {
    console.error('Error updating pages:', error);
    res.status(500).json({ error: 'Failed to update pages' });
  }
});

// ============ SERVICES ENDPOINTS ============

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services ORDER BY "order" ASC, created_at DESC'
    );
    const services = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      content: row.content,
      image: row.image,
      icon: row.icon,
      featured: row.featured,
      order: row.order,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get single service
app.get('/api/services/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      content: row.content,
      image: row.image,
      icon: row.icon,
      featured: row.featured,
      order: row.order,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service
app.post('/api/services', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      content,
      image,
      icon,
      featured,
      order,
      metaTitle,
      metaDescription
    } = req.body;

    const serviceId = uuidv4();
    const imageUrl = req.file ? await getImageUrl(req.file) : image;

    const result = await pool.query(
      `INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [serviceId, title, slug, description, content, imageUrl, icon, featured === 'true', parseInt(order) || 0, metaTitle, metaDescription]
    );

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        content: row.content,
        image: row.image,
        icon: row.icon,
        featured: row.featured,
        order: row.order,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
app.put('/api/services/:id', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      content,
      image,
      icon,
      featured,
      order,
      metaTitle,
      metaDescription
    } = req.body;

    let imageUrl = image;

    // If new image uploaded, delete old one and upload new
    if (req.file) {
      // Get old image URL
      const oldService = await pool.query('SELECT image FROM services WHERE id = $1', [req.params.id]);
      if (oldService.rows.length > 0) {
        await deleteFromCloudinary(oldService.rows[0].image);
      }
      imageUrl = await getImageUrl(req.file);
    }

    const result = await pool.query(
      `UPDATE services
       SET title = $1, slug = $2, description = $3, content = $4, image = $5,
           icon = $6, featured = $7, "order" = $8, meta_title = $9, meta_description = $10,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [title, slug, description, content, imageUrl, icon, featured === 'true', parseInt(order) || 0, metaTitle, metaDescription, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        content: row.content,
        image: row.image,
        icon: row.icon,
        featured: row.featured,
        order: row.order,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
app.delete('/api/services/:id', checkAuth, async (req, res) => {
  try {
    // First get the service to retrieve the image URL
    const service = await pool.query('SELECT image FROM services WHERE id = $1', [req.params.id]);

    if (service.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Delete the image from Cloudinary
    await deleteFromCloudinary(service.rows[0].image);

    // Delete the service from database
    await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ============ TESTIMONIALS ENDPOINTS ============

// Get all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );
    const testimonials = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      company: row.company,
      content: row.content,
      rating: row.rating,
      image: row.image,
      featured: row.featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Get single testimonial
app.get('/api/testimonials/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      company: row.company,
      content: row.content,
      rating: row.rating,
      image: row.image,
      featured: row.featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

// Create testimonial
app.post('/api/testimonials', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, company, content, rating, image, featured } = req.body;
    const testimonialId = uuidv4();
    const imageUrl = req.file ? await getImageUrl(req.file) : image;

    const result = await pool.query(
      `INSERT INTO testimonials (id, name, company, content, rating, image, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [testimonialId, name, company, content, parseInt(rating) || 5, imageUrl, featured === 'true']
    );

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        company: row.company,
        content: row.content,
        rating: row.rating,
        image: row.image,
        featured: row.featured
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// Update testimonial
app.put('/api/testimonials/:id', checkAuth, async (req, res) => {
  try {
    const { name, company, content, rating, featured } = req.body;

    const result = await pool.query(
      `UPDATE testimonials
       SET name = $1, company = $2, content = $3, rating = $4, featured = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [name, company, content, parseInt(rating) || 5, featured === 'true', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        company: row.company,
        content: row.content,
        rating: row.rating,
        image: row.image,
        featured: row.featured
      }
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// Delete testimonial
app.delete('/api/testimonials/:id', checkAuth, async (req, res) => {
  try {
    // First get the testimonial to retrieve the image URL
    const testimonial = await pool.query('SELECT image FROM testimonials WHERE id = $1', [req.params.id]);

    if (testimonial.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Delete the image from Cloudinary
    await deleteFromCloudinary(testimonial.rows[0].image);

    // Delete the testimonial from database
    await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ============ CONTACT ENDPOINTS ============

// Get contact info
app.get('/api/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_info LIMIT 1');
    const contact = result.rows[0] || {};

    res.json({
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      hours: contact.hours
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Update contact info
app.put('/api/contact', checkAuth, async (req, res) => {
  try {
    const { email, phone, address, hours } = req.body;

    const result = await pool.query(
      `UPDATE contact_info
       SET email = $1, phone = $2, address = $3, hours = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = (SELECT id FROM contact_info LIMIT 1)
       RETURNING *`,
      [email, phone, address, hours]
    );

    if (result.rows.length === 0) {
      // If no existing contact, create one
      await pool.query(
        `INSERT INTO contact_info (email, phone, address, hours) VALUES ($1, $2, $3, $4)`,
        [email, phone, address, hours]
      );
    }

    res.json({
      success: true,
      data: {
        email,
        phone,
        address,
        hours
      }
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from public directory (for uploads, etc.)
app.use(express.static(join(__dirname, '..', 'public')));

// In production, serve the built Astro frontend using SSR
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');

  // Serve static assets from client directory
  app.use(express.static(join(distPath, 'client')));

  // Import and use Astro SSR handler
  import(join(distPath, 'server', 'entry.mjs')).then(({ handler }) => {
    app.use(handler);
  }).catch(err => {
    console.error('Failed to load Astro handler:', err);
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Serving frontend from dist/`);
  }
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin/`);
});
