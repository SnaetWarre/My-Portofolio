import { profileLinks, projects, type PanelType, type WorldNode } from "../scene/content/portfolio-data";

type OverlayElements = {
  panel: HTMLElement;
  content: HTMLElement;
  labels: HTMLElement;
};

export function createOverlayController(elements: OverlayElements) {
  const labelButtons = new Map<string, HTMLButtonElement>();

  return {
    renderLabels(nodes: WorldNode[], onSelect: (node: WorldNode) => void) {
      elements.labels.innerHTML = "";
      nodes
        .forEach((node) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "scene-label";
          button.textContent = node.label;
          button.dataset.nodeId = node.id;
          button.style.setProperty("--node-glow", node.accentPalette.glow);
          button.addEventListener("click", () => onSelect(node));
          elements.labels.append(button);
          labelButtons.set(node.id, button);
        });
    },
    updateLabelPositions(nodes: WorldNode[], toScreen: (node: WorldNode) => { x: number; y: number; visible: boolean }) {
      for (const node of nodes) {
        const button = labelButtons.get(node.id);
        if (!button) continue;
        const screen = toScreen(node);
        button.style.transform = `translate3d(${screen.x}px, ${screen.y}px, 0)`;
        button.toggleAttribute("hidden", !screen.visible);
      }
    },
    open(type: PanelType) {
      elements.content.innerHTML = renderPanel(type);
      elements.panel.classList.add("is-open");
      document.documentElement.classList.add("story-open");
      if (type === "identity") {
        document.documentElement.classList.add("story-awakened");
      }
      elements.panel.querySelector<HTMLElement>(".panel-close")?.focus();
    },
    close() {
      elements.panel.classList.remove("is-open");
    },
  };
}

function renderPanel(type: PanelType) {
  if (type === "identity") {
    return `
      <p class="kicker">Identity core / first contact</p>
      <h2 id="panel-title">Warre Snaet</h2>
      <p class="panel-lede">AI engineer building local-first machine learning systems, Rust deployment paths, OCR tooling, and edge inference that can survive outside a cloud demo.</p>
      <div class="data-list">
        <span>Origin</span><strong>Howest AI Engineering / Belgium</strong>
        <span>Current signal</span><strong>2Ai / IPCA University internship in Barcelos</strong>
        <span>Stack</span><strong>Rust, Python, C#, TypeScript, Burn, SvelteKit</strong>
      </div>
      <div class="story-actions">
        <button type="button" data-node-link="projects">Trace the project field</button>
        <button type="button" data-node-link="about">Open the archive</button>
      </div>
    `;
  }

  if (type === "projects") {
    return `
      <p class="kicker">Project field</p>
      <h2 id="panel-title">Selected Work</h2>
      <div class="project-grid">
        ${projects.map(renderProject).join("")}
      </div>
      <a class="panel-link" href="${profileLinks.github}" target="_blank" rel="noopener noreferrer">Open GitHub archive</a>
    `;
  }

  if (type === "about") {
    return `
      <p class="kicker">Signal archive</p>
      <h2 id="panel-title">AI engineer building for real hardware</h2>
      <p class="panel-lede">Third-year AI Engineering student at Howest, currently interning at 2Ai / IPCA University in Barcelos and applying my ML knowledge on Echocardiograms.</p>
      <div class="data-list">
        <span>Current focus</span><strong>Rust ML, Burn, OCR, local inference</strong>
        <span>Languages</span><strong>Python, Rust, C#, TypeScript</strong>
        <span>Pattern</span><strong>Research prototype to deployable system</strong>
      </div>
    `;
  }

  if (type === "blog") {
    return `
      <p class="kicker">Transmission gate</p>
      <h2 id="panel-title">Latest case study</h2>
      <p class="panel-lede">Building a 24MB Offline AI with Rust + Burn. A technical breakdown of edge deployment, WebAssembly, iPhone packaging, and why the Rust stack mattered.</p>
      <div class="metric-row">
        <span><strong>0.39ms</strong> inference</span>
        <span><strong>2579 FPS</strong> throughput</span>
        <span><strong>24MB</strong> deployment</span>
      </div>
      <a class="panel-link" href="${profileLinks.blog}">Read the transmission</a>
    `;
  }

  if (type === "cv") {
    return `
      <p class="kicker">Capsule CV</p>
      <h2 id="panel-title">Download the signal packet</h2>
      <p class="panel-lede">A compact CV with education, current internship context, stack, and selected technical work.</p>
      <a class="panel-link" href="${profileLinks.cv}" download>Download CV</a>
    `;
  }

  return `
    <p class="kicker">Final beacon</p>
    <h2 id="panel-title">Contact</h2>
    <p class="panel-lede">Open to technical conversations around AI systems, Rust deployment, OCR, and edge inference.</p>
    <div class="contact-links">
      <a href="${profileLinks.email}">Email</a>
      <a href="${profileLinks.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="${profileLinks.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
  `;
}

function renderProject(project: (typeof projects)[number]) {
  return `
    <article class="project-card">
      <p class="kicker">${project.featured ? "Featured" : "Archive"}</p>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="tag-row">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
      <div class="project-links">
        ${project.links.map((link) => `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("")}
      </div>
    </article>
  `;
}
