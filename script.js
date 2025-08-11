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
  
  

  
  // === THREE.JS BACKGROUND: FLOATING ORANGE SPHERES + IMPACT PULSES ===
  const motionReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bgCanvas = document.getElementById('bg-canvas');
  const lightBlobsLayer = document.getElementById('light-blobs');
  if (bgCanvas && !motionReduced) {
    // Dynamically load Three.js from CDN
    const threeScript = document.createElement('script');
    threeScript.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
    threeScript.onload = () => {
      const THREE = window.THREE;
      const SPEED_MULTIPLIER = 0.8; // 20% slower
      const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 10);

      const light = new THREE.HemisphereLight(0xffffff, 0xf1e0d6, 1.0);
      scene.add(light);
      const point = new THREE.PointLight(0xe33403, 1.2, 50);
      point.position.set(5, 6, 8);
      scene.add(point);

      // Utility: soft halo texture for blurred edges
      function createHaloTexture(size = 128) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const grd = ctx.createRadialGradient(
          size / 2,
          size / 2,
          size * 0.2,
          size / 2,
          size / 2,
          size * 0.5
        );
        grd.addColorStop(0, 'rgba(255, 150, 120, 0.40)');
        grd.addColorStop(0.6, 'rgba(255, 120, 90, 0.15)');
        grd.addColorStop(1, 'rgba(255, 100, 70, 0.0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, size, size);
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
      }

      // Create floating spheres
      const group = new THREE.Group();
      scene.add(group);
      const sphereGeo = new THREE.SphereGeometry(0.25, 32, 32);
      const colors = [0xe33403, 0xff9966, 0xff6b3d];
      const haloTexture = createHaloTexture(128);
      const SPHERE_COUNT_DARK = 28;
      const SPHERE_COUNT_LIGHT = 18;
      for (let i = 0; i < SPHERE_COUNT_DARK; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: 0.5, metalness: 0.15, emissive: new THREE.Color(0xe33403).multiplyScalar(0.06), transparent: true, opacity: 1.0 });
        const m = new THREE.Mesh(sphereGeo, mat);
        m.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
        m.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
        m.userData.baseRadius = 0.25;
        m.userData.mass = Math.pow(m.userData.baseRadius, 3);
        m.userData.radius = m.userData.baseRadius;
        m.userData.squash = 0;
        m.userData.spawnCooldown = 0;

        // Soft edge halo sprite for blurred silhouette
        const haloMaterial = new THREE.SpriteMaterial({
          map: haloTexture,
          color: colors[i % colors.length],
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0.35
        });
        const halo = new THREE.Sprite(haloMaterial);
        halo.scale.set(m.userData.radius * 3.8, m.userData.radius * 3.8, 1);
        m.add(halo);
        m.userData.halo = halo;
        group.add(m);
      }

      // Theme-aware visual tuning for spheres and lights
      function applySphereTheme() {
        const isDark = isDarkMode();
        // Light tweaks
        light.intensity = isDark ? 1.0 : 1.5;
        point.intensity = isDark ? 1.2 : 0.6;
        point.color.setHex(0xe33403);

        // Material tweaks
        const darkPalette = [0xe33403, 0xff9966, 0xff6b3d];
        const lightPalette = [0xffb088, 0xffc3a3, 0xffd6bf];

        // Toggle sphere visibility per theme and adjust count
        group.children.forEach((m, idx) => {
          if (!m.material) return;
          const mat = m.material;
          const colorHex = (isDark ? darkPalette : lightPalette)[idx % 3];
          mat.color.setHex(colorHex);
          mat.roughness = isDark ? 0.5 : 0.65;
          mat.metalness = isDark ? 0.15 : 0.02;
          mat.opacity = isDark ? 1.0 : 0.9;
          mat.emissive = new THREE.Color(isDark ? 0xe33403 : 0xffb088).multiplyScalar(isDark ? 0.06 : 0.12);
          mat.needsUpdate = true;

          if (m.userData.halo && m.userData.halo.material) {
            const haloMat = m.userData.halo.material;
            haloMat.color.setHex(colorHex);
            haloMat.opacity = isDark ? 0.35 : 0.18;
            haloMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
            haloMat.needsUpdate = true;
          }

          // Show fewer spheres in light mode
          const show = isDark ? idx < SPHERE_COUNT_DARK : idx < SPHERE_COUNT_LIGHT;
          m.visible = show;
        });

        // Toggle gradient blobs layer for light mode
        if (lightBlobsLayer) {
          lightBlobsLayer.style.opacity = isDark ? '0' : '1';
        }
      }

      applySphereTheme();
      window.addEventListener('themechange', applySphereTheme);

      // Bounds for bouncing
      const bounds = new THREE.Vector3(6, 4, 3);
      const restitution = 0.9; // bounciness for sphere-sphere collisions (agar.io-like)
      const baseRadius = 0.25;
      const baseMass = Math.pow(baseRadius, 3);
      const minRadius = 0.18;
      const maxRadius = 0.6;
      const absorbRatio = 1.2; // larger must be at least 20% bigger to absorb
      const absorbContactFactor = 0.92; // how close before absorbing
      const absorbRate = 0.6; // fraction of smaller mass per second transferred
      const massDecayRate = 0.10; // per second toward base mass

      // Blob pulse hook
      const blob = document.querySelector('.blob');
      let blobPulse = 0;

      function pulseBlob() {
        blobPulse = 1;
        if (blob) {
          blob.style.animationDuration = '6s';
        }
      }

      function isDarkMode() {
        return document.body.classList.contains('theme-dark');
      }

      function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      window.addEventListener('resize', resize);
      resize();

      // Animate
      function animate(now) {
        if (!animate.last) animate.last = now;
        const dt = Math.min(0.05, (now - animate.last) / 1000); // clamp to avoid big jumps
        animate.last = now;
        group.children.forEach((m) => {
          m.position.addScaledVector(m.userData.velocity, SPEED_MULTIPLIER);
          ['x','y','z'].forEach(axis => {
            const limit = axis === 'x' ? bounds.x : axis === 'y' ? bounds.y : bounds.z;
            if (m.position[axis] > limit || m.position[axis] < -limit) {
              m.userData.velocity[axis] *= -1;
              pulseBlob();
            }
          });
          m.rotation.x += 0.005;
          m.rotation.y += 0.006;

          // In light mode, gently repel spheres from screen center to keep text clear
          if (!isDarkMode()) {
            const pos2 = new THREE.Vector2(m.position.x, m.position.y);
            const dist = pos2.length();
            const dir = dist > 0.0001 ? pos2.clone().normalize() : new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5).normalize();
            const strength = 0.002 * Math.exp(-Math.pow(dist / 2.2, 2));
            m.userData.velocity.x += dir.x * strength;
            m.userData.velocity.y += dir.y * strength;
          }
        });

        // Inter-sphere collisions (elastic, equal mass) + absorption
        for (let i = 0; i < group.children.length; i++) {
          const a = group.children[i];
          for (let j = i + 1; j < group.children.length; j++) {
            const b = group.children[j];
            const delta = new THREE.Vector3().subVectors(b.position, a.position);
            const dist = delta.length();
            const ra = Math.cbrt(a.userData.mass || baseMass);
            const rb = Math.cbrt(b.userData.mass || baseMass);
            const minDist = ra + rb;
            if (dist > 0 && dist < minDist) {
              const n = delta.divideScalar(dist);
              const relativeVelocity = new THREE.Vector3().subVectors(b.userData.velocity, a.userData.velocity);
              const velAlongNormal = relativeVelocity.dot(n);
              if (velAlongNormal < 0) {
                const jImpulse = -((1 + restitution) * velAlongNormal) / 2; // equal masses
                const impulse = n.clone().multiplyScalar(jImpulse);
                a.userData.velocity.addScaledVector(impulse, -1);
                b.userData.velocity.add(impulse);
              }
              // Positional correction to prevent sinking
              const penetration = minDist - dist;
              const correctionPercent = 0.8; // tweak squishiness
              const correction = n.clone().multiplyScalar((penetration * correctionPercent) / 2);
              a.position.addScaledVector(correction, -1);
              b.position.add(correction);

              // Squash effect for a softer, agar.io-like feel
              a.userData.squash = Math.min(1, (a.userData.squash || 0) + 0.25);
              b.userData.squash = Math.min(1, (b.userData.squash || 0) + 0.25);
            }

            // Absorption when larger is sufficiently bigger and close enough
            const larger = ra >= rb ? a : b;
            const smaller = ra >= rb ? b : a;
            const rL = Math.cbrt(larger.userData.mass || baseMass);
            const rS = Math.cbrt(smaller.userData.mass || baseMass);
            const sizeRatio = rL / rS;
            const canAbsorb = sizeRatio >= absorbRatio && dist < (rL + rS) * absorbContactFactor && (larger.userData.spawnCooldown || 0) <= 0 && (smaller.userData.spawnCooldown || 0) <= 0;
            if (canAbsorb) {
              const sMass = smaller.userData.mass;
              const dMass = Math.min(sMass, sMass * absorbRate * dt);
              larger.userData.mass += dMass;
              smaller.userData.mass -= dMass;
              larger.userData.squash = Math.min(1, (larger.userData.squash || 0) + 0.15);
              smaller.userData.squash = Math.min(1, (smaller.userData.squash || 0) + 0.15);

              // If smaller got too small, respawn it as a new small ball elsewhere
              const newRS = Math.cbrt(smaller.userData.mass);
              if (newRS <= minRadius) {
                smaller.userData.mass = baseMass;
                smaller.userData.spawnCooldown = 1.2; // seconds
                smaller.position.set(
                  (Math.random() - 0.5) * (bounds.x * 1.8),
                  (Math.random() - 0.5) * (bounds.y * 1.8),
                  (Math.random() - 0.5) * (bounds.z * 1.8)
                );
                smaller.userData.velocity.set(
                  (Math.random() - 0.5) * 0.03,
                  (Math.random() - 0.5) * 0.03,
                  (Math.random() - 0.5) * 0.03
                );
              }
            }
          }
        }

        // Apply decay toward base size, squash scaling, and keep halo size synced
        group.children.forEach((m) => {
          // cooldown
          if (m.userData.spawnCooldown && m.userData.spawnCooldown > 0) {
            m.userData.spawnCooldown = Math.max(0, m.userData.spawnCooldown - dt);
          }

          // gentle decay toward base mass to avoid one giant ball
          if ((m.userData.mass || baseMass) > baseMass) {
            m.userData.mass -= (m.userData.mass - baseMass) * Math.min(1, massDecayRate * dt);
          }

          // clamp mass to radius bounds
          const desiredR = Math.min(maxRadius, Math.max(minRadius, Math.cbrt(m.userData.mass || baseMass)));
          m.userData.radius = desiredR;

          // current size scale from radius, then squash factor layered on top
          const sizeScale = desiredR / baseRadius;
          if (m.userData.squash > 0) {
            const squashScale = 1 + m.userData.squash * 0.15;
            m.scale.setScalar(sizeScale * squashScale);
            m.userData.squash *= 0.9;
            if (m.userData.squash < 0.01) {
              m.scale.setScalar(sizeScale);
              m.userData.squash = 0;
            }
          } else {
            m.scale.setScalar(sizeScale);
          }
          if (m.userData.halo) {
            const k = (isDarkMode() ? 4.2 : 3.2) * (m.userData.radius || baseRadius);
            m.userData.halo.scale.set(k * m.scale.x, k * m.scale.y, 1);
          }
        });

        if (blob && blobPulse > 0) {
          const scale = 1 + blobPulse * 0.06;
          blob.style.transform = `scale(${scale})`;
          blobPulse *= 0.92;
          if (blobPulse < 0.01) {
            blob.style.transform = '';
            blobPulse = 0;
          }
        }

        // Ensure clear color matches theme, but keep alpha 0 so CSS bg shows through
        const clear = isDarkMode() ? 0x000000 : 0xffffff;
        renderer.setClearColor(clear, 0);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    };
    document.head.appendChild(threeScript);
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
  
  // Remove previous mouse-follow for triangles (no longer needed)
  
  // Disable magnetic roam; keep simple hover styles only

  // Remove on-mouse tilt interactions for calmer feel
  
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

  // === THEME TOGGLER ===
  const THEME_STORAGE_KEY = 'preferred-theme'; // 'light' | 'dark'
  const root = document.documentElement;
  const toggleButton = document.getElementById('theme-toggle');
  const toggleIcon = document.getElementById('theme-toggle-icon');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    if (toggleIcon) toggleIcon.textContent = isDark ? '🌙' : '🌞';
    // Notify other modules (e.g., WebGL background)
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

    // Manage light-mode gradient blobs DOM and disable background spheres on light mode
    if (lightBlobsLayer) {
      if (!isDark && lightBlobsLayer.childElementCount === 0) {
        // Create a few big soft blobs
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
      }
    }

    // Disable WebGL canvas rendering entirely on light mode to reduce distraction
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
      canvas.style.display = isDark ? 'block' : 'none';
    }
  }

  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    // default to dark now
    return 'dark';
  }

  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  }

  // === MAKE PROJECT CARDS FULLY CLICKABLE ===
  document.querySelectorAll('.project-card').forEach(card => {
    const link = card.querySelector('a');
    if (!link) return;
    card.setAttribute('tabindex', '0');
    const open = () => window.open(link.href, '_blank');
    card.addEventListener('click', (e) => {
      // avoid double opening when clicking directly on the link
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

  // === RICKROLL ON AVATAR CLICK ===
  const avatar = document.querySelector('.hero-avatar');
  if (avatar) {
    avatar.addEventListener('click', () => {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener,noreferrer');
    });
  }

  // === FORCE ALL NON-ANCHOR LINKS TO OPEN IN NEW TAB ===
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
}); 