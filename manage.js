// ===== DOM Elements =====
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
const projectForm = document.getElementById('projectForm');
const projectsList = document.getElementById('projectsList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const projectIdInput = document.getElementById('projectId');
const toast = document.getElementById('toast');

// ===== API Configuration =====
const API_BASE = window.location.port === '3000'
  ? `http://localhost:3000/api`
  : '/api';

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Toast Notification =====
function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = 'success-toast visible' + (isError ? ' error-toast' : '');
  setTimeout(() => {
    toast.className = 'success-toast';
  }, 3000);
}

// ===== Form Validation =====
function showError(inputId, message) {
  const errorEl = document.getElementById(inputId + 'Error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(inputId) {
  const errorEl = document.getElementById(inputId + 'Error');
  if (errorEl) errorEl.textContent = '';
}

function clearAllErrors() {
  ['projectTitle', 'projectDesc', 'projectTech', 'projectLink', 'projectGithub'].forEach(clearError);
}

// ===== Fetch and Display Projects =====
async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE}/projects`);
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    const projects = data.data;
    projectsList.innerHTML = '';

    if (projects.length === 0) {
      projectsList.innerHTML = '<div class="empty-state">No projects yet. Add your first project above!</div>';
      return;
    }

    projects.forEach(project => {
      const item = document.createElement('div');
      item.className = 'project-item';
      item.innerHTML = `
        <div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
        <div class="project-item-actions">
          <button class="btn btn-secondary btn-sm edit-btn" data-id="${project.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${project.id}">Delete</button>
        </div>
      `;
      projectsList.appendChild(item);
    });

    // Attach event listeners
    projectsList.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => loadProject(parseInt(btn.dataset.id)));
    });

    projectsList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProject(parseInt(btn.dataset.id)));
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    projectsList.innerHTML = '<div class="empty-state">Failed to load projects. Is the server running?</div>';
  }
}

// ===== Load Project for Editing =====
async function loadProject(id) {
  try {
    const response = await fetch(`${API_BASE}/projects/${id}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    const project = data.data;
    projectIdInput.value = project.id;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDesc').value = project.description;
    document.getElementById('projectTech').value = project.technologies || '';
    document.getElementById('projectLink').value = project.project_link || '';
    document.getElementById('projectGithub').value = project.github_link || '';

    formTitle.textContent = 'Edit Project';
    submitBtn.textContent = 'Update Project';
    cancelBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showToast('Failed to load project', true);
  }
}

// ===== Delete Project =====
async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    const response = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    showToast('Project deleted successfully');
    fetchProjects();
    resetForm();
  } catch (error) {
    showToast('Failed to delete project', true);
  }
}

// ===== Reset Form =====
function resetForm() {
  projectForm.reset();
  projectIdInput.value = '';
  formTitle.textContent = 'Add New Project';
  submitBtn.textContent = 'Add Project';
  cancelBtn.style.display = 'none';
  clearAllErrors();
}

// ===== Form Submit =====
projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors();

  const title = document.getElementById('projectTitle').value.trim();
  const description = document.getElementById('projectDesc').value.trim();
  const technologies = document.getElementById('projectTech').value.trim();
  const project_link = document.getElementById('projectLink').value.trim();
  const github_link = document.getElementById('projectGithub').value.trim();

  let isValid = true;

  if (!title) {
    showError('projectTitle', 'Title is required');
    isValid = false;
  }
  if (!description) {
    showError('projectDesc', 'Description is required');
    isValid = false;
  }

  if (!isValid) return;

  const body = { title, description, technologies, project_link, github_link };
  const editId = projectIdInput.value;
  const method = editId ? 'PUT' : 'POST';
  const url = editId ? `${API_BASE}/projects/${editId}` : `${API_BASE}/projects`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!data.success) throw new Error(data.message);

    showToast(editId ? 'Project updated successfully' : 'Project created successfully');
    resetForm();
    fetchProjects();
  } catch (error) {
    showToast(error.message || 'Failed to save project', true);
  }
});

// ===== Cancel Edit =====
cancelBtn.addEventListener('click', resetForm);

// ===== Load Projects on Page Load =====
fetchProjects();
