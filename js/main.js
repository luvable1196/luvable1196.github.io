// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoading();
    initializeNavigation();
    initializeScrollEffects();
    initializeTypingEffect();
    initializeMobileMenu();
    initializeContactForm();
    initializeParticles();
});

// Loading Screen
// function initializeLoading() {
//     const loadingScreen = document.getElementById('loading-screen');
//     const loadingProgress = document.querySelector('.loading-progress');
    
//     // Simulate loading progress
//     let progress = 0;
//     const loadingInterval = setInterval(() => {
//         progress += Math.random() * 15;
//         if (progress >= 100) {
//             progress = 100;
//             clearInterval(loadingInterval);
            
//             // Hide loading screen after a brief delay
//             setTimeout(() => {
//                 loadingScreen.classList.add('loading-screen-exit');
//                 setTimeout(() => {
//                     loadingScreen.style.display = 'none';
//                     document.body.style.overflow = 'auto';
//                 }, 500);
//             }, 500);
//         }
//         loadingProgress.style.width = progress + '%';
//     }, 150);
// }
// Loading Screen with Cool Effects
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const loadingBg = document.querySelector('.loading-bg');
    
    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';
    
    // Create animated particles
    createParticles();
    
    // Simulate realistic loading progress
    let progress = 0;
    const progressSteps = [
        { target: 15, delay: 300, message: "Initializing..." },
        { target: 35, delay: 500, message: "Loading assets..." },
        { target: 55, delay: 700, message: "Processing data..." },
        { target: 75, delay: 400, message: "Preparing interface..." },
        { target: 90, delay: 600, message: "Finalizing..." },
        { target: 100, delay: 300, message: "Complete!" }
    ];
    
    let currentStep = 0;
    
    function updateProgress() {
        if (currentStep >= progressSteps.length) {
            // All steps completed, hide loading screen
            setTimeout(() => {
                hideLoadingScreen();
            }, 800);
            return;
        }
        
        const step = progressSteps[currentStep];
        const increment = (step.target - progress) / 10;
        
        const progressInterval = setInterval(() => {
            progress += increment;
            
            if (progress >= step.target) {
                progress = step.target;
                clearInterval(progressInterval);
                
                // Update UI
                loadingProgress.style.width = progress + '%';
                loadingPercentage.textContent = Math.round(progress) + '%';
                
                // Add pulse effect at certain milestones
                if (progress === 25 || progress === 50 || progress === 75) {
                    loadingProgress.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        loadingProgress.style.transform = 'scale(1)';
                    }, 200);
                }
                
                currentStep++;
                setTimeout(updateProgress, step.delay);
            } else {
                loadingProgress.style.width = progress + '%';
                loadingPercentage.textContent = Math.round(progress) + '%';
            }
        }, 50);
    }
    
    // Start loading process
    setTimeout(updateProgress, 500);
    
    // Create floating particles
    function createParticles() {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            loadingBg.appendChild(particle);
        }
    }
    
    // Hide loading screen with smooth animation
    function hideLoadingScreen() {
        // Add success effect
        loadingPercentage.style.color = '#4ade80';
        loadingPercentage.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            loadingScreen.classList.add('loading-screen-exit');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 800);
        }, 500);
    }
}


// Navigation
function initializeNavigation() {
    const nav = document.querySelector('.floating-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Nav background on scroll
        if (scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.15)';
            nav.style.backdropFilter = 'blur(15px)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.1)';
            nav.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const scrollToTopBtn = document.getElementById('scroll-top');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Intersection Observer for animations
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right, .fade-in, .scale-in, .slide-in-top, .slide-in-bottom'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Typing Effect
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const text = heroTitle.innerHTML;
    
    // Add typing effect class
    heroTitle.classList.add('typewriter');
    
    // Reset animation on page load
    setTimeout(() => {
        heroTitle.style.borderRight = 'none';
    }, 4000);
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Contact Form (if needed)
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add form submission logic here
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            console.log('Form submitted:', formObject);
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Particles initialization
function initializeParticles() {
    // This will be handled by particles.js
    if (typeof createParticles === 'function') {
        createParticles();
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Theme Toggle (if needed)
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Save preference
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// Preloader for images
function preloadImages() {
    const images = [
        'images/profile.jpg',
        'images/projects/chat-app.png',
        'images/projects/leetcode-finder.png',
        'images/projects/visitor-management.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Custom cursor effect (optional)
function initializeCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });
    }
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations
optimizePerformance();

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate positions if needed
    if (typeof updateParticles === 'function') {
        updateParticles();
    }
}, 250));

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio error:', e.error);
});

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}