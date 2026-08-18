// ===== DOM Elements =====
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const projectsGrid = document.getElementById('projectsGrid');
const loadingProjects = document.getElementById('loadingProjects');
const projectsError = document.getElementById('projectsError');

// ===== API Configuration =====
const API_BASE = window.location.port === '3000'
  ? `http://localhost:3000/api`
  : '/api';

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

// ===== Smooth Scrolling for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

// ===== Projects Section =====
function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const technologies = project.technologies
    ? project.technologies.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const techBadges = technologies
    .map(tech => `<span class="tech-badge">${tech}</span>`)
    .join('');

  const links = [];
  if (project.project_link) {
    links.push(`
      <a href="${project.project_link}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Live Demo
      </a>
    `);
  }
  if (project.github_link) {
    links.push(`
      <a href="${project.github_link}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
        GitHub
      </a>
    `);
  }

  card.innerHTML = `
    <h3>${project.title}</h3>
    <p class="project-description">${project.description}</p>
    ${technologies.length > 0 ? `<div class="project-technologies">${techBadges}</div>` : ''}
    ${links.length > 0 ? `<div class="project-links">${links.join('')}</div>` : ''}
  `;

  return card;
}

async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE}/projects`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch projects');
    }

    const projects = data.data;

    // Clear loading message
    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
      projectsGrid.innerHTML = '<p class="loading">No projects yet. Check back soon!</p>';
      return;
    }

    projects.forEach(project => {
      const card = createProjectCard(project);
      projectsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    loadingProjects.style.display = 'none';
    projectsError.style.display = 'block';
  }
}

// Load projects when the page loads
fetchProjects();

// ===== Contact Form Validation =====
function showError(inputId, message) {
  const errorEl = document.getElementById(inputId + 'Error');
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearError(inputId) {
  const errorEl = document.getElementById(inputId + 'Error');
  if (errorEl) {
    errorEl.textContent = '';
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  let isValid = true;

  // Clear previous errors
  clearError('name');
  clearError('email');
  clearError('message');

  // Validate name
  if (!nameInput.value.trim()) {
    showError('name', 'Please enter your name.');
    isValid = false;
  }

  // Validate email
  if (!emailInput.value.trim()) {
    showError('email', 'Please enter your email address.');
    isValid = false;
  } else if (!validateEmail(emailInput.value.trim())) {
    showError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  // Validate message
  if (!messageInput.value.trim()) {
    showError('message', 'Please enter your message.');
    isValid = false;
  }

  // If valid, show success message
  if (isValid) {
    formSuccess.classList.add('visible');
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.remove('visible');
    }, 5000);
  }
});

// Clear error when user starts typing
['name', 'email', 'message'].forEach((id) => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => clearError(id));
  }
});
