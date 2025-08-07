// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('text-accent');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('text-accent');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Scroll animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    animateOnScrollElements.forEach(el => {
        observer.observe(el);
    });

    // Skill bar animations
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Simple form validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Create mailto link with form data
            const mailtoLink = `mailto:trijeetbhandula@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            )}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message and reset form
            showNotification('Email client opened! Thank you for reaching out.', 'success');
            contactForm.reset();
        });
    }

    // Load GitHub repositories (keep this for backup display)
    // Commented out since we're using curated projects now
    // loadGitHubProjects();
});

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set notification style based on type
    if (type === 'success') {
        notification.className += ' bg-green-500/90 text-white';
        notification.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${message}`;
    } else if (type === 'error') {
        notification.className += ' bg-red-500/90 text-white';
        notification.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
    } else {
        notification.className += ' bg-accent/90 text-white';
        notification.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${message}`;
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// GitHub API integration
async function loadGitHubProjects() {
    const projectsContainer = document.getElementById('github-projects');
    const username = 'trijeetbhandula'; // Replace with your actual GitHub username

    try {
        // Show loading spinner
        projectsContainer.innerHTML = `
            <div class="col-span-full loading">
                <div class="spinner"></div>
            </div>
        `;

        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();
        
        // Filter out forked repos and select the most interesting ones
        const featuredRepos = repos
            .filter(repo => !repo.fork && repo.description)
            .slice(0, 6);

        if (featuredRepos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="col-span-full text-center">
                    <p class="text-gray-400">No repositories found. Please check back later!</p>
                </div>
            `;
            return;
        }

        // Generate project cards
        projectsContainer.innerHTML = featuredRepos.map(repo => `
            <div class="project-card">
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <h3 class="text-xl font-semibold text-white">${repo.name}</h3>
                        <div class="flex space-x-2">
                            <a href="${repo.html_url}" target="_blank" class="text-gray-400 hover:text-accent">
                                <i class="fab fa-github text-lg"></i>
                            </a>
                            ${repo.homepage ? `
                                <a href="${repo.homepage}" target="_blank" class="text-gray-400 hover:text-accent">
                                    <i class="fas fa-external-link-alt text-lg"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                    <p class="text-gray-400 mb-4 line-clamp-3">${repo.description || 'No description available'}</p>
                    
                    ${repo.language ? `
                        <div class="mb-4">
                            <span class="project-tech">${repo.language}</span>
                        </div>
                    ` : ''}
                    
                    <div class="project-stats">
                        <div class="project-stat">
                            <i class="fas fa-star text-yellow-400 mr-1"></i>
                            <span>${repo.stargazers_count}</span>
                        </div>
                        <div class="project-stat">
                            <i class="fas fa-code-branch text-green-400 mr-1"></i>
                            <span>${repo.forks_count}</span>
                        </div>
                        <div class="project-stat">
                            <i class="fas fa-circle text-accent mr-1"></i>
                            <span class="text-xs">${formatDate(repo.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="col-span-full text-center">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                    <p class="text-red-400 mb-2">Unable to load GitHub projects</p>
                    <p class="text-gray-400 text-sm">Please check your connection and try again later.</p>
                    <button onclick="loadGitHubProjects()" class="mt-4 btn-primary">
                        <i class="fas fa-redo mr-2"></i>Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
}

// Typing animation for hero section
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', function() {
    const subtitle = document.querySelector('#home p:first-of-type');
    if (subtitle) {
        const originalText = subtitle.textContent;
        typeWriter(subtitle, originalText, 30);
    }
});

// Particle background effect (optional)
function createParticles() {
    const hero = document.querySelector('#home');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container absolute inset-0 pointer-events-none';
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle absolute w-1 h-1 bg-accent/20 rounded-full';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}

// Add CSS for particles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    .particle {
        animation: float infinite ease-in-out;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Theme toggle functionality (optional)
function toggleTheme() {
    // This can be extended to add theme switching functionality
    console.log('Theme toggle would go here');
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);
