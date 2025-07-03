class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.connections = [];
    
    this.config = {
      particleCount: 80,
      particleSize: 2,
      particleSpeed: 0.5,
      connectionDistance: 120,
      mouseRadius: 150,
      colors: {
        particle: 'rgba(99, 102, 241, 0.6)',
        connection: 'rgba(99, 102, 241, 0.1)',
        mouseConnection: 'rgba(99, 102, 241, 0.3)'
      }
    };

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * this.config.particleSize + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }

      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.config.mouseRadius) {
        const force = (this.config.mouseRadius - distance) / this.config.mouseRadius;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 0.01;
        particle.vy -= Math.sin(angle) * force * 0.01;
      }

      // Add some randomness to movement
      particle.vx += (Math.random() - 0.5) * 0.001;
      particle.vy += (Math.random() - 0.5) * 0.001;

      // Limit velocity
      const maxVel = this.config.particleSpeed;
      particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
      particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
    });
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.colors.particle;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
    });
  }

  drawConnections() {
    this.ctx.globalAlpha = 1;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.connectionDistance) {
          const opacity = 1 - (distance / this.config.connectionDistance);
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = this.config.colors.connection;
          this.ctx.globalAlpha = opacity * 0.3;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  drawMouseConnections() {
    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.config.mouseRadius) {
        const opacity = 1 - (distance / this.config.mouseRadius);
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = this.config.colors.mouseConnection;
        this.ctx.globalAlpha = opacity * 0.6;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    this.clearCanvas();
    this.updateParticles();
    this.drawConnections();
    this.drawMouseConnections();
    this.drawParticles();
  }

  animate() {
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  bindEvents() {
    // Handle mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });

    // Handle mouse leave
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Handle touch events for mobile
    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX;
      this.mouse.y = touch.clientY;
    });

    window.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  // Method to update particle colors (useful for theme changes)
  updateColors(newColors) {
    this.config.colors = { ...this.config.colors, ...newColors };
  }

  // Method to update particle count
  updateParticleCount(count) {
    this.config.particleCount = count;
    this.createParticles();
  }

  // Method to pause/resume animation
  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
    this.animate();
  }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for other elements to load
  setTimeout(() => {
    window.particleSystem = new ParticleSystem();
  }, 100);
});

// Optional: Reduce particles on mobile for better performance
if (window.innerWidth < 768) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (window.particleSystem) {
        window.particleSystem.updateParticleCount(40);
      }
    }, 200);
  });
}