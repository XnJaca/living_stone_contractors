-- Migration script to insert default testimonials
-- Run this to populate the testimonials table with the hardcoded testimonials from the homepage

INSERT INTO testimonials (id, name, company, content, rating, featured)
VALUES
  (
    gen_random_uuid(),
    'John & Sarah M.',
    NULL,
    'Excellent work on our kitchen remodel. Professional, on time, and within budget. Couldn''t be happier with the results!',
    5,
    true
  ),
  (
    gen_random_uuid(),
    'Michael R.',
    NULL,
    'Living Stone transformed our basement into a beautiful living space. The attention to detail was outstanding. Highly recommend!',
    5,
    true
  ),
  (
    gen_random_uuid(),
    'Patricia L.',
    NULL,
    'New roof looks amazing and was completed ahead of schedule. The crew was respectful and cleaned up perfectly. Five stars!',
    5,
    true
  )
ON CONFLICT DO NOTHING;
