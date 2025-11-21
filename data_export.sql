--
-- PostgreSQL database dump
--

\restrict H2uEkfbvOaeuNuVijFX5kUYZpIIw8TnF5Gy5x68PwPZTfrNcylRbSqZ4SEtCCKk

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg13+1)
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.contact_info (id, email, phone, address, hours, created_at, updated_at) VALUES ('df0b2e23-af43-4cb6-ab4a-3a822edc6364', 'lstonecontractors@gmail.com', '(202) 373-8568', 'Germantown, MD 20874', 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM', '2025-11-19 14:26:53.679426', '2025-11-19 15:30:09.419339');


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pages (id, slug, hero_title, hero_subtitle, hero_description, hero_image, about_title, about_description, created_at, updated_at) VALUES ('f4bf0fdd-41cc-4e9b-bf9b-211c1c74b4b4', 'home', 'Transform Your Home', 'Build Your Dreams', 'Transforming spaces into functional, modern, and durable places', '/images/placeholders/hero-bg.png', 'About Living Stone Contractors', 'We specialize in home remodeling and improvement...', '2025-11-19 14:26:53.676198', '2025-11-19 15:31:08.618524');


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('8feb247e-8855-4148-862c-a77bd0185f59', 'Exterior', 'exterior', 'Enhance your home''s curb appeal and protection with our professional exterior renovation services.', '## Exterior Renovation Services

Protect and beautify your home with our comprehensive exterior renovation services. We specialize in enhancing both the aesthetics and functionality of your home''s exterior.

### Services Include

- Exterior painting and finishing
- Trim and fascia work
- Window and door replacement
- Deck and porch construction
- Landscape integration
- Weather protection solutions

### Benefits

- Increased home value
- Enhanced curb appeal
- Improved energy efficiency
- Weather protection
- Long-lasting materials

### Quality Guarantee

We use only premium materials designed to withstand the elements and maintain their beauty for years to come.

Get your free estimate today!', '/images/placeholders/exterior.jpeg', 'mdi:home-outline', true, 2, 'Exterior Renovation Services | Living Stone Contractors', 'Professional exterior renovation and improvement services. Boost your home''s value and curb appeal.', '2025-11-19 14:45:43.274197', '2025-11-19 14:45:43.274197');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('a5467c49-ce35-4c01-8903-fb4f864e815a', 'Additions/Alterations', 'additions-alterations', 'Expand your living space with custom home additions and alterations designed to seamlessly blend with your existing structure.', '## Home Additions & Alterations

Need more space? Our custom additions and alterations are designed to blend seamlessly with your existing home while providing the extra room you need.

### Services

- Room additions
- Second story additions
- Garage conversions
- Structural alterations
- Open floor plan conversions
- Sunrooms and enclosed porches

### Our Approach

We carefully assess your home''s structure and design additions that complement your existing architecture while meeting all building codes and regulations.

### Planning Process

1. Initial consultation and site assessment
2. Design and architectural planning
3. Permit acquisition
4. Construction and project management
5. Final inspection and completion

Expand your home the right way with Living Stone Contractors.', '/images/placeholders/addition.jpeg', 'mdi:home-plus-outline', true, 3, 'Home Additions & Alterations | Living Stone Contractors', 'Expert home additions and alterations. Add space and value to your home with our professional construction services.', '2025-11-19 14:45:43.275046', '2025-11-19 14:45:43.275046');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('2caa58b9-7f4a-47d5-9ca8-d857996d19f0', 'Masonry', 'masonry', 'Expert masonry services for both structural and decorative stonework. Quality craftsmanship that stands the test of time.', '## Professional Masonry Services

Our skilled masons provide expert stonework and masonry services for both structural and decorative applications.

### Services Include

- Brick and stone installation
- Chimney construction and repair
- Retaining walls
- Stone veneer
- Patio and walkway construction
- Foundation repair

### Materials We Work With

- Natural stone
- Brick
- Concrete block
- Manufactured stone
- Flagstone

### Quality Craftsmanship

With decades of combined experience, our masonry team delivers work that stands the test of time. We take pride in every project, no matter the size.

Contact us for expert masonry services.', '/images/placeholders/masonry.png', 'mdi:wall', true, 4, 'Professional Masonry Services | Living Stone Contractors', 'Expert masonry and stonework services. From repairs to new installations, we deliver quality craftsmanship.', '2025-11-19 14:45:43.276185', '2025-11-19 14:45:43.276185');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('989b01f9-a9a2-4bd8-9667-0d843dbfd593', 'Kitchens and Baths', 'kitchens-baths', 'Create the kitchen and bathroom of your dreams with our complete remodeling services. From design to completion.', '## Kitchen & Bathroom Remodeling

Transform the most important rooms in your home with our comprehensive kitchen and bathroom remodeling services.

### Kitchen Services

- Complete kitchen renovations
- Cabinet installation and refacing
- Countertop installation
- Kitchen island design
- Appliance installation
- Lighting and electrical

### Bathroom Services

- Full bathroom remodels
- Shower and tub installation
- Vanity and storage solutions
- Tile work
- Plumbing updates
- Accessibility modifications

### Design Excellence

Our design team works with you to create spaces that are both beautiful and functional, maximizing your investment.

Schedule your design consultation today!', '/images/placeholders/kitchens_baths.png', 'mdi:countertop-outline', true, 5, 'Kitchen & Bath Remodeling | Living Stone Contractors', 'Transform your kitchen and bathroom with our expert remodeling services. Custom designs and quality installation.', '2025-11-19 14:45:43.276846', '2025-11-19 14:45:43.276846');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('f337e617-8f15-4776-9f2c-4d68de445302', 'Siding', 'siding', 'Protect and beautify your home with quality siding installation. Energy-efficient options with lasting durability.', '## Siding Installation & Replacement

Upgrade your home''s exterior with new siding that protects and beautifies while improving energy efficiency.

### Siding Options

- Vinyl siding
- Fiber cement
- Wood siding
- Engineered wood
- Metal siding
- Composite materials

### Benefits of New Siding

- Improved curb appeal
- Better insulation
- Lower energy costs
- Reduced maintenance
- Increased home value
- Weather protection

### Professional Installation

Our certified installers ensure your siding is properly installed for maximum performance and longevity.

Get a free siding estimate today!', '/images/placeholders/exterior.jpeg', 'mdi:texture-box', false, 6, 'Siding Installation & Replacement | Living Stone Contractors', 'Professional siding installation and replacement services. Improve your home''s appearance and energy efficiency.', '2025-11-19 14:45:43.277346', '2025-11-19 14:45:43.277346');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('65a348e8-c26d-40db-ad68-0aa4eeb5009e', 'Basements', 'basements', 'Unlock your home''s potential with professional basement finishing and remodeling. Create the extra space you need.', '## Basement Finishing & Remodeling

Transform your basement from unused space into valuable living area with our professional finishing services.

### Popular Basement Projects

- Family rooms and entertainment areas
- Home offices
- Guest suites
- Home gyms
- Playrooms
- Home theaters

### Our Services Include

- Framing and insulation
- Drywall installation
- Flooring
- Electrical and lighting
- Plumbing for bathrooms
- Egress windows

### Moisture Control

We address moisture issues before finishing to ensure your new space stays dry and comfortable.

Unlock your basement''s potential today!', '/images/placeholders/interior.jpeg', 'mdi:stairs-down', false, 7, 'Basement Finishing & Remodeling | Living Stone Contractors', 'Transform your basement into valuable living space. Expert basement finishing and remodeling services.', '2025-11-19 14:45:43.277846', '2025-11-19 14:45:43.277846');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('1e0583f7-18c1-4ec0-b5bf-f675a034a257', 'Roofing', 'roofing', 'Protect your home with professional roofing services. Installation, repair, and replacement by experienced craftsmen.', '## Professional Roofing Services

Your roof is your home''s first line of defense. Trust our experienced team for all your roofing needs.

### Services

- New roof installation
- Roof replacement
- Roof repairs
- Emergency services
- Inspections
- Maintenance

### Roofing Materials

- Asphalt shingles
- Metal roofing
- Slate
- Tile
- Flat roofing systems

### Why Choose Us?

- Licensed and insured
- Manufacturer certifications
- Warranty protection
- Quality materials
- Expert installation

Protect your home with a quality roof from Living Stone Contractors.', '/images/placeholders/roofing.png', 'mdi:home-roof', true, 8, 'Professional Roofing Services | Living Stone Contractors', 'Expert roofing installation, repair, and replacement. Protect your home with quality roofing services.', '2025-11-19 14:45:43.279323', '2025-11-19 14:45:43.279323');
INSERT INTO public.services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description, created_at, updated_at) VALUES ('a903e22d-113b-4f68-a795-9d46d87a4292', 'Interior', 'interior', 'Transform your home''s interior with our expert renovation services. From concept to completion, we bring your vision to life.', '## Interior Renovation Services

Transform your living spaces with our comprehensive interior renovation services. Our experienced team specializes in creating beautiful, functional interiors that reflect your style and meet your needs.

### What We Offer

- Custom interior design and planning
- Wall and ceiling installations
- Flooring solutions
- Lighting and electrical updates
- Paint and finish work
- Custom built-ins and storage solutions

### Our Process

1. **Consultation**: We discuss your vision and requirements
2. **Design**: Create detailed plans and material selections
3. **Execution**: Professional installation with minimal disruption
4. **Completion**: Final walkthrough and your satisfaction guaranteed

### Why Choose Us?

- Over 15 years of experience
- Licensed and insured
- Quality materials and craftsmanship
- Transparent pricing
- Customer satisfaction guarantee

Contact us today for a free consultation and estimate.', 'https://res.cloudinary.com/dclhd8w8v/image/upload/v1763745283/living-stone/wfzulgvwosbva3diutfx.jpg', 'mdi:home-interior', true, 1, 'Interior Renovation Services | Living Stone Contractors', 'Professional interior renovation services in your area. Custom designs, quality craftsmanship, and attention to detail.', '2025-11-19 14:45:43.267192', '2025-11-21 17:14:44.216105');


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.testimonials (id, name, company, content, rating, image, featured, created_at, updated_at) VALUES ('a080e647-b417-467b-8eb1-33945264e731', 'John & Sarah M.', NULL, 'Excellent work on our kitchen remodel. Professional, on time, and within budget. Couldn''t be happier with the results!', 5, NULL, true, '2025-11-19 15:13:05.441033', '2025-11-19 15:13:05.441033');
INSERT INTO public.testimonials (id, name, company, content, rating, image, featured, created_at, updated_at) VALUES ('dae368b8-4918-49db-9bbe-eefe137bf9a7', 'Michael R.', NULL, 'Living Stone transformed our basement into a beautiful living space. The attention to detail was outstanding. Highly recommend!', 5, NULL, true, '2025-11-19 15:13:05.441033', '2025-11-19 15:13:05.441033');
INSERT INTO public.testimonials (id, name, company, content, rating, image, featured, created_at, updated_at) VALUES ('2a43791a-fcae-44ed-9b0f-1fd7cfd601cc', 'Patricia L.', NULL, 'New roof looks amazing and was completed ahead of schedule. The crew was respectful and cleaned up perfectly. Five stars!', 5, NULL, true, '2025-11-19 15:13:05.441033', '2025-11-19 15:13:05.441033');


--
-- PostgreSQL database dump complete
--

\unrestrict H2uEkfbvOaeuNuVijFX5kUYZpIIw8TnF5Gy5x68PwPZTfrNcylRbSqZ4SEtCCKk

