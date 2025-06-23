document.addEventListener('DOMContentLoaded', function() {

  
  // === FADE IN ANIMATIONS ===
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  fadeElements.forEach(el => fadeObserver.observe(el));
  
  // === ENHANCED TYPING ANIMATION ===
  const headline = document.querySelector('.headline-animate');
  if (headline) {
    const originalHTML = headline.innerHTML;
    const textContent = headline.textContent;
    headline.innerHTML = '';
    
    let charIndex = 0;
    let htmlIndex = 0;
    let currentHTML = '';
    let insideTag = false;
    
    function typeChar() {
      if (htmlIndex < originalHTML.length) {
        const htmlChar = originalHTML[htmlIndex];
        
        // Handle HTML tags
        if (htmlChar === '<') {
          insideTag = true;
        } else if (htmlChar === '>') {
          insideTag = false;
          currentHTML += htmlChar;
          htmlIndex++;
          headline.innerHTML = currentHTML;
          setTimeout(typeChar, 0); // No delay for tags
          return;
        }
        
        if (insideTag) {
          // Add tag characters instantly
          currentHTML += htmlChar;
          htmlIndex++;
          setTimeout(typeChar, 0);
        } else {
          // Add visible characters with delay
          currentHTML += htmlChar;
          headline.innerHTML = currentHTML;
          htmlIndex++;
          setTimeout(typeChar, 50);
        }
      } else {
        // Add blinking cursor temporarily
        headline.innerHTML += '<span class="typing-cursor"></span>';
        setTimeout(() => {
          const cursor = headline.querySelector('.typing-cursor');
          if (cursor) cursor.remove();
        }, 3000);
      }
    }
    
    setTimeout(typeChar, 500);
  }
  
  

  
  // === ENHANCED PARTICLE SYSTEM ===
  const particleContainer = document.querySelector('.wrap');
  if (particleContainer) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'tri';
      
      // Random triangle size
      const size = Math.random() * 10 + 5;
      particle.style.borderLeft = `${size}px solid transparent`;
      particle.style.borderRight = `${size}px solid transparent`;
      particle.style.borderBottom = `${size * 1.5}px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
      
      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Random animation
      const animations = ['anim1', 'anim2', 'anim3', 'anim4', 'anim5'];
      particle.style.animation = `${animations[Math.floor(Math.random() * animations.length)]} ${Math.random() * 10 + 5}s infinite`;
      
      particleContainer.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 15000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 200);
    }
  }
  
  // === INTERACTIVE PARTICLES ON MOUSE MOVE ===
  document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.tri');
    particles.forEach(particle => {
      const rect = particle.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
        Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );
      
      if (distance < 100) {
        particle.style.filter = 'grayscale(0)';
        particle.style.opacity = '0.6';
        particle.style.transform = 'scale(1.3)';
      } else {
        particle.style.filter = 'grayscale(0.8)';
        particle.style.opacity = '0.18';
        particle.style.transform = 'scale(1)';
      }
    });
  });
  
  // === SMOOTH SCROLL FOR NAVIGATION ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // === SECTION SNAP SCROLLING (OPTIONAL) ===
  let isScrolling = false;
  
  window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    const sections = document.querySelectorAll('section');
    const currentSection = Array.from(sections).find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    });
    
    if (currentSection && Math.abs(e.deltaY) > 10) {
      isScrolling = true;
      
      let targetSection;
      if (e.deltaY > 0) {
        // Scroll down
        targetSection = currentSection.nextElementSibling;
      } else {
        // Scroll up
        targetSection = currentSection.previousElementSibling;
      }
      
      if (targetSection && targetSection.tagName === 'SECTION') {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 800);
    }
  });
  
  // === PERFORMANCE OPTIMIZATION ===
  let ticking = false;
  
  function updateAnimations() {
    // Performance optimized scroll handling
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateAnimations);
      ticking = true;
    }
  });
  
  
  
  // === LOADING OPTIMIZATION ===
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Trigger initial fade-ins for elements in viewport
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  });
}); 