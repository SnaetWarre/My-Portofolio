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
    // Don't animate if it's the new complex layout, just simple text check
    // Actually for the BR tag support we need to be careful.
    // Let's simplified the typing for the new layout to just the Name if possible, 
    // or just let it be static if it's too complex. 
    // Given the new "WARRE<br>SNAET", the previous typing logic might break on <br>.
    // Let's update the typing logic to handle the <br> gracefully or just disable it for this specific brutalist title 
    // which looks better static/solid.
    // However, the user asked for "cooler layout", maybe typing is still cool.
    // I'll leave the typing logic but ensure it handles HTML tags (which the previous one did).
    
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
          setTimeout(typeChar, 100); // Slower typing for big text impact
        }
      } else {
        // Animation done
      }
    }
    
    setTimeout(typeChar, 500);
  }

  // === SMOOTH SCROLL FOR ANY ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
      }
    });
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

  // === FORCE ALL EXTERNAL LINKS TO OPEN IN NEW TAB ===
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('http')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
