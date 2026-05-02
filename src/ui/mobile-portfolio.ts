import { projects, profileLinks } from "../scene/content/portfolio-data";

/**
 * Renders a full scrollable mobile portfolio in place of the Three.js scene.
 * Called when `isUnsupportedPhoneViewport()` returns true.
 */
export function renderMobilePortfolio() {
  // unlock scrolling
  document.documentElement.classList.add("mobile-active");

  const root = document.getElementById("app");
  if (!root) return;

  // build mobile DOM
  const wrapper = document.createElement("div");
  wrapper.className = "mobile-portfolio";
  wrapper.innerHTML = buildMobileHTML();
  root.appendChild(wrapper);

  // wire interactions
  initMobileNav(wrapper);
  initFadeObserver(wrapper);
  initExternalLinks(wrapper);
}

/* =====================================================
   HTML GENERATION
   ===================================================== */

function buildMobileHTML(): string {
  return `
    ${renderNav()}
    <main>
      ${renderHero()}
      <hr class="mp-divider" />
      ${renderProjects()}
      <hr class="mp-divider" />
      ${renderAbout()}
      <hr class="mp-divider" />
      ${renderBlogTeaser()}
      <hr class="mp-divider" />
      ${renderCV()}
      <hr class="mp-divider" />
      ${renderContact()}
    </main>
    ${renderDesktopTeaser()}
    ${renderFooter()}
  `;
}

function renderNav(): string {
  return `
    <nav class="mp-nav" aria-label="Mobile navigation">
      <span class="mp-nav-logo">Warre Snaet</span>
      <button
        class="mp-nav-toggle"
        aria-controls="mp-menu"
        aria-expanded="false"
        aria-label="Toggle navigation menu"
      >
        <span></span>
      </button>
    </nav>
    <div class="mp-nav-menu" id="mp-menu" role="navigation" aria-label="Site sections">
      <a href="#projects">Projects</a>
      <a href="#about">Archive</a>
      <a href="#blog">Transmission</a>
      <a href="#cv">CV</a>
      <a href="#contact">Beacon</a>
    </div>
  `;
}

function renderHero(): string {
  return `
    <section class="mp-hero" id="hero" aria-label="Introduction">
      <div class="mp-hero-top mp-fade">
        <div class="mp-eyebrow">
          <span class="mp-eyebrow-index">01</span>
          <span>Identity Nucleus</span>
        </div>
        <h1 class="mp-hero-name">Warre<br/>Snaet</h1>
      </div>
      <div class="mp-hero-bottom mp-fade">
        <p class="mp-hero-bio"><strong>AI engineer</strong> building local-first machine learning systems, Rust deployment paths, OCR tooling, and edge inference that can survive outside a cloud demo.</p>
        <div class="mp-status">
          <span class="mp-status-dot"></span>
          <span>Interning at 2Ai / IPCA University, Barcelos</span>
        </div>
        <div class="mp-stack">
          <span>Rust</span>
          <span>Python</span>
          <span>C#</span>
          <span>TypeScript</span>
          <span>Burn</span>
          <span>SvelteKit</span>
        </div>
        <div class="mp-hero-ctas">
          <a class="mp-btn" href="#projects">View Work</a>
          <a class="mp-btn mp-btn--ghost" href="${profileLinks.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="mp-btn mp-btn--ghost" href="${profileLinks.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </section>
  `;
}

function renderProjects(): string {
  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);

  const projectCard = (p: (typeof projects)[number]) => {
    return `
      <article class="mp-project mp-fade">
        <span class="mp-project-badge">${p.featured ? "Featured" : "Archive"}</span>
        <h3 class="mp-project-title">${p.title}</h3>
        <p class="mp-project-desc">${p.summary}</p>
        <div class="mp-project-tags">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
        <div class="mp-project-links">
          ${p.links.map((l) => `<a class="mp-project-link" href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join("")}
        </div>
      </article>
    `;
  };

  return `
    <section class="mp-section" id="projects" aria-label="Projects">
      <div class="mp-section-header mp-fade">
        <span class="mp-section-index">02</span>
        <h2 class="mp-section-title">Selected Work</h2>
      </div>
      <div class="mp-projects-list">
        ${featured.map(projectCard).join("")}
        ${archive.map(projectCard).join("")}
      </div>
    </section>
  `;
}

function renderAbout(): string {
  return `
    <section class="mp-section" id="about" aria-label="About">
      <div class="mp-section-header mp-fade">
        <span class="mp-section-index">03</span>
        <h2 class="mp-section-title">Neural Archive</h2>
      </div>
      <div class="mp-about-list">
        <div class="mp-about-item mp-fade">
          <span class="mp-about-label">Origin</span>
          <span class="mp-about-value">Howest AI Engineering / Belgium</span>
        </div>
        <div class="mp-about-item mp-fade">
          <span class="mp-about-label">Current Signal</span>
          <span class="mp-about-value">2Ai / IPCA University internship in Barcelos</span>
        </div>
        <div class="mp-about-item mp-fade">
          <span class="mp-about-label">Stack</span>
          <span class="mp-about-value">Rust, Python, C#, TypeScript, Burn, SvelteKit</span>
        </div>
        <div class="mp-about-item mp-fade">
          <span class="mp-about-label">Current Focus</span>
          <span class="mp-about-value">Rust ML, Burn, OCR, local inference</span>
        </div>
        <div class="mp-about-item mp-fade">
          <span class="mp-about-label">Pattern</span>
          <span class="mp-about-value">Research prototype → deployable system</span>
        </div>
      </div>
      <p class="mp-about-bio mp-fade">Third-year AI Engineering student at Howest, currently interning at 2Ai / IPCA University in Barcelos and applying OCR to echocardiograms.</p>
    </section>
  `;
}

function renderBlogTeaser(): string {
  return `
    <section class="mp-section mp-blog-teaser" id="blog" aria-label="Latest writing">
      <div class="mp-section-header mp-fade">
        <span class="mp-section-index">04</span>
        <h2 class="mp-section-title">Transmission Gate</h2>
      </div>
      <div class="mp-blog-metrics mp-fade">
        <div class="mp-blog-metric">
          <span class="mp-blog-metric-value">0.39ms</span>
          <span class="mp-blog-metric-label">Inference</span>
        </div>
        <div class="mp-blog-metric">
          <span class="mp-blog-metric-value">2579</span>
          <span class="mp-blog-metric-label">FPS Throughput</span>
        </div>
        <div class="mp-blog-metric">
          <span class="mp-blog-metric-value">24MB</span>
          <span class="mp-blog-metric-label">Deployment</span>
        </div>
      </div>
      <h3 class="mp-blog-headline mp-fade">Building a 24MB Offline AI with Rust + Burn</h3>
      <p class="mp-blog-excerpt mp-fade">A technical breakdown of edge deployment, WebAssembly, iPhone packaging, and why the Rust stack mattered.</p>
      <a class="mp-btn mp-fade" href="${profileLinks.blog}">Read the Transmission</a>
    </section>
  `;
}

function renderCV(): string {
  return `
    <section class="mp-section mp-cv" id="cv" aria-label="CV download">
      <div class="mp-section-header mp-fade" style="width:100%;">
        <span class="mp-section-index">05</span>
        <h2 class="mp-section-title">Signal Packet</h2>
      </div>
      <p class="mp-cv-desc mp-fade">A compact CV with education, current internship context, stack, and selected technical work.</p>
      <a class="mp-btn mp-fade" href="${profileLinks.cv}" download>Download CV ↓</a>
    </section>
  `;
}

function renderContact(): string {
  return `
    <section class="mp-section" id="contact" aria-label="Contact">
      <div class="mp-section-header mp-fade">
        <span class="mp-section-index">06</span>
        <h2 class="mp-section-title">Beacon</h2>
      </div>
      <p class="mp-about-bio mp-fade" style="margin-bottom:1.5rem;">Open to technical conversations around AI systems, Rust deployment, OCR, and edge inference.</p>
      <div class="mp-contact-links mp-fade">
        <a class="mp-contact-link" href="${profileLinks.email}">
          <span>Email</span>
          <span class="mp-contact-arrow">→</span>
        </a>
        <a class="mp-contact-link" href="${profileLinks.github}" target="_blank" rel="noopener noreferrer">
          <span>GitHub</span>
          <span class="mp-contact-arrow">→</span>
        </a>
        <a class="mp-contact-link" href="${profileLinks.linkedin}" target="_blank" rel="noopener noreferrer">
          <span>LinkedIn</span>
          <span class="mp-contact-arrow">→</span>
        </a>
      </div>
    </section>
  `;
}

function renderDesktopTeaser(): string {
  return `
    <section class="mp-desktop-teaser" aria-label="Desktop experience teaser">
      <div class="mp-desktop-teaser-content mp-fade">
        <span class="mp-desktop-teaser-kicker">You're seeing the compact version</span>
        <h2 class="mp-desktop-teaser-title">This site has a secret.</h2>
        <p class="mp-desktop-teaser-desc">Open this on a laptop or desktop and you'll find an interactive Three.js space scene, a gravity well you can actually fly through.</p>
        <span class="mp-desktop-teaser-hint">↑ Best on a screen wider than 768px</span>
      </div>
    </section>
  `;
}

function renderFooter(): string {
  return `
    <footer class="mp-footer">
      <div class="mp-footer-inner">
        <img src="logo.svg" alt="" class="mp-footer-logo" width="36" height="36" />
        <p class="mp-footer-copy">© ${new Date().getFullYear()} Warre Snaet</p>
      </div>
    </footer>
  `;
}

/* =====================================================
   INTERACTIONS
   ===================================================== */

function initMobileNav(root: HTMLElement) {
  const toggle = root.querySelector<HTMLButtonElement>(".mp-nav-toggle");
  const menu = root.querySelector<HTMLElement>(".mp-nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // close menu on link tap
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initFadeObserver(root: HTMLElement) {
  const targets = root.querySelectorAll(".mp-fade");
  if (!targets.length) return;

  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (prefersReduced) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  targets.forEach((el) => observer.observe(el));
}

function initExternalLinks(root: HTMLElement) {
  root.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
}
