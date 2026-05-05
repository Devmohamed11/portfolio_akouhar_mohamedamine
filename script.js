// ===== Projects Data =====
const projectsData = [
    {
        id: 1,
        title: 'Weather App',
        description: 'Real-time weather application with location search and forecast',
        category: 'web',
        image: 'images/weather-app.png',
        fullDescription: 'A fully functional weather application that provides real-time weather data, 7-day forecasts, and interactive maps. Built with React and integrated with OpenWeather API.',
        technologies: ['React', 'API Integration', 'CSS3', 'JavaScript'],
        liveLink: '#weather-app-demo'
    },
    {
        id: 2,
        title: 'Todo App',
        description: 'Task management app with local storage and filtering',
        category: 'web',
        image: 'images/todo-app.png',
        fullDescription: 'A comprehensive todo application with features like task creation, editing, deletion, and filtering. Data persists using browser local storage.',
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'Local Storage'],
        liveLink: '#todo-app-demo'
    },
    {
        id: 3,
        title: 'Movies App',
        description: 'Movie database with search and filtering capabilities',
        category: 'app',
        image: 'images/movies-app.png',
        fullDescription: 'Browse and search through a vast movie database. Features include detailed movie information, ratings, and personalized recommendations.',
        technologies: ['React', 'API', 'Redux', 'Tailwind CSS'],
        liveLink: '#movies-app-demo'
    },
    {
        id: 4,
        title: 'E-Commerce Store',
        description: 'Full-featured online shopping platform',
        category: 'web',
        image: 'images/ecommerce-store.png',
        fullDescription: 'A complete e-commerce solution with product catalog, shopping cart, checkout process, and payment integration.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        liveLink: '#ecommerce-demo'
    }
];

// ===== DOM Elements =====
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const projectsGrid = document.getElementById('projectsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const projectModal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

let currentFilter = 'all';
let currentSearch = '';

// ===== Navigation =====
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        
        sections.forEach(s => s.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));
        
        document.getElementById(sectionId)?.classList.add('active');
        item.classList.add('active');
    });
});

// ===== Projects Rendering =====
function renderProjects(filter = 'all', search = '') {
    let filtered = projectsData.filter(p => 
        (filter === 'all' || p.category === filter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) ||
         p.description.toLowerCase().includes(search.toLowerCase()))
    );

    projectsGrid.innerHTML = filtered.length ? filtered.map((p, i) => `
        <div class="project-card" style="animation-delay: ${i * 0.1}s">
            <div class="project-image">
                <img src="${p.image}" alt="${p.title}" class="project-img">
            </div>
            <div class="project-content">
                <h3 class="project-title">${p.title}</h3>
                <p class="project-description">${p.description}</p>
                <div class="project-tags">
                    ${p.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <button class="project-button" onclick="openProjectModal(${p.id})">
                    View Details →
                </button>
            </div>
        </div>
    `).join('') : '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--color-text-muted);">No projects found</div>';
}

// ===== Filters & Search =====
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderProjects(currentFilter, currentSearch);
    });
});

searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderProjects(currentFilter, currentSearch);
});

// ===== Modal Management =====
function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;
    
    modalBody.innerHTML = `
        <h2 class="modal-title">${project.title}</h2>
        <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem; max-height: 300px; object-fit: cover;">
        <p class="modal-description">${project.fullDescription}</p>
        <div>
            <h4 style="font-family: 'Poppins', sans-serif; margin-bottom: 0.75rem;">Technologies Used:</h4>
            <div class="modal-tech">
                ${project.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </div>
        <div class="modal-buttons">
            <button class="btn btn-primary" onclick="window.open('${project.liveLink}', '_blank')">
                <i class="fas fa-external-link-alt"></i> Visit Website
            </button>
        </div>
    `;
    projectModal.classList.add('active');
}

function closeModal() {
    projectModal.classList.remove('active');
}

projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== Contact Form with API Integration =====
async function submitContactForm(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('.btn');
    
    // Validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showErrorMessage('Veuillez remplir tous les champs');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showErrorMessage('Veuillez entrer une adresse email valide');
        return;
    }
    
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: formData.name,
                body: formData.message,
                userId: 1
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Afficher le message de succès
        showSuccessMessage('Message envoyé avec succès! Nous vous répondrons bientôt.');
        contactForm.reset();
        saveContactMessage(formData);
        
        // Console: Message de succès + données
        console.log('✓ Informations envoyées avec succès');
        console.log(formData);
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showErrorMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
        
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le Message';
    }
}

function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.background = 'rgba(34, 197, 94, 0.1)';
    successMessage.style.color = '#22C55E';
    successMessage.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function showErrorMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.background = 'rgba(239, 68, 68, 0.1)';
    successMessage.style.color = '#EF4444';
    successMessage.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function saveContactMessage(formData) {
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
    }
}

function getContactMessages() {
    try {
        return JSON.parse(localStorage.getItem('contactMessages')) || [];
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return [];
    }
}

contactForm.addEventListener('submit', submitContactForm);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    console.log('✓ Portfolio chargé avec succès');
});

function navigateTo(sectionId) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  const target = document.getElementById(sectionId);

  if (target) {
    target.classList.add('active');
    target.scrollIntoView({ behavior: "smooth" });
  }
}
