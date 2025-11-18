import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { Service } from '../entities/service.entity';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

config({ path: join(__dirname, '../../../.env') });

const servicesData = [
  {
    slug: 'interior',
    title: 'Interior',
    description: 'Transform your home\'s interior with our expert renovation services. From concept to completion, we bring your vision to life.',
    content: `## Interior Renovation Services

Transform your living spaces with our comprehensive interior renovation services. Our experienced team specializes in creating beautiful, functional interiors that reflect your style and meet your needs.

### What We Offer

- Custom interior design and planning
- Wall and ceiling installations
- Flooring solutions
- Lighting and electrical updates
- Paint and finish work
- Custom built-ins and storage solutions`,
    icon: 'mdi:home-interior',
    image: '/images/placeholders/interior.jpg',
    featured: true,
    order: 1,
    metaTitle: 'Interior Renovation Services | Living Stone Contractors',
    metaDescription: 'Professional interior renovation services in your area. Custom designs, quality craftsmanship, and attention to detail.',
    published: true,
  },
  {
    slug: 'exterior',
    title: 'Exterior',
    description: 'Enhance your home\'s curb appeal and protection with our professional exterior renovation services.',
    content: `## Exterior Renovation Services

Protect and beautify your home with our comprehensive exterior renovation services. We specialize in enhancing both the aesthetics and functionality of your home's exterior.`,
    icon: 'mdi:home-outline',
    image: '/images/placeholders/exterior.jpg',
    featured: true,
    order: 2,
    published: true,
  },
  {
    slug: 'additions-alterations',
    title: 'Additions/Alterations',
    description: 'Expand your living space with custom home additions and alterations designed to seamlessly blend with your existing structure.',
    content: `## Additions & Alterations

Need more space? Our custom additions and alterations seamlessly integrate with your existing home, adding value and functionality.`,
    icon: 'mdi:home-plus-outline',
    image: '/images/placeholders/addition.jpeg',
    featured: true,
    order: 3,
    published: true,
  },
  {
    slug: 'masonry',
    title: 'Masonry',
    description: 'Expert masonry services for both structural and decorative stonework. Quality craftsmanship that stands the test of time.',
    content: `## Masonry Services

Our skilled masons bring decades of experience to every project, delivering durable, beautiful stonework that enhances your property.`,
    icon: 'mdi:wall',
    image: '/images/placeholders/masonry.jpg',
    featured: true,
    order: 4,
    published: true,
  },
  {
    slug: 'kitchens-baths',
    title: 'Kitchens and Baths',
    description: 'Create the kitchen and bathroom of your dreams with our complete remodeling services. From design to completion.',
    content: `## Kitchen & Bathroom Remodeling

Transform the most important rooms in your home with our complete kitchen and bathroom remodeling services.`,
    icon: 'mdi:countertop-outline',
    image: '/images/placeholders/kitchen-bath.jpg',
    featured: true,
    order: 5,
    published: true,
  },
  {
    slug: 'siding',
    title: 'Siding',
    description: 'Protect and beautify your home with quality siding installation. Energy-efficient options with lasting durability.',
    content: `## Siding Services

Upgrade your home's exterior with professional siding installation that combines beauty, durability, and energy efficiency.`,
    icon: 'mdi:texture-box',
    image: '/images/placeholders/siding.jpg',
    featured: false,
    order: 6,
    published: true,
  },
  {
    slug: 'basements',
    title: 'Basements',
    description: 'Unlock your home\'s potential with professional basement finishing and remodeling. Create the extra space you need.',
    content: `## Basement Finishing & Remodeling

Transform your underutilized basement into beautiful, functional living space that adds value to your home.`,
    icon: 'mdi:stairs-down',
    image: '/images/placeholders/basement.jpg',
    featured: false,
    order: 7,
    published: true,
  },
  {
    slug: 'roofing',
    title: 'Roofing',
    description: 'Protect your home with professional roofing services. Installation, repair, and replacement by experienced craftsmen.',
    content: `## Roofing Services

Your roof is your home's first line of defense. Trust our experienced roofing professionals to keep you protected.`,
    icon: 'mdi:home-roof',
    image: '/images/placeholders/roofing.jpg',
    featured: true,
    order: 8,
    published: true,
  },
];

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'living_stone_db',
    entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('🔌 Database connected');

    // Drop and recreate schema
    console.log('🗑️  Dropping and recreating schema...');
    await dataSource.synchronize(true);
    console.log('✓ Schema recreated');

    const serviceRepository = dataSource.getRepository(Service);
    const userRepository = dataSource.getRepository(User);

    // Seed services
    console.log('🌱 Seeding services...');
    for (const serviceData of servicesData) {
      const service = serviceRepository.create(serviceData);
      await serviceRepository.save(service);
      console.log(`  ✓ Created service: ${service.title}`);
    }

    // Seed admin user
    console.log('🌱 Seeding admin user...');
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'changeme',
      10,
    );

    const adminUser = userRepository.create({
      email: process.env.ADMIN_EMAIL || 'admin@livingstonecontractors.com',
      password: hashedPassword,
      name: 'Administrator',
      role: UserRole.ADMIN,
      active: true,
    });

    await userRepository.save(adminUser);
    console.log(`  ✓ Created admin user: ${adminUser.email}`);

    console.log('✅ Seeding completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
