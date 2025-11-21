-- Migrate hardcoded About page content to database
UPDATE pages SET about_content = '<h2>About Living Stone Contractors</h2>
<p>Living Stone Contractors is a company specialized in home remodeling and improvement, committed to transforming spaces into functional, modern, and durable places. We are passionate about every detail of the process, from planning to execution, ensuring high-quality results that reflect the style and needs of each client.</p>

<p>We work hand in hand with homeowners, architects, designers, and contractors with the goal of offering comprehensive and personalized solutions.</p>

<p>Our approach combines technical expertise, premium materials, and reliable service, guaranteeing projects that not only meet expectations but exceed them.</p>

<h3>Our Mission</h3>
<p>To transform homes into functional, modern, and durable spaces through exceptional craftsmanship, personalized solutions, and unwavering commitment to quality that exceeds our clients'' expectations.</p>

<h3>Why Choose Us</h3>
<ul>
  <li>Over 15 years of experience in home renovation</li>
  <li>Fully licensed and insured</li>
  <li>Transparent pricing with no hidden fees</li>
  <li>Quality materials and expert craftsmanship</li>
  <li>Excellent customer service and communication</li>
  <li>On-time project completion</li>
  <li>Warranty on all work performed</li>
</ul>

<h3>Our Values</h3>
<p><strong>Quality First:</strong> We never compromise on quality. Every project is completed to the highest standards.</p>
<p><strong>Integrity:</strong> Honest communication and transparent business practices in everything we do.</p>
<p><strong>Customer Focus:</strong> Your satisfaction is our priority. We listen, adapt, and deliver on our promises.</p>
<p><strong>Innovation:</strong> We stay current with the latest techniques and materials to provide the best solutions.</p>'
WHERE slug = 'home';
