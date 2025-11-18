document.addEventListener('DOMContentLoaded', function() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  
  // === TYPING ANIMATION (only if motion is allowed) ===
  const headline = document.querySelector('.headline-animate');
  if (headline && !prefersReducedMotion) {
    const originalHTML = headline.innerHTML;
    headline.innerHTML = '';
    
    let htmlIndex = 0;
    let currentHTML = '';
    let insideTag = false;
    
    function typeChar() {
      if (htmlIndex < originalHTML.length) {
        const htmlChar = originalHTML[htmlIndex];
        
        if (htmlChar === '<') {
          insideTag = true;
        } else if (htmlChar === '>') {
          insideTag = false;
          currentHTML += htmlChar;
          htmlIndex++;
          headline.innerHTML = currentHTML;
          setTimeout(typeChar, 0);
          return;
        }
        
        if (insideTag) {
          currentHTML += htmlChar;
          htmlIndex++;
          setTimeout(typeChar, 0);
        } else {
          currentHTML += htmlChar;
          headline.innerHTML = currentHTML;
          htmlIndex++;
          setTimeout(typeChar, 50);
        }
      } else {
        headline.innerHTML += '<span class="typing-cursor"></span>';
        setTimeout(() => {
          const cursor = headline.querySelector('.typing-cursor');
          if (cursor) cursor.remove();
        }, 3000);
      }
    }
    
    setTimeout(typeChar, 500);
  }
  
  // === SCROLL PROGRESS BAR ===
  const progressBar = document.getElementById('scroll-progress');
  const headerEl = document.querySelector('.site-header');
  const footerEl = document.querySelector('footer');
  
  let ticking = false;
  
  function updateScrollEffects() {
    // Update scroll progress bar
    if (progressBar) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    }
    
    // Update header scrolled state
    if (headerEl) {
      headerEl.classList.toggle('scrolled', window.scrollY > 20);
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
  
  window.addEventListener('resize', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
  
  // === ACTIVE LINK HIGHLIGHTING ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Offset by header height (approx 80px)
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    // Handle "Home" case (when scroll is at top)
    if (window.scrollY < 100) {
      current = 'home';
    }
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', () => {
    updateActiveLink();
  });
  
  // === SMOOTH SCROLL FOR NAVIGATION ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        // Special offset for home to go to very top
        if (targetId === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Update active link immediately
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // === LOADING OPTIMIZATION ===
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initial scroll effects update
    updateScrollEffects();
    updateActiveLink();
    
    // Trigger initial fade-ins for elements in viewport
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  });

  // === LIGHT MODE GRADIENT BLOBS ===
  const lightBlobsLayer = document.getElementById('light-blobs');
  if (lightBlobsLayer && lightBlobsLayer.childElementCount === 0) {
    const blobs = [
      { cls: 'orange', left: '-10%', top: '-10%', w: 500, h: 500 },
      { cls: 'soft', left: '60%', top: '-15%', w: 420, h: 420 },
      { cls: 'orange', left: '70%', top: '60%', w: 520, h: 520 },
      { cls: 'soft', left: '-15%', top: '65%', w: 460, h: 460 }
    ];
    blobs.forEach(b => {
      const el = document.createElement('div');
      el.className = `light-blob ${b.cls}`;
      el.style.left = b.left;
      el.style.top = b.top;
      el.style.width = `${b.w}px`;
      el.style.height = `${b.h}px`;
      lightBlobsLayer.appendChild(el);
    });
    lightBlobsLayer.style.opacity = '1';
  }

  // === MAKE PROJECT CARDS FULLY CLICKABLE ===
  document.querySelectorAll('.project-card').forEach(card => {
    const link = card.querySelector('a');
    if (!link) return;
    card.setAttribute('tabindex', '0');
    const open = () => window.open(link.href, '_blank');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      open();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });
  
  // === FORCE ALL NON-ANCHOR LINKS TO OPEN IN NEW TAB ===
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
