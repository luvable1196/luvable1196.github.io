// animations.js - Enhanced Scroll Animations

// Throttle function for performance optimization
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Debounce function for resize events
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

// Main scroll animation handler
const handleScrollAnimations = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const triggerBottom = windowHeight * 0.8;
  const triggerTop = windowHeight * 0.2;

  // Animate project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    const cardTop = card.getBoundingClientRect().top;
    const cardBottom = card.getBoundingClientRect().bottom;
    
    if (cardTop < triggerBottom && cardBottom > triggerTop) {
      setTimeout(() => {
        card.classList.add('show');
      }, index * 150); // Staggered animation
    }
  });

  // Animate section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    const titleTop = title.getBoundingClientRect().top;
    if (titleTop < triggerBottom) {
      title.classList.add('animate-in');
    }
  });

  // Animate tech stack items
  const techItems = document.querySelectorAll('.tech-item');
  techItems.forEach((item, index) => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < triggerBottom) {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * 100); // Staggered animation
    }
  });

  // Animate stats counters
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(stat => {
    const statTop = stat.getBoundingClientRect().top;
    if (statTop < triggerBottom && !stat.classList.contains('counted')) {
      stat.classList.add('counted');
      animateCounter(stat);
    }
  });

  // Animate experience items
  const experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach((item, index) => {
    const itemTop = item.getBoundingClientRect().top;
    if (itemTop < triggerBottom) {
      setTimeout(() => {
        item.classList.add('show');
      }, index * 200);
    }
  });

  // Animate about text
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    const aboutTop = aboutText.getBoundingClientRect().top;
    if (aboutTop < triggerBottom) {
      aboutText.classList.add('animate-in');
    }
  }

  // Animate contact section
  const contactContent = document.querySelector('.contact-content');
  if (contactContent) {
    const contactTop = contactContent.getBoundingClientRect().top;
    if (contactTop < triggerBottom) {
      contactContent.classList.add('animate-in');
    }
  }

  // Animate social links
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach((link, index) => {
    const linkTop = link.getBoundingClientRect().top;
    if (linkTop < triggerBottom) {
      setTimeout(() => {
        link.classList.add('animate-in');
      }, index * 100);
    }
  });

  // Progress bars animation (if any)
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    const barTop = bar.getBoundingClientRect().top;
    if (barTop < triggerBottom && !bar.classList.contains('animated')) {
      bar.classList.add('animated');
      const progress = bar.getAttribute('data-progress');
      const progressFill = bar.querySelector('.progress-fill');
      if (progressFill) {
        progressFill.style.width = progress + '%';
      }
    }
  });
};

// Counter animation function
function animateCounter(element) {
  const target = element.querySelector('h3');
  const countTo = parseInt(target.textContent.replace(/[^0-9]/g, ''));
  const duration = 2000;
  const increment = countTo / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= countTo) {
      current = countTo;
      clearInterval(timer);
    }
    target.textContent = Math.floor(current) + (target.textContent.includes('+') ? '+' : '');
  }, 16);
}

// Parallax effect for background elements
const handleParallax = () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  parallaxElements.forEach(element => {
    const speed = element.dataset.speed || 0.5;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
};

// Mouse move parallax effect
const handleMouseParallax = (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  const parallaxElements = document.querySelectorAll('.mouse-parallax');
  parallaxElements.forEach(element => {
    const speed = element.dataset.mouseSpeed || 0.1;
    const x = (mouseX - windowWidth / 2) * speed;
    const y = (mouseY - windowHeight / 2) * speed;
    element.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
};

// Smooth reveal animations
const revealElements = () => {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add('active');
    }
  });
};

// Text animation effects
const animateTextElements = () => {
  const textElements = document.querySelectorAll('.animate-text');
  
  textElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < window.innerHeight * 0.8) {
      element.classList.add('animate-in');
    }
  });
};

// Floating animation for elements
const floatingAnimation = () => {
  const floatingElements = document.querySelectorAll('.floating');
  
  floatingElements.forEach((element, index) => {
    const delay = index * 500;
    const duration = 3000 + (index * 500);
    
    element.style.animationDelay = `${delay}ms`;
    element.style.animationDuration = `${duration}ms`;
  });
};

// Intersection Observer for better performance
const createIntersectionObserver = () => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Trigger specific animations based on element type
        if (entry.target.classList.contains('project-card')) {
          entry.target.classList.add('show');
        }
        
        if (entry.target.classList.contains('tech-item')) {
          entry.target.classList.add('animate-in');
        }
        
        if (entry.target.classList.contains('stat-item') && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      }
    });
  }, options);

  // Observe all animatable elements
  const elementsToObserve = document.querySelectorAll('.project-card, .tech-item, .stat-item, .experience-item, .section-title, .about-text, .contact-content, .social-link');
  elementsToObserve.forEach(element => {
    observer.observe(element);
  });
};

// Loading animations
const initLoadingAnimations = () => {
  const loadingElements = document.querySelectorAll('.loading-element');
  
  loadingElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('loaded');
    }, index * 200);
  });
};

// Scroll-triggered animations with momentum
const scrollMomentum = () => {
  let isScrolling = false;
  let scrollDirection = 'down';
  let lastScrollTop = 0;
  
  const handleScroll = () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;
        
        // Add momentum classes
        document.body.classList.toggle('scrolling-down', scrollDirection === 'down');
        document.body.classList.toggle('scrolling-up', scrollDirection === 'up');
        
        // Remove classes after scrolling stops
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
          document.body.classList.remove('scrolling-down', 'scrolling-up');
        }, 150);
        
        isScrolling = false;
      });
    }
    isScrolling = true;
  };
  
  return handleScroll;
};

// Initialize all animations
const initAnimations = () => {
  // Create intersection observer for better performance
  createIntersectionObserver();
  
  // Initialize loading animations
  initLoadingAnimations();
  
  // Initialize floating animations
  floatingAnimation();
  
  // Throttled scroll handler
  const throttledScrollHandler = throttle(() => {
    handleScrollAnimations();
    handleParallax();
    revealElements();
    animateTextElements();
  }, 16);
  
  // Scroll momentum handler
  const momentumHandler = scrollMomentum();
  
  // Event listeners
  document.addEventListener('scroll', throttledScrollHandler);
  document.addEventListener('scroll', momentumHandler);
  
  // Mouse move parallax (only on desktop)
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', throttle(handleMouseParallax, 50));
  }
  
  // Resize handler
  window.addEventListener('resize', debounce(() => {
    // Recalculate animations on resize
    handleScrollAnimations();
  }, 250));
  
  // Initial animation check
  handleScrollAnimations();
  revealElements();
  animateTextElements();
};

// Start animations when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Export functions for use in other files
window.AnimationUtils = {
  throttle,
  debounce,
  animateCounter,
  handleScrollAnimations,
  handleParallax,
  revealElements
};

// Advanced text reveal animation
const createTextRevealAnimation = (element) => {
  const text = element.textContent;
  const words = text.split(' ');
  
  element.innerHTML = words.map(word => 
    `<span class="word">${word.split('').map(char => 
      `<span class="char">${char}</span>`
    ).join('')}</span>`
  ).join(' ');
  
  const chars = element.querySelectorAll('.char');
  chars.forEach((char, index) => {
    char.style.animationDelay = `${index * 50}ms`;
  });
};

// Apply text reveal to specific elements
document.querySelectorAll('.text-reveal').forEach(element => {
  createTextRevealAnimation(element);
});

// Staggered animation utility
const staggerAnimation = (elements, delay = 100) => {
  elements.forEach((element, index) => {
    element.style.animationDelay = `${index * delay}ms`;
  });
};

// Apply staggered animations to various elements
document.addEventListener('DOMContentLoaded', () => {
  staggerAnimation(document.querySelectorAll('.stagger-item'), 150);
  staggerAnimation(document.querySelectorAll('.project-card'), 200);
  staggerAnimation(document.querySelectorAll('.tech-item'), 100);
});