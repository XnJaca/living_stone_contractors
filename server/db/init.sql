-- Create tables for Living Stone Contractors Admin Panel

-- Pages table (hero, about content)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  hero_title VARCHAR(255),
  hero_subtitle VARCHAR(255),
  hero_description TEXT,
  hero_image VARCHAR(255),
  about_title VARCHAR(255),
  about_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  image VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image VARCHAR(255),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  hours TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Insert default page data
INSERT INTO pages (slug, hero_title, hero_subtitle, hero_description, hero_image, about_title, about_description)
VALUES (
  'home',
  'Transform Your Home',
  'Build Your Dreams',
  'Transforming spaces into functional, modern, and durable places',
  '/images/placeholders/hero-bg.png',
  'About Living Stone Contractors',
  'We specialize in home remodeling and improvement...'
) ON CONFLICT DO NOTHING;

-- Insert default contact info
INSERT INTO contact_info (email, phone, address, hours)
VALUES (
  'lstonecontractors@gmail.com',
  '+1-123-456-7890',
  '123 Main St, City, State 12345',
  'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM'
) ON CONFLICT DO NOTHING;
