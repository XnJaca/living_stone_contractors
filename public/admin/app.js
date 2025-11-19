// Admin Panel App
const API_URL = '';
let adminPassword = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkAuth();
});

function setupEventListeners() {
  // Login form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Navigation
  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.target.dataset.section;
      switchSection(section);
    });
  });

  // Pages form
  document.getElementById('pagesForm').addEventListener('submit', handlePagesSave);

  // Services
  document.getElementById('addServiceBtn').addEventListener('click', openServiceModal);
  document.getElementById('serviceForm').addEventListener('submit', handleServiceSave);

  // Testimonials
  document.getElementById('addTestimonialBtn').addEventListener('click', openTestimonialModal);
  document.getElementById('testimonialForm').addEventListener('submit', handleTestimonialSave);

  // Contact form
  document.getElementById('contactForm').addEventListener('submit', handleContactSave);

  // Close modals on outside click
  document.getElementById('serviceModal').addEventListener('click', (e) => {
    if (e.target.id === 'serviceModal') closeServiceModal();
  });

  document.getElementById('testimonialModal').addEventListener('click', (e) => {
    if (e.target.id === 'testimonialModal') closeTestimonialModal();
  });
}

// Auth functions
function handleLogin(e) {
  e.preventDefault();
  const password = document.getElementById('password').value;
  adminPassword = password;

  // Test login by fetching pages
  fetch(`${API_URL}/api/pages`, {
    headers: {
      'x-admin-password': password
    }
  })
  .then(res => {
    if (res.ok) {
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('adminContainer').style.display = 'block';
      localStorage.setItem('adminPassword', password);
      loadAllData();
    } else {
      showAlert('pagesAlert', 'Invalid password', 'error');
    }
  })
  .catch(() => showAlert('pagesAlert', 'Error connecting to server', 'error'));
}

function handleLogout() {
  adminPassword = null;
  localStorage.removeItem('adminPassword');
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('adminContainer').style.display = 'none';
  document.getElementById('password').value = '';
}

function checkAuth() {
  const saved = localStorage.getItem('adminPassword');
  if (saved) {
    adminPassword = saved;
    document.getElementById('password').value = saved;
    handleLogin(new Event('submit'));
  }
}

// Navigation
function switchSection(section) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Show selected section
  document.getElementById(section).classList.add('active');

  // Update menu
  document.querySelectorAll('.menu-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === section) {
      link.classList.add('active');
    }
  });

  // Load data for section
  if (section === 'pages') loadPages();
  if (section === 'services') loadServices();
  if (section === 'testimonials') loadTestimonials();
  if (section === 'contact') loadContact();
}

// Utility functions
function showAlert(containerId, message, type) {
  const alertContainer = document.getElementById(containerId);
  alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 4000);
}

function getAuthHeader() {
  return {
    'x-admin-password': adminPassword,
    'Content-Type': 'application/json'
  };
}

// Pages section
async function loadPages() {
  try {
    const res = await fetch(`${API_URL}/api/pages`, {
      headers: { 'x-admin-password': adminPassword }
    });
    const data = await res.json();
    const home = data.home || {};

    document.getElementById('heroTitle').value = home.heroTitle || '';
    document.getElementById('heroSubtitle').value = home.heroSubtitle || '';
    document.getElementById('heroDescription').value = home.heroDescription || '';
    document.getElementById('heroImage').value = home.heroImage || '';
    document.getElementById('aboutTitle').value = home.aboutTitle || '';
    document.getElementById('aboutDescription').value = home.aboutDescription || '';
  } catch (error) {
    console.error('Error loading pages:', error);
  }
}

async function handlePagesSave(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    heroTitle: formData.get('heroTitle'),
    heroSubtitle: formData.get('heroSubtitle'),
    heroDescription: formData.get('heroDescription'),
    heroImage: formData.get('heroImage'),
    aboutTitle: formData.get('aboutTitle'),
    aboutDescription: formData.get('aboutDescription')
  };

  try {
    const res = await fetch(`${API_URL}/api/pages/home`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });

    if (res.ok) {
      showAlert('pagesAlert', 'Pages updated successfully!', 'success');
    } else {
      showAlert('pagesAlert', 'Error updating pages', 'error');
    }
  } catch (error) {
    showAlert('pagesAlert', 'Error: ' + error.message, 'error');
  }
}

// Services section
async function loadServices() {
  try {
    const res = await fetch(`${API_URL}/api/services`, {
      headers: { 'x-admin-password': adminPassword }
    });
    const services = await res.json();
    renderServices(services);
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

function renderServices(services) {
  const container = document.getElementById('servicesList');
  if (services.length === 0) {
    container.innerHTML = '<p>No services yet. Click "Add New Service" to create one.</p>';
    return;
  }

  container.innerHTML = services.map(service => `
    <div class="service-card">
      <div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        ${service.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
      </div>
      <div class="service-actions">
        <button class="btn btn-primary btn-small" onclick="editService('${service.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteService('${service.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function openServiceModal() {
  document.getElementById('serviceId').value = '';
  document.getElementById('serviceForm').reset();
  document.getElementById('serviceModalTitle').textContent = 'Add Service';
  document.getElementById('serviceModal').classList.add('active');
}

function closeServiceModal() {
  document.getElementById('serviceModal').classList.remove('active');
}

async function editService(id) {
  try {
    const res = await fetch(`${API_URL}/api/services/${id}`, {
      headers: { 'x-admin-password': adminPassword }
    });
    const service = await res.json();

    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceTitle').value = service.title;
    document.getElementById('serviceSlug').value = service.slug;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('serviceContent').value = service.content || '';
    document.getElementById('serviceImage').value = service.image;
    document.getElementById('serviceIcon').value = service.icon || '';
    document.getElementById('serviceOrder').value = service.order || 0;
    document.getElementById('serviceFeatured').checked = service.featured || false;
    document.getElementById('serviceMetaTitle').value = service.metaTitle || '';
    document.getElementById('serviceMetaDescription').value = service.metaDescription || '';

    document.getElementById('serviceModalTitle').textContent = 'Edit Service';
    document.getElementById('serviceModal').classList.add('active');
  } catch (error) {
    console.error('Error loading service:', error);
  }
}

async function deleteService(id) {
  if (!confirm('Are you sure you want to delete this service?')) return;

  try {
    const res = await fetch(`${API_URL}/api/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    if (res.ok) {
      showAlert('servicesAlert', 'Service deleted successfully!', 'success');
      loadServices();
    } else {
      showAlert('servicesAlert', 'Error deleting service', 'error');
    }
  } catch (error) {
    showAlert('servicesAlert', 'Error: ' + error.message, 'error');
  }
}

async function handleServiceSave(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const id = formData.get('id');
  const data = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    content: formData.get('content'),
    image: formData.get('image'),
    icon: formData.get('icon'),
    order: formData.get('order'),
    featured: formData.get('featured') ? 'true' : 'false',
    metaTitle: formData.get('metaTitle'),
    metaDescription: formData.get('metaDescription')
  };

  try {
    const url = id ? `${API_URL}/api/services/${id}` : `${API_URL}/api/services`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'x-admin-password': adminPassword,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      showAlert('servicesAlert', 'Service saved successfully!', 'success');
      closeServiceModal();
      loadServices();
    } else {
      showAlert('servicesAlert', 'Error saving service', 'error');
    }
  } catch (error) {
    showAlert('servicesAlert', 'Error: ' + error.message, 'error');
  }
}

// Testimonials section
async function loadTestimonials() {
  try {
    const res = await fetch(`${API_URL}/api/testimonials`, {
      headers: { 'x-admin-password': adminPassword }
    });
    const testimonials = await res.json();
    renderTestimonials(testimonials);
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
}

function renderTestimonials(testimonials) {
  const container = document.getElementById('testimonialsList');
  if (testimonials.length === 0) {
    container.innerHTML = '<p>No testimonials yet. Click "Add New Testimonial" to create one.</p>';
    return;
  }

  container.innerHTML = testimonials.map(t => `
    <div class="service-card">
      <div>
        <h3>${t.name}</h3>
        <p style="color: #999; font-size: 12px;">${t.company}</p>
        <p>${t.content}</p>
        <p style="color: #ff9800;">${'⭐'.repeat(t.rating || 5)}</p>
        ${t.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
      </div>
      <div class="service-actions">
        <button class="btn btn-primary btn-small" onclick="editTestimonial('${t.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteTestimonial('${t.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function openTestimonialModal() {
  document.getElementById('testimonialId').value = '';
  document.getElementById('testimonialForm').reset();
  document.getElementById('testimonialModalTitle').textContent = 'Add Testimonial';
  document.getElementById('testimonialModal').classList.add('active');
}

function closeTestimonialModal() {
  document.getElementById('testimonialModal').classList.remove('active');
}

async function editTestimonial(id) {
  try {
    const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
      headers: { 'x-admin-password': adminPassword }
    });
    const testimonial = await res.json();

    document.getElementById('testimonialId').value = testimonial.id;
    document.getElementById('testimonialName').value = testimonial.name;
    document.getElementById('testimonialCompany').value = testimonial.company || '';
    document.getElementById('testimonialContent').value = testimonial.content;
    document.getElementById('testimonialImage').value = testimonial.image || '';
    document.querySelector(`input[name="rating"][value="${testimonial.rating || 5}"]`).checked = true;
    document.getElementById('testimonialFeatured').checked = testimonial.featured || false;

    document.getElementById('testimonialModalTitle').textContent = 'Edit Testimonial';
    document.getElementById('testimonialModal').classList.add('active');
  } catch (error) {
    console.error('Error loading testimonial:', error);
  }
}

async function deleteTestimonial(id) {
  if (!confirm('Are you sure you want to delete this testimonial?')) return;

  try {
    const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });

    if (res.ok) {
      showAlert('testimonialsAlert', 'Testimonial deleted successfully!', 'success');
      loadTestimonials();
    } else {
      showAlert('testimonialsAlert', 'Error deleting testimonial', 'error');
    }
  } catch (error) {
    showAlert('testimonialsAlert', 'Error: ' + error.message, 'error');
  }
}

async function handleTestimonialSave(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const id = formData.get('id');
  const data = {
    name: formData.get('name'),
    company: formData.get('company'),
    content: formData.get('content'),
    rating: formData.get('rating'),
    image: formData.get('image'),
    featured: formData.get('featured') ? 'true' : 'false'
  };

  try {
    const url = id ? `${API_URL}/api/testimonials/${id}` : `${API_URL}/api/testimonials`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'x-admin-password': adminPassword,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      showAlert('testimonialsAlert', 'Testimonial saved successfully!', 'success');
      closeTestimonialModal();
      loadTestimonials();
    } else {
      showAlert('testimonialsAlert', 'Error saving testimonial', 'error');
    }
  } catch (error) {
    showAlert('testimonialsAlert', 'Error: ' + error.message, 'error');
  }
}

// Contact section
async function loadContact() {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      headers: { 'x-admin-password': adminPassword }
    });
    const data = await res.json();

    document.getElementById('contactEmail').value = data.email || '';
    document.getElementById('contactPhone').value = data.phone || '';
    document.getElementById('contactAddress').value = data.address || '';
    document.getElementById('contactHours').value = data.hours || '';
  } catch (error) {
    console.error('Error loading contact:', error);
  }
}

async function handleContactSave(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    hours: formData.get('hours')
  };

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });

    if (res.ok) {
      showAlert('contactAlert', 'Contact info updated successfully!', 'success');
    } else {
      showAlert('contactAlert', 'Error updating contact info', 'error');
    }
  } catch (error) {
    showAlert('contactAlert', 'Error: ' + error.message, 'error');
  }
}

// Load all data on start
async function loadAllData() {
  switchSection('pages');
}
