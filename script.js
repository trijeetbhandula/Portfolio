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
    const navItems = document.querySelectorAll('.nav-link, .mobile-nav-link');

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
            // Only highlight actual navigation links (not buttons or other content links)
            const isNavLink = item.classList.contains('nav-link') || item.classList.contains('mobile-nav-link');
            const isButton = item.classList.contains('btn-primary') || item.classList.contains('btn-secondary');
            
            if (item.getAttribute('href') === `#${current}` && isNavLink && !isButton) {
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

    // Load featured projects (specific projects only)
    loadFeaturedProjects();
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
    const username = 'trijeetbhandula';

    console.log('Loading GitHub projects for:', username);

    try {
        // Show loading spinner with enhanced styling
        projectsContainer.innerHTML = `
            <div class="col-span-full loading">
                <div class="flex flex-col items-center justify-center py-20">
                    <div class="spinner mb-4"></div>
                    <p class="text-accent animate-pulse">Loading your amazing projects...</p>
                </div>
            </div>
        `;

        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
        
        console.log('GitHub API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned status: ${response.status}`);
        }

        const repos = await response.json();
        console.log('Fetched repositories:', repos.length, repos);
        
        // Filter and prioritize repositories - be less strict
        const featuredRepos = repos
            .filter(repo => {
                console.log(`Checking repo: ${repo.name}, fork: ${repo.fork}, name === username: ${repo.name === username}`);
                return !repo.fork;  // Only exclude forks, include all other repos
            })
            .sort((a, b) => {
                // Prioritize repos with descriptions and recent activity
                const scoreA = (a.description ? 2 : 0) + (a.stargazers_count * 0.5) + (a.language ? 1 : 0);
                const scoreB = (b.description ? 2 : 0) + (b.stargazers_count * 0.5) + (b.language ? 1 : 0);
                return scoreB - scoreA;
            })
            .slice(0, 6);

        console.log('Featured repositories after filtering:', featuredRepos);

        if (featuredRepos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="col-span-full text-center">
                    <div class="bg-gradient-to-r from-accent/10 to-accent-purple/10 border border-accent/20 rounded-lg p-8">
                        <i class="fas fa-code text-accent text-4xl mb-4"></i>
                        <p class="text-text-secondary mb-2">No repositories found</p>
                        <p class="text-text-muted text-sm">Check back soon for exciting projects!</p>
                        <p class="text-xs text-gray-500 mt-4">Debug: Found ${repos.length} total repos, ${featuredRepos.length} after filtering</p>
                    </div>
                </div>
            `;
            return;
        }

        // Generate enhanced project cards
        projectsContainer.innerHTML = featuredRepos.map(repo => {
            const languageColors = {
                JavaScript: '#F7DF1E',
                Python: '#3776AB',
                HTML: '#E34F26',
                CSS: '#1572B6',
                Java: '#ED8B00',
                'C++': '#00599C',
                Kotlin: '#7F52FF',
                TypeScript: '#3178C6',
                React: '#61DAFB'
            };

            const languageColor = languageColors[repo.language] || '#00D9FF';
            
            return `
                <div class="project-card group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/80 to-tertiary/80 backdrop-blur-lg border border-accent/20 hover:border-accent/40 transition-all duration-500">
                    <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative p-6 h-full flex flex-col">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-2">
                                <div class="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-accent-light animate-pulse"></div>
                                <h3 class="text-xl font-semibold text-white group-hover:text-accent transition-colors duration-300">${repo.name.replace(/-/g, ' ')}</h3>
                            </div>
                            <div class="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                <a href="${repo.html_url}" target="_blank" class="text-text-muted hover:text-accent transform hover:scale-110 transition-all duration-200" title="View Source Code">
                                    <i class="fab fa-github text-lg"></i>
                                </a>
                                ${repo.homepage ? `
                                    <a href="${repo.homepage}" target="_blank" class="text-text-muted hover:text-accent-green transform hover:scale-110 transition-all duration-200" title="Live Demo">
                                        <i class="fas fa-external-link-alt text-lg"></i>
                                    </a>
                                ` : ''}
                                ${repo.has_pages ? `
                                    <a href="https://${username}.github.io/${repo.name}" target="_blank" class="text-text-muted hover:text-accent-pink transform hover:scale-110 transition-all duration-200" title="GitHub Pages">
                                        <i class="fas fa-globe text-lg"></i>
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                        
                        <p class="text-text-secondary mb-4 line-clamp-3 flex-grow">
                            ${repo.description || 'An innovative project showcasing modern development practices and clean code architecture.'}
                        </p>
                        
                        <div class="space-y-4">
                            ${repo.language ? `
                                <div class="flex items-center space-x-2">
                                    <div class="w-3 h-3 rounded-full" style="background-color: ${languageColor}"></div>
                                    <span class="text-sm text-text-muted font-medium">${repo.language}</span>
                                </div>
                            ` : ''}
                            
                            <div class="flex items-center justify-between text-sm text-text-muted">
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center space-x-1 hover:text-accent-orange transition-colors duration-200">
                                        <i class="fas fa-star text-yellow-400"></i>
                                        <span>${repo.stargazers_count}</span>
                                    </div>
                                    <div class="flex items-center space-x-1 hover:text-accent-green transition-colors duration-200">
                                        <i class="fas fa-code-branch text-green-400"></i>
                                        <span>${repo.forks_count}</span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-1 text-xs opacity-60">
                                    <i class="fas fa-clock"></i>
                                    <span>${formatDate(repo.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-4 border-t border-accent/20">
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-accent font-medium">${getProjectCategory(repo.name, repo.description, repo.language)}</span>
                                <div class="flex space-x-1">
                                    ${[...Array(Math.min(Math.floor(repo.stargazers_count / 5) + 1, 5))].map(() => 
                                        '<i class="fas fa-star text-yellow-400 text-xs"></i>'
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add enhanced interaction effects
        const cards = projectsContainer.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('animate-on-scroll');
        });

    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div class="col-span-full text-center">
                <div class="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-8 backdrop-blur-lg">
                    <i class="fas fa-exclamation-triangle text-red-400 text-3xl mb-4"></i>
                    <h3 class="text-red-400 text-lg font-semibold mb-2">Unable to load GitHub projects</h3>
                    <p class="text-text-muted text-sm mb-4">There was an issue connecting to GitHub. Please check your connection and try again.</p>
                    <button onclick="loadGitHubProjects()" class="btn-primary">
                        <i class="fas fa-redo mr-2"></i>Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Load featured projects (for the featured section)
async function loadFeaturedProjects() {
    const featuredContainer = document.getElementById('featured-projects');
    const username = 'trijeetbhandula';
    
    // Specific projects to display
    const projectNames = [
        'DevOps-WordPress-Pipeline',
        'AR_Solar_System', 
        'BMICalculator-UtilityApp',
        'EducationalApp',
        'Movies_to_Watch',
        'Employee_Database'
    ];

    try {
        featuredContainer.innerHTML = `
            <div class="col-span-full loading">
                <div class="flex flex-col items-center justify-center py-20">
                    <div class="spinner mb-4"></div>
                    <p class="text-accent animate-pulse">Loading your featured projects...</p>
                </div>
            </div>
        `;

        // Fetch each specific project with better error handling
        const projectPromises = projectNames.map(async (projectName) => {
            try {
                console.log(`Fetching project: ${projectName}`);
                const response = await fetch(`https://api.github.com/repos/${username}/${projectName}`);
                if (!response.ok) {
                    console.warn(`Project ${projectName} returned status: ${response.status}`);
                    // Don't return null, create a basic project object
                    return {
                        name: projectName,
                        html_url: `https://github.com/${username}/${projectName}`,
                        description: `${projectName.replace(/-|_/g, ' ')} project`,
                        language: 'Unknown',
                        stargazers_count: 0,
                        forks_count: 0,
                        updated_at: new Date().toISOString(),
                        mediaFiles: []
                    };
                }
                const repo = await response.json();
                console.log(`Successfully fetched: ${projectName}`);
                
                // Try to fetch README but don't fail if it doesn't work
                let mediaFiles = [];
                try {
                    const readmeResponse = await fetch(`https://api.github.com/repos/${username}/${projectName}/readme`);
                    if (readmeResponse.ok) {
                        const readmeData = await readmeResponse.json();
                        const readmeContent = atob(readmeData.content);
                        
                        // Look for images first (more reliable)
                        const imageRegex = /!\[.*?\]\((.*?\.(png|jpg|jpeg|gif|webp))\)/gi;
                        let match;
                        while ((match = imageRegex.exec(readmeContent)) !== null && mediaFiles.length < 3) {
                            const imageUrl = match[1];
                            if (imageUrl) {
                                let fullUrl;
                                if (imageUrl.startsWith('http')) {
                                    fullUrl = imageUrl;
                                } else {
                                    fullUrl = `https://raw.githubusercontent.com/${username}/${projectName}/main/${imageUrl}`;
                                }
                                mediaFiles.push({ type: 'image', url: fullUrl });
                            }
                        }
                        
                        // Look for videos (simple detection)
                        if (readmeContent.includes('.mp4') || readmeContent.includes('video')) {
                            const videoRegex = /([a-zA-Z0-9_.-]+\.mp4)/gi;
                            let videoMatch;
                            while ((videoMatch = videoRegex.exec(readmeContent)) !== null && mediaFiles.length < 2) {
                                const videoUrl = videoMatch[1];
                                if (videoUrl) {
                                    const fullUrl = `https://raw.githubusercontent.com/${username}/${projectName}/main/${videoUrl}`;
                                    mediaFiles.push({ type: 'video', url: fullUrl });
                                }
                            }
                        }
                    }
                } catch (readmeError) {
                    console.log(`No README media found for ${projectName}:`, readmeError);
                    // Don't fail - just continue without media
                }
                
                return { ...repo, mediaFiles: mediaFiles || [] };
            } catch (error) {
                console.error(`Error fetching ${projectName}:`, error);
                // Return a basic project object even if fetch fails
                return {
                    name: projectName,
                    html_url: `https://github.com/${username}/${projectName}`,
                    description: `${projectName.replace(/-|_/g, ' ')} project`,
                    language: 'Unknown',
                    stargazers_count: 0,
                    forks_count: 0,
                    updated_at: new Date().toISOString(),
                    mediaFiles: []
                };
            }
        });

        const repos = (await Promise.all(projectPromises)).filter(repo => repo !== null);
        
        console.log(`Successfully loaded ${repos.length} out of ${projectNames.length} projects:`, repos.map(r => r.name));
        console.log('Project details:', repos.map(r => ({ name: r.name, mediaCount: r.mediaFiles?.length || 0, mediaTypes: r.mediaFiles?.map(m => m.type) || [] })));

        if (repos.length === 0) {
            featuredContainer.innerHTML = `
                <div class="col-span-full text-center">
                    <div class="bg-gradient-to-r from-accent/10 to-accent-purple/10 border border-accent/20 rounded-lg p-8">
                        <i class="fas fa-code text-accent text-4xl mb-4"></i>
                        <p class="text-text-secondary mb-2">No projects could be loaded</p>
                        <p class="text-text-muted text-sm">Expected: ${projectNames.join(', ')}</p>
                        <p class="text-text-muted text-xs mt-2">Check browser console for detailed errors</p>
                    </div>
                </div>
            `;
            return;
        }

        // Generate simple media display function
        function generateMediaDisplay(mediaFiles, projectName, categoryIcon) {
            if (!mediaFiles || mediaFiles.length === 0) {
                return `<i class="${categoryIcon} text-6xl text-accent/50"></i>`;
            }
            
            const primaryMedia = mediaFiles[0];
            
            if (primaryMedia.type === 'video') {
                return `
                    <video 
                        src="${primaryMedia.url}" 
                        class="w-full h-full object-cover rounded" 
                        autoplay 
                        muted 
                        loop 
                        playsinline
                        onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\\"${categoryIcon} text-6xl text-accent/50\\"></i>'"
                    ></video>
                `;
            } else {
                return `
                    <img 
                        src="${primaryMedia.url}" 
                        alt="${projectName} preview" 
                        class="w-full h-full object-cover rounded" 
                        loading="lazy"
                        onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\\"${categoryIcon} text-6xl text-accent/50\\"></i>'"
                    >
                `;
            }
        }

        // Generate featured project cards with enhanced and cleaner layout
        featuredContainer.innerHTML = repos.map(repo => {
            const languageColors = {
                JavaScript: '#F7DF1E',
                Python: '#3776AB',
                HTML: '#E34F26',
                CSS: '#1572B6',
                Java: '#ED8B00',
                'C++': '#00599C',
                Kotlin: '#7F52FF',
                TypeScript: '#3178C6',
                React: '#61DAFB'
            };

            const languageColor = languageColors[repo.language] || '#00D9FF';
            const categoryIcon = getCategoryIcon(repo.name, repo.description, repo.language);
            const hasMedia = repo.mediaFiles && repo.mediaFiles.length > 0;
            const hasLiveDemo = repo.homepage || repo.has_pages;
            const liveUrl = repo.homepage || `https://${username}.github.io/${repo.name}`;
            
            return `
                <div class="project-card bg-gradient-to-br from-secondary/70 to-secondary/90 rounded-xl overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-accent/10 hover:border-accent/30">
                    <!-- Project Image/Media Section -->
                    <div class="project-image h-56 ${hasMedia ? 'p-3' : 'bg-gradient-to-br from-accent/20 to-accent-purple/20'} flex items-center justify-center overflow-hidden relative group">
                        ${generateMediaDisplay(repo.mediaFiles, repo.name, categoryIcon)}
                        ${hasLiveDemo ? `
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <a href="${liveUrl}" target="_blank" class="bg-accent hover:bg-accent-light px-6 py-2 rounded-full text-white font-medium transition-all duration-200 transform hover:scale-105">
                                    <i class="fas fa-eye mr-2"></i>View Live Demo
                                </a>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Project Content -->
                    <div class="p-6">
                        <!-- Project Header -->
                        <div class="mb-4">
                            <h3 class="text-xl font-bold text-white mb-2 hover:text-accent transition-colors duration-200">
                                ${repo.name.replace(/-|_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <p class="text-gray-300 text-sm leading-relaxed">
                                ${repo.description || `A ${getProjectCategory(repo.name, repo.description, repo.language).toLowerCase()} project showcasing modern development practices and clean code architecture.`}
                            </p>
                        </div>
                        
                        <!-- Technology Stack -->
                        <div class="mb-4">
                            <div class="flex flex-wrap gap-2">
                                ${repo.language ? `
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style="background-color: ${languageColor}20; color: ${languageColor}; border: 1px solid ${languageColor}40;">
                                        <span class="w-2 h-2 rounded-full mr-2" style="background-color: ${languageColor}"></span>
                                        ${repo.language}
                                    </span>
                                ` : ''}
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/40">
                                    <i class="${categoryIcon} mr-2 text-xs"></i>
                                    ${getProjectCategory(repo.name, repo.description, repo.language)}
                                </span>
                                ${hasMedia && repo.mediaFiles.some(m => m.type === 'video') ? `
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40">
                                        <i class="fas fa-video mr-2"></i>Demo
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                        
                        <!-- Project Stats -->
                        <div class="flex items-center justify-between text-sm text-gray-400 mb-6">
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center space-x-1 hover:text-yellow-400 transition-colors duration-200">
                                    <i class="fas fa-star"></i>
                                    <span>${repo.stargazers_count}</span>
                                </div>
                                <div class="flex items-center space-x-1 hover:text-green-400 transition-colors duration-200">
                                    <i class="fas fa-code-branch"></i>
                                    <span>${repo.forks_count}</span>
                                </div>
                                ${hasMedia ? `
                                    <div class="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200">
                                        <i class="fas fa-images"></i>
                                        <span>${repo.mediaFiles.length}</span>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="text-xs opacity-60">
                                ${formatDate(repo.updated_at)}
                            </div>
                        </div>
                        
                        <!-- Action Buttons - Clean single row -->
                        <div class="flex gap-3">
                            ${hasLiveDemo ? `
                                <a href="${liveUrl}" target="_blank" class="btn-primary flex-1 text-center group">
                                    <i class="fas fa-eye mr-2 group-hover:animate-pulse"></i>
                                    Live Demo
                                </a>
                                <a href="${repo.html_url}" target="_blank" class="btn-secondary px-4 group">
                                    <i class="fab fa-github group-hover:animate-bounce"></i>
                                </a>
                            ` : `
                                <a href="${repo.html_url}" target="_blank" class="btn-secondary flex-1 text-center group">
                                    <i class="fab fa-github mr-2 group-hover:animate-bounce"></i>
                                    View Project
                                </a>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading featured projects:', error);
        featuredContainer.innerHTML = `
            <div class="col-span-full text-center">
                <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                    <i class="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                    <p class="text-red-400 mb-2">Unable to load featured projects</p>
                    <p class="text-gray-400 text-sm">Please check your connection and try again.</p>
                    <button onclick="loadFeaturedProjects()" class="btn-primary mt-4">
                        <i class="fas fa-redo mr-2"></i>Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

// Helper function to get category icons
function getCategoryIcon(name, description, language) {
    const desc = (description || '').toLowerCase();
    const projectName = name.toLowerCase();
    
    if (desc.includes('web') || desc.includes('website') || language === 'HTML') return 'fas fa-globe';
    if (desc.includes('app') || desc.includes('android') || language === 'Kotlin') return 'fas fa-mobile-alt';
    if (desc.includes('api') || desc.includes('backend') || desc.includes('server')) return 'fas fa-server';
    if (desc.includes('data') || desc.includes('analysis') || language === 'Python') return 'fas fa-chart-bar';
    if (desc.includes('game') || projectName.includes('game')) return 'fas fa-gamepad';
    if (desc.includes('ar') || desc.includes('augmented reality')) return 'fas fa-cube';
    if (desc.includes('database') || desc.includes('db')) return 'fas fa-database';
    if (language === 'C++') return 'fas fa-cogs';
    if (projectName.includes('portfolio')) return 'fas fa-user';
    return 'fas fa-code';
}
function getProjectCategory(name, description, language) {
    const desc = (description || '').toLowerCase();
    const projectName = name.toLowerCase();
    
    if (desc.includes('web') || desc.includes('website') || language === 'HTML' || language === 'CSS') return 'Web Development';
    if (desc.includes('app') || desc.includes('android') || language === 'Kotlin' || language === 'Java') return 'Mobile App';
    if (desc.includes('api') || desc.includes('backend') || desc.includes('server')) return 'Backend';
    if (desc.includes('react') || desc.includes('vue') || desc.includes('angular')) return 'Frontend';
    if (desc.includes('data') || desc.includes('analysis') || language === 'Python') return 'Data Science';
    if (desc.includes('game') || projectName.includes('game')) return 'Game Development';
    if (desc.includes('ar') || desc.includes('augmented reality')) return 'AR/VR';
    if (desc.includes('database') || desc.includes('db')) return 'Database';
    if (language === 'C++') return 'System Programming';
    return 'Software Project';
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
