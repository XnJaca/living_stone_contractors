-- Migration script: Insert existing services into database
-- Run with: psql -h localhost -p 5434 -U postgres -d living_stone -f server/db/migrate-services.sql

-- Clear existing services (optional - comment out if you want to keep existing data)
-- DELETE FROM services;

-- Insert Interior service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Interior',
  'interior',
  'Transform your home''s interior with our expert renovation services. From concept to completion, we bring your vision to life.',
  '## Interior Renovation Services

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

Contact us today for a free consultation and estimate.',
  '/images/placeholders/interior.jpeg',
  'mdi:home-interior',
  true,
  1,
  'Interior Renovation Services | Living Stone Contractors',
  'Professional interior renovation services in your area. Custom designs, quality craftsmanship, and attention to detail.'
);

-- Insert Exterior service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Exterior',
  'exterior',
  'Enhance your home''s curb appeal and protection with our professional exterior renovation services.',
  '## Exterior Renovation Services

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

Get your free estimate today!',
  '/images/placeholders/exterior.jpeg',
  'mdi:home-outline',
  true,
  2,
  'Exterior Renovation Services | Living Stone Contractors',
  'Professional exterior renovation and improvement services. Boost your home''s value and curb appeal.'
);

-- Insert Additions/Alterations service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Additions/Alterations',
  'additions-alterations',
  'Expand your living space with custom home additions and alterations designed to seamlessly blend with your existing structure.',
  '## Home Additions & Alterations

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

Expand your home the right way with Living Stone Contractors.',
  '/images/placeholders/addition.jpeg',
  'mdi:home-plus-outline',
  true,
  3,
  'Home Additions & Alterations | Living Stone Contractors',
  'Expert home additions and alterations. Add space and value to your home with our professional construction services.'
);

-- Insert Masonry service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Masonry',
  'masonry',
  'Expert masonry services for both structural and decorative stonework. Quality craftsmanship that stands the test of time.',
  '## Professional Masonry Services

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

Contact us for expert masonry services.',
  '/images/placeholders/masonry.png',
  'mdi:wall',
  true,
  4,
  'Professional Masonry Services | Living Stone Contractors',
  'Expert masonry and stonework services. From repairs to new installations, we deliver quality craftsmanship.'
);

-- Insert Kitchens and Baths service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Kitchens and Baths',
  'kitchens-baths',
  'Create the kitchen and bathroom of your dreams with our complete remodeling services. From design to completion.',
  '## Kitchen & Bathroom Remodeling

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

Schedule your design consultation today!',
  '/images/placeholders/kitchens_baths.png',
  'mdi:countertop-outline',
  true,
  5,
  'Kitchen & Bath Remodeling | Living Stone Contractors',
  'Transform your kitchen and bathroom with our expert remodeling services. Custom designs and quality installation.'
);

-- Insert Siding service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Siding',
  'siding',
  'Protect and beautify your home with quality siding installation. Energy-efficient options with lasting durability.',
  '## Siding Installation & Replacement

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

Get a free siding estimate today!',
  '/images/placeholders/exterior.jpeg',
  'mdi:texture-box',
  false,
  6,
  'Siding Installation & Replacement | Living Stone Contractors',
  'Professional siding installation and replacement services. Improve your home''s appearance and energy efficiency.'
);

-- Insert Basements service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Basements',
  'basements',
  'Unlock your home''s potential with professional basement finishing and remodeling. Create the extra space you need.',
  '## Basement Finishing & Remodeling

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

Unlock your basement''s potential today!',
  '/images/placeholders/interior.jpeg',
  'mdi:stairs-down',
  false,
  7,
  'Basement Finishing & Remodeling | Living Stone Contractors',
  'Transform your basement into valuable living space. Expert basement finishing and remodeling services.'
);

-- Insert Roofing service
INSERT INTO services (id, title, slug, description, content, image, icon, featured, "order", meta_title, meta_description)
VALUES (
  gen_random_uuid(),
  'Roofing',
  'roofing',
  'Protect your home with professional roofing services. Installation, repair, and replacement by experienced craftsmen.',
  '## Professional Roofing Services

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

Protect your home with a quality roof from Living Stone Contractors.',
  '/images/placeholders/roofing.png',
  'mdi:home-roof',
  true,
  8,
  'Professional Roofing Services | Living Stone Contractors',
  'Expert roofing installation, repair, and replacement. Protect your home with quality roofing services.'
);

-- Verify insertion
SELECT title, slug, featured, "order" FROM services ORDER BY "order";
