// particles.js - Enhanced Particle System for Portfolio

class ParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0 };
    this.config = {
      particleCount: 80,
      maxDistance: 150,
      particleSpeed: 0.5,
      particleSize: { min: 1, max: 3 },
      colors: {
        particles: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
        connections: 'rgba(59, 130, 246, 0.1)',
        mouseConnections: 'rgba(59, 130, 246, 0.3)'
      },
      mouse: {
        radius: 200,
        repel: false
      }
    };
    this.animationId = null;
    this.isVisible = true;
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particles-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      background: transparent;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(new Particle(this.canvas.width, this.canvas.height, this.config));
    }
  }

  bindEvents() {
    window.addEventListener('resize', this.resize.bind(this));
    document.addEventListener('mousemove', this.updateMouse.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Pause particles when scrolling (performance optimization)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      this.isVisible = false;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.isVisible = true;
      }, 150);
    });
  }

  updateMouse(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Adjust particle count based on screen size
    const baseCount = window.innerWidth < 768 ? 40 : 80;
    if (this.particles.length !== baseCount) {
      this.config.particleCount = baseCount;
      this.createParticles();
    }
  }

  drawConnections() {
    this.ctx.strokeStyle = this.config.colors.connections;
    this.ctx.lineWidth = 1;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.maxDistance) {
          const opacity = 1 - (distance / this.config.maxDistance);
          this.ctx.globalAlpha = opacity * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawMouseConnections() {
    this.ctx.strokeStyle = this.config.colors.mouseConnections;
    this.ctx.lineWidth = 2;

    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.config.mouse.radius) {
        const opacity = 1 - (distance / this.config.mouse.radius);
        this.ctx.globalAlpha = opacity * 0.6;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    });
    this.ctx.globalAlpha = 1;
  }

  update() {
    this.particles.forEach(particle => {
      particle.update(this.mouse, this.config.mouse);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections first (behind particles)
    this.drawConnections();
    
    // Draw mouse connections
    if (this.mouse.x && this.mouse.y) {
      this.drawMouseConnections();
    }
    
    // Draw particles
    this.particles.forEach(particle => {
      particle.draw(this.ctx);
    });
  }

  animate() {
    if (this.isVisible) {
      this.update();
      this.draw();
    }
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

class Particle {
  constructor(canvasWidth, canvasHeight, config) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * config.particleSpeed;
    this.vy = (Math.random() - 0.5) * config.particleSpeed;
    this.radius = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
    this.color = config.colors.particles[Math.floor(Math.random() * config.colors.particles.length)];
    this.opacity = Math.random() * 0.5 + 0.5;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.originalVx = this.vx;
    this.originalVy = this.vy;
    
    // Floating animation
    this.floatOffset = Math.random() * Math.PI * 2;
    this.floatSpeed = 0.02 + Math.random() * 0.02;
    this.floatRadius = 20 + Math.random() * 30;
  }

  update(mouse, mouseConfig) {
    // Mouse interaction
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseConfig.radius) {
        const force = (mouseConfig.radius - distance) / mouseConfig.radius;
        const angle = Math.atan2(dy, dx);
        const repelForce = mouseConfig.repel ? -force : force;
        
        this.vx += Math.cos(angle) * repelForce * 0.5;
        this.vy += Math.sin(angle) * repelForce * 0.5;
      }
    }

    // Add subtle floating motion
    this.floatOffset += this.floatSpeed;
    this.x += this.vx + Math.cos(this.floatOffset) * 0.1;
    this.y += this.vy + Math.sin(this.floatOffset) * 0.1;

    // Boundary collision with smooth bounce
    if (this.x <= 0 || this.x >= this.canvasWidth) {
      this.vx *= -0.8;
      this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
    }
    if (this.y <= 0 || this.y >= this.canvasHeight) {
      this.vy *= -0.8;
      this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
    }

    // Gradually return to original velocity
    this.vx += (this.originalVx - this.vx) * 0.01;
    this.vy += (this.originalVy - this.vy) * 0.01;

    // Limit velocity
    const maxVelocity = 2;
    this.vx = Math.max(-maxVelocity, Math.min(maxVelocity, this.vx));
    this.vy = Math.max(-maxVelocity, Math.min(maxVelocity, this.vy));
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add a subtle glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fill();
    
    ctx.restore();
  }
}

// Enhanced particle effects for different sections
class SectionParticles {
  constructor() {
    this.effects = new Map();
    this.init();
  }

  init() {
    this.createHeroEffect();
    this.createTechStackEffect();
    this.bindScrollEvents();
  }

  createHeroEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const effect = {
      particles: [],
      canvas: this.createSectionCanvas(heroSection),
      active: false
    };

    // Create floating code snippets or tech icons
    for (let i = 0; i < 20; i++) {
      effect.particles.push({
        x: Math.random() * heroSection.offsetWidth,
        y: Math.random() * heroSection.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        char: this.getRandomChar(),
        size: Math.random() * 12 + 8
      });
    }

    this.effects.set('hero', effect);
  }

  createTechStackEffect() {
    const techSection = document.querySelector('.tech-stack-section');
    if (!techSection) return;

    const effect = {
      particles: [],
      canvas: this.createSectionCanvas(techSection),
      active: false
    };

    this.effects.set('tech', effect);
  }

  createSectionCanvas(section) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    section.style.position = 'relative';
    section.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    
    return { canvas, ctx };
  }

  getRandomChar() {
    const chars = '{}[]()<>/\\;:.,?!@#$%^&*+-=|~`';
    return chars[Math.floor(Math.random() * chars.length)];
  }

  bindScrollEvents() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionClass = entry.target.classList[0];
        const effectKey = sectionClass.includes('hero') ? 'hero' : 
                         sectionClass.includes('tech') ? 'tech' : null;
        
        if (effectKey && this.effects.has(effectKey)) {
          const effect = this.effects.get(effectKey);
          effect.active = entry.isIntersecting;
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.hero-section, .tech-stack-section').forEach(section => {
      observer.observe(section);
    });
  }
}

// Performance monitor
class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.lastTime = 0;
    this.frameCount = 0;
    this.lowFpsThreshold = 30;
    this.isOptimized = false;
  }

  update() {
    const currentTime = performance.now();
    this.frameCount++;
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Auto-optimize if FPS is too low
      if (this.fps < this.lowFpsThreshold && !this.isOptimized) {
        this.optimizePerformance();
      }
    }
  }

  optimizePerformance() {
    this.isOptimized = true;
    
    // Reduce particle count on low-end devices
    if (window.particleSystem) {
      window.particleSystem.config.particleCount = Math.floor(window.particleSystem.config.particleCount * 0.6);
      window.particleSystem.config.maxDistance = Math.floor(window.particleSystem.config.maxDistance * 0.8);
      window.particleSystem.createParticles();
    }
  }
}

// Initialize particle system
function initParticleSystem() {
  // Check if device supports particles (avoid on very low-end devices)
  const isLowEndDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                         && window.innerWidth < 768;
  
  if (isLowEndDevice) {
    // Simplified particles for mobile
    window.particleSystem = new ParticleSystem();
    window.particleSystem.config.particleCount = 30;
    window.particleSystem.config.maxDistance = 100;
    window.particleSystem.createParticles();
  } else {
    // Full particle system for desktop
    window.particleSystem = new ParticleSystem();
    window.sectionParticles = new SectionParticles();
    window.performanceMonitor = new PerformanceMonitor();
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticleSystem);
} else {
  initParticleSystem();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.particleSystem) {
    window.particleSystem.destroy();
  }
});

// Export for use in other files
window.ParticleSystem = ParticleSystem;
window.SectionParticles = SectionParticles;
window.PerformanceMonitor = PerformanceMonitor;