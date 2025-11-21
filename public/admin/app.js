// Admin Panel App
const API_URL = '';
let adminPassword = null;
let serviceContentQuill = null;
let aboutContentQuill = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkAuth();
  initializeQuillEditors();
});

// Initialize Quill Rich Text Editors
function initializeQuillEditors() {
  const toolbarOptions = [
    [{ 'header': [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ];

  serviceContentQuill = new Quill('#serviceContentEditor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'Write your service content here...'
  });

  aboutContentQuill = new Quill('#aboutContentEditor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'Write your about page content here...'
  });
}

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

  // Mobile menu toggle
  document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
  document.getElementById('sidebarOverlay').addEventListener('click', closeMobileMenu);

  // Image upload handlers
  setupImageUpload('heroImageFile', 'heroImagePreview', 'heroImagePreviewImg', 'heroImage', 'heroImageInfo', 'heroImageUpload');
  setupImageUpload('serviceImageFile', 'serviceImagePreview', 'serviceImagePreviewImg', 'serviceImage', 'serviceImageInfo', 'serviceImageUpload');
}

// Mobile menu functions
function toggleMobileMenu() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function closeMobileMenu() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}

// Image upload setup
function setupImageUpload(inputId, previewContainerId, previewImgId, hiddenInputId, infoId, uploadContainerId) {
  const fileInput = document.getElementById(inputId);
  const previewContainer = document.getElementById(previewContainerId);
  const previewImg = document.getElementById(previewImgId);
  const hiddenInput = document.getElementById(hiddenInputId);
  const infoDiv = document.getElementById(infoId);
  const uploadContainer = document.getElementById(uploadContainerId);

  // File input change
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file, previewContainer, previewImg, infoDiv);
    }
  });

  // Drag and drop
  uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.classList.add('dragover');
  });

  uploadContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('dragover');
  });

  uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      fileInput.files = e.dataTransfer.files;
      handleImageFile(file, previewContainer, previewImg, infoDiv);
    }
  });
}

function handleImageFile(file, previewContainer, previewImg, infoDiv) {
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be less than 5MB');
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewContainer.classList.add('has-image');
    infoDiv.textContent = `New file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  };
  reader.readAsDataURL(file);
}

function showExistingImage(previewContainerId, previewImgId, hiddenInputId, infoId, imageUrl) {
  if (!imageUrl) return;

  const previewContainer = document.getElementById(previewContainerId);
  const previewImg = document.getElementById(previewImgId);
  const hiddenInput = document.getElementById(hiddenInputId);
  const infoDiv = document.getElementById(infoId);

  previewImg.src = imageUrl;
  hiddenInput.value = imageUrl;
  previewContainer.classList.add('has-image');
  infoDiv.textContent = `Current: ${imageUrl}`;
}

function removeHeroImage() {
  document.getElementById('heroImageFile').value = '';
  document.getElementById('heroImage').value = '';
  document.getElementById('heroImagePreview').classList.remove('has-image');
  document.getElementById('heroImagePreviewImg').src = '';
  document.getElementById('heroImageInfo').textContent = '';
}

function removeServiceImage() {
  document.getElementById('serviceImageFile').value = '';
  document.getElementById('serviceImage').value = '';
  document.getElementById('serviceImagePreview').classList.remove('has-image');
  document.getElementById('serviceImagePreviewImg').src = '';
  document.getElementById('serviceImageInfo').textContent = '';
}

function removeTestimonialImage() {
  document.getElementById('testimonialImageFile').value = '';
  document.getElementById('testimonialImage').value = '';
  document.getElementById('testimonialImagePreview').classList.remove('has-image');
  document.getElementById('testimonialImagePreviewImg').src = '';
  document.getElementById('testimonialImageInfo').textContent = '';
}

// Auth functions
function handleLogin(e) {
  e.preventDefault();
  const password = document.getElementById('password').value;

  // Validate login with auth endpoint
  fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'x-admin-password': password
    }
  })
  .then(res => {
    if (res.ok) {
      adminPassword = password;
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('adminContainer').style.display = 'block';
      localStorage.setItem('adminPassword', password);
      loadAllData();
    } else {
      adminPassword = null;
      localStorage.removeItem('adminPassword');
      alert('Invalid password');
    }
  })
  .catch(() => alert('Error connecting to server'));
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

  // Close mobile menu
  closeMobileMenu();

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
    document.getElementById('aboutTitle').value = home.aboutTitle || '';
    document.getElementById('aboutDescription').value = home.aboutDescription || '';

    // Load about content into Quill editor
    if (aboutContentQuill) {
      let content = home.aboutContent || '';
      if (content && (content.includes('##') || content.includes('###') || content.match(/^[-*]\s/m))) {
        content = marked.parse(content);
      }
      const delta = aboutContentQuill.clipboard.convert(content);
      aboutContentQuill.setContents(delta);
    }

    // Load Why Choose section
    document.getElementById('whyChooseTitle').value = home.whyChooseTitle || '';
    document.getElementById('whyChooseDescription').value = home.whyChooseDescription || '';
    document.getElementById('feature1Title').value = home.feature1Title || '';
    document.getElementById('feature1Description').value = home.feature1Description || '';
    document.getElementById('feature2Title').value = home.feature2Title || '';
    document.getElementById('feature2Description').value = home.feature2Description || '';
    document.getElementById('feature3Title').value = home.feature3Title || '';
    document.getElementById('feature3Description').value = home.feature3Description || '';

    // Show existing hero image
    document.getElementById('heroImageFile').value = '';
    showExistingImage('heroImagePreview', 'heroImagePreviewImg', 'heroImage', 'heroImageInfo', home.heroImage);
  } catch (error) {
    console.error('Error loading pages:', error);
  }
}

async function handlePagesSave(e) {
  e.preventDefault();
  const form = e.target;
  const fileInput = document.getElementById('heroImageFile');
  const hasNewFile = fileInput.files && fileInput.files.length > 0;

  // Save About Quill content to hidden input
  if (aboutContentQuill) {
    const htmlContent = aboutContentQuill.root.innerHTML;
    document.getElementById('aboutContent').value = htmlContent;
  }

  // Use FormData for file upload
  const formData = new FormData();
  formData.append('heroTitle', form.querySelector('#heroTitle').value);
  formData.append('heroSubtitle', form.querySelector('#heroSubtitle').value);
  formData.append('heroDescription', form.querySelector('#heroDescription').value);
  formData.append('aboutTitle', form.querySelector('#aboutTitle').value);
  formData.append('aboutDescription', form.querySelector('#aboutDescription').value);
  formData.append('aboutContent', document.getElementById('aboutContent').value);

  // Why Choose section
  formData.append('whyChooseTitle', form.querySelector('#whyChooseTitle').value);
  formData.append('whyChooseDescription', form.querySelector('#whyChooseDescription').value);
  formData.append('feature1Title', form.querySelector('#feature1Title').value);
  formData.append('feature1Description', form.querySelector('#feature1Description').value);
  formData.append('feature2Title', form.querySelector('#feature2Title').value);
  formData.append('feature2Description', form.querySelector('#feature2Description').value);
  formData.append('feature3Title', form.querySelector('#feature3Title').value);
  formData.append('feature3Description', form.querySelector('#feature3Description').value);

  // Add image file or existing URL
  if (hasNewFile) {
    formData.append('heroImage', fileInput.files[0]);
  } else {
    formData.append('heroImage', document.getElementById('heroImage').value);
  }

  try {
    const res = await fetch(`${API_URL}/api/pages/home`, {
      method: 'PUT',
      headers: {
        'x-admin-password': adminPassword
      },
      body: formData
    });

    if (res.ok) {
      showAlert('pagesAlert', 'Pages updated successfully!', 'success');
      loadPages(); // Reload to show the new image
    } else {
      const error = await res.json();
      showAlert('pagesAlert', error.error || 'Error updating pages', 'error');
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
  removeServiceImage();
  // Clear Quill editor
  if (serviceContentQuill) {
    serviceContentQuill.setText('');
  }
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

    // Load content into Quill editor
    if (serviceContentQuill) {
      let content = service.content || '';

      // Detect if content is Markdown and convert to HTML
      if (content && (content.includes('##') || content.includes('###') || content.match(/^[-*]\s/m))) {
        content = marked.parse(content);
      }

      const delta = serviceContentQuill.clipboard.convert(content);
      serviceContentQuill.setContents(delta);
    }

    document.getElementById('serviceIcon').value = service.icon || '';
    document.getElementById('serviceOrder').value = service.order || 0;
    document.getElementById('serviceFeatured').checked = service.featured || false;
    document.getElementById('serviceMetaTitle').value = service.metaTitle || '';
    document.getElementById('serviceMetaDescription').value = service.metaDescription || '';

    // Show existing image
    document.getElementById('serviceImageFile').value = '';
    showExistingImage('serviceImagePreview', 'serviceImagePreviewImg', 'serviceImage', 'serviceImageInfo', service.image);

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
  const form = e.target;
  const id = form.querySelector('#serviceId').value;
  const fileInput = document.getElementById('serviceImageFile');
  const hasNewFile = fileInput.files && fileInput.files.length > 0;

  // Save Quill content to hidden input
  if (serviceContentQuill) {
    const htmlContent = serviceContentQuill.root.innerHTML;
    document.getElementById('serviceContent').value = htmlContent;
  }

  // Use FormData for file upload
  const formData = new FormData();
  formData.append('title', form.querySelector('#serviceTitle').value);
  formData.append('slug', form.querySelector('#serviceSlug').value);
  formData.append('description', form.querySelector('#serviceDescription').value);
  formData.append('content', form.querySelector('#serviceContent').value);
  formData.append('icon', form.querySelector('#serviceIcon').value);
  formData.append('order', form.querySelector('#serviceOrder').value);
  formData.append('featured', form.querySelector('#serviceFeatured').checked ? 'true' : 'false');
  formData.append('metaTitle', form.querySelector('#serviceMetaTitle').value);
  formData.append('metaDescription', form.querySelector('#serviceMetaDescription').value);

  // Add image file or existing URL
  if (hasNewFile) {
    formData.append('image', fileInput.files[0]);
  } else {
    formData.append('image', document.getElementById('serviceImage').value);
  }

  try {
    const url = id ? `${API_URL}/api/services/${id}` : `${API_URL}/api/services`;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'x-admin-password': adminPassword
      },
      body: formData
    });

    if (res.ok) {
      showAlert('servicesAlert', 'Service saved successfully!', 'success');
      closeServiceModal();
      loadServices();
    } else {
      const error = await res.json();
      showAlert('servicesAlert', error.error || 'Error saving service', 'error');
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
    container.innerHTML = '<p>No testimonials found.</p>';
    return;
  }

  container.innerHTML = testimonials.map(t => `
    <div class="service-card">
      <div>
        <h3>${t.name}</h3>
        <p style="color: #999; font-size: 12px;">${t.company || ''}</p>
        <p>${t.content}</p>
        <p style="color: #ff9800;">${'⭐'.repeat(t.rating || 5)}</p>
        ${t.featured ? '<span class="badge badge-featured">Featured</span>' : ''}
      </div>
      <div class="service-actions">
        <button class="btn btn-primary btn-small" onclick="editTestimonial('${t.id}')">Edit</button>
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
  const form = e.target;
  const id = form.querySelector('#testimonialId').value;

  const data = {
    name: form.querySelector('#testimonialName').value,
    company: form.querySelector('#testimonialCompany').value,
    content: form.querySelector('#testimonialContent').value,
    rating: form.querySelector('input[name="rating"]:checked').value,
    featured: form.querySelector('#testimonialFeatured').checked ? 'true' : 'false'
  };

  try {
    const res = await fetch(`${API_URL}/api/testimonials/${id}`, {
      method: 'PUT',
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
      const error = await res.json();
      showAlert('testimonialsAlert', error.error || 'Error saving testimonial', 'error');
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
