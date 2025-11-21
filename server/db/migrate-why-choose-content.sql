-- Migrate hardcoded Why Choose section to database
UPDATE pages SET
  why_choose_title = 'Why Choose Living Stone Contractors?',
  why_choose_description = 'We are passionate about every detail of the process, from planning to execution, ensuring high-quality results that reflect the style and needs of each client. Our approach combines technical expertise, premium materials, and reliable service.',
  feature_1_title = 'Licensed & Insured',
  feature_1_description = 'Fully licensed contractors with comprehensive insurance coverage',
  feature_2_title = 'Transparent Pricing',
  feature_2_description = 'No hidden fees. Clear estimates before we start',
  feature_3_title = 'Expert Team',
  feature_3_description = 'Skilled craftsmen with decades of combined experience'
WHERE slug = 'home';
