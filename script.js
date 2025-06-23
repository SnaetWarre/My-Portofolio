document.addEventListener('DOMContentLoaded', function() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  fadeEls.forEach(el => observer.observe(el));

  const headline = document.querySelector('.headline-animate');
  if (headline) {
    const text = headline.textContent;
    headline.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        headline.textContent += text.charAt(i);
        i++;
        setTimeout(type, 60);
      }
    }
    type();
  }

  // Animated triangles background (dark triangles, fade to white)
  const wrap = document.querySelector('.wrap');
  if (wrap) {
    console.log('wrap');
    for (let i = 0; i < 20; i++) {
      const tri = document.createElement('div');
      tri.className = 'tri';
      // Random size
      const size = 10 + Math.random() * 10;
      // Dark grayscale color
      const gray = Math.floor(Math.random() * 60);
      tri.style.borderTop = `${size}px solid rgb(${gray},${gray},${gray})`;
      tri.style.borderRight = `${size}px solid transparent`;
      tri.style.borderLeft = `${size}px solid transparent`;
      tri.style.marginLeft = `-${size/2}px`;
      tri.style.marginTop = `-${size/2}px`;
      // Animation
      const anim = Math.floor(1 + Math.random() * 40);
      tri.style.animation = `anim${anim} 10s infinite linear`;
      tri.style.animationDelay = `${-Math.random() * 10}s`;
      tri.style.opacity = 0.18;
      wrap.appendChild(tri);
    }
  }
}); 