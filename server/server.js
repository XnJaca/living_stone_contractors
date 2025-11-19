import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Admin password from env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Setup storage for uploaded files
const uploadDir = join(__dirname, '..', 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${uuidv4()}.${ext}`);
  }
});

const upload = multer({ storage });

// Data file paths
const dataDir = join(__dirname, '..', 'public', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const getPagesPath = () => join(dataDir, 'pages.json');
const getServicesPath = () => join(dataDir, 'services.json');
const getTestimonialsPath = () => join(dataDir, 'testimonials.json');
const getContactPath = () => join(dataDir, 'contact.json');

// Helper functions to read/write JSON
const readData = (path, defaultValue = {}) => {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error reading ${path}:`, error);
  }
  return defaultValue;
};

const writeData = (path, data) => {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${path}:`, error);
    return false;
  }
};

// Auth middleware
const checkAuth = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ============ PAGE CONTENT ENDPOINTS ============

// Get all page content
app.get('/api/pages', (req, res) => {
  const pages = readData(getPagesPath(), {
    home: {
      heroTitle: 'Transform Your Home',
      heroSubtitle: 'Build Your Dreams',
      heroDescription: 'Transforming spaces into functional, modern, and durable places',
      heroImage: '/images/placeholders/hero-bg.png',
      aboutTitle: 'About Living Stone Contractors',
      aboutDescription: 'We specialize in home remodeling and improvement...'
    },
    about: {
      title: 'About Us',
      content: 'We are a professional home remodeling company...'
    },
    contact: {
      email: 'lstonecontractors@gmail.com',
      phone: '+1-123-456-7890',
      address: '123 Main St, City, State 12345'
    }
  });
  res.json(pages);
});

// Update page content
app.put('/api/pages/:page', checkAuth, async (req, res) => {
  const { page } = req.params;
  const pages = readData(getPagesPath(), {});
  pages[page] = { ...pages[page], ...req.body };

  if (writeData(getPagesPath(), pages)) {
    res.json({ success: true, data: pages[page] });
  } else {
    res.status(500).json({ error: 'Failed to update page' });
  }
});

// ============ SERVICES ENDPOINTS ============

// Get all services
app.get('/api/services', (req, res) => {
  const services = readData(getServicesPath(), []);
  res.json(services);
});

// Get single service
app.get('/api/services/:id', (req, res) => {
  const services = readData(getServicesPath(), []);
  const service = services.find(s => s.id === req.params.id);
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Create service
app.post('/api/services', checkAuth, upload.single('image'), async (req, res) => {
  const services = readData(getServicesPath(), []);

  const newService = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-'),
    content: req.body.content || '',
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
    icon: req.body.icon || '',
    featured: req.body.featured === 'true',
    order: parseInt(req.body.order) || 0,
    metaTitle: req.body.metaTitle || '',
    metaDescription: req.body.metaDescription || '',
    createdAt: new Date().toISOString()
  };

  services.push(newService);

  if (writeData(getServicesPath(), services)) {
    res.json({ success: true, data: newService });
  } else {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
app.put('/api/services/:id', checkAuth, upload.single('image'), (req, res) => {
  const services = readData(getServicesPath(), []);
  const index = services.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const updatedService = {
    ...services[index],
    title: req.body.title || services[index].title,
    description: req.body.description || services[index].description,
    slug: req.body.slug || services[index].slug,
    content: req.body.content || services[index].content,
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || services[index].image),
    icon: req.body.icon !== undefined ? req.body.icon : services[index].icon,
    featured: req.body.featured !== undefined ? req.body.featured === 'true' : services[index].featured,
    order: req.body.order !== undefined ? parseInt(req.body.order) : services[index].order,
    metaTitle: req.body.metaTitle || services[index].metaTitle,
    metaDescription: req.body.metaDescription || services[index].metaDescription,
    updatedAt: new Date().toISOString()
  };

  services[index] = updatedService;

  if (writeData(getServicesPath(), services)) {
    res.json({ success: true, data: updatedService });
  } else {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
app.delete('/api/services/:id', checkAuth, (req, res) => {
  const services = readData(getServicesPath(), []);
  const filteredServices = services.filter(s => s.id !== req.params.id);

  if (services.length === filteredServices.length) {
    return res.status(404).json({ error: 'Service not found' });
  }

  if (writeData(getServicesPath(), filteredServices)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ============ TESTIMONIALS ENDPOINTS ============

// Get all testimonials
app.get('/api/testimonials', (req, res) => {
  const testimonials = readData(getTestimonialsPath(), []);
  res.json(testimonials);
});

// Create testimonial
app.post('/api/testimonials', checkAuth, (req, res) => {
  const testimonials = readData(getTestimonialsPath(), []);

  const newTestimonial = {
    id: uuidv4(),
    name: req.body.name,
    company: req.body.company || '',
    content: req.body.content,
    rating: parseInt(req.body.rating) || 5,
    image: req.body.image || '',
    featured: req.body.featured === 'true',
    createdAt: new Date().toISOString()
  };

  testimonials.push(newTestimonial);

  if (writeData(getTestimonialsPath(), testimonials)) {
    res.json({ success: true, data: newTestimonial });
  } else {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// Update testimonial
app.put('/api/testimonials/:id', checkAuth, (req, res) => {
  const testimonials = readData(getTestimonialsPath(), []);
  const index = testimonials.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }

  const updatedTestimonial = {
    ...testimonials[index],
    name: req.body.name || testimonials[index].name,
    company: req.body.company || testimonials[index].company,
    content: req.body.content || testimonials[index].content,
    rating: req.body.rating !== undefined ? parseInt(req.body.rating) : testimonials[index].rating,
    image: req.body.image || testimonials[index].image,
    featured: req.body.featured !== undefined ? req.body.featured === 'true' : testimonials[index].featured,
    updatedAt: new Date().toISOString()
  };

  testimonials[index] = updatedTestimonial;

  if (writeData(getTestimonialsPath(), testimonials)) {
    res.json({ success: true, data: updatedTestimonial });
  } else {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// Delete testimonial
app.delete('/api/testimonials/:id', checkAuth, (req, res) => {
  const testimonials = readData(getTestimonialsPath(), []);
  const filteredTestimonials = testimonials.filter(t => t.id !== req.params.id);

  if (testimonials.length === filteredTestimonials.length) {
    return res.status(404).json({ error: 'Testimonial not found' });
  }

  if (writeData(getTestimonialsPath(), filteredTestimonials)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ============ CONTACT ENDPOINTS ============

// Get contact info
app.get('/api/contact', (req, res) => {
  const contact = readData(getContactPath(), {
    email: 'lstonecontractors@gmail.com',
    phone: '+1-123-456-7890',
    address: '123 Main St, City, State 12345',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM'
  });
  res.json(contact);
});

// Update contact info
app.put('/api/contact', checkAuth, (req, res) => {
  const contact = readData(getContactPath(), {});
  const updated = { ...contact, ...req.body };

  if (writeData(getContactPath(), updated)) {
    res.json({ success: true, data: updated });
  } else {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from public directory
app.use(express.static(join(__dirname, '..', 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Admin API running on http://localhost:${PORT}`);
});
