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
}); 