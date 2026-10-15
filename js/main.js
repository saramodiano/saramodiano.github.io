(function () {
  "use strict";

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const stored = safeGet("theme");
  if (stored) root.setAttribute("data-theme", stored);
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", "dark");

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    safeSet("theme", next);
  });

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- hero word rotator ---------- */
  const rotatorWords = ["people.", "places.", "moments.", "light.", "film."];
  const rotatorInner = document.querySelector(".hero-rotator-inner");
  let rotatorIndex = 0;
  if (rotatorInner) {
    rotatorInner.innerHTML = `<span>${rotatorWords[0]}</span>`;
    setInterval(() => {
      rotatorIndex = (rotatorIndex + 1) % rotatorWords.length;
      const span = document.createElement("span");
      span.textContent = rotatorWords[rotatorIndex];
      rotatorInner.appendChild(span);
      requestAnimationFrame(() => {
        rotatorInner.style.transition = "transform 0.5s cubic-bezier(.22,1,.36,1)";
        rotatorInner.style.transform = `translateY(-${(rotatorInner.children.length - 1) * 100}%)`;
      });
    }, 2600);
  }

  /* ---------- work section elements ---------- */
  const workTitle = document.getElementById("workTitle");
  const workSubtitle = document.getElementById("workSubtitle");
  const backBtn = document.getElementById("backBtn");
  const backLabel = document.getElementById("backLabel");

  const views = {
    projects: document.getElementById("view-projects"),
    project: document.getElementById("view-project"),
    travel: document.getElementById("view-travel"),
    destination: document.getElementById("view-destination"),
  };

  function showView(name) {
    Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
  }

  /* ---------- lightbox-aware item grids ---------- */
  let visibleItems = [];

  function renderItemsGrid(container, items) {
    container.innerHTML = "";
    visibleItems = items;
    items.forEach((item, i) => {
      const fig = document.createElement("figure");
      fig.className = "grid-item";

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.title;
      img.loading = "lazy";
      fig.appendChild(img);

      const caption = document.createElement("figcaption");
      caption.textContent = item.title;
      fig.appendChild(caption);

      fig.addEventListener("click", () => openLightbox(i));
      fig.addEventListener("mouseenter", () => setCursorMode("view"));
      fig.addEventListener("mouseleave", () => setCursorMode("default"));

      container.appendChild(fig);

      requestAnimationFrame(() => {
        setTimeout(() => fig.classList.add("is-shown"), i * 35);
      });
    });
  }

  /* ---------- projects overview ---------- */
  const projectGrid = document.getElementById("projectGrid");

  function renderProjectGrid() {
    projectGrid.innerHTML = "";

    const cards = PROJECTS.map((p) => ({
      cover: p.cover,
      title: p.title,
      subtitle: p.subtitle,
      tag: null,
      onClick: () => showProject(p.slug),
    }));

    cards.push({
      cover: TRAVEL.destinations[0].items[0].src,
      title: TRAVEL.title,
      subtitle: TRAVEL.destinations.map((d) => d.label).join(", "),
      tag: "Map",
      onClick: () => showTravel(),
    });

    cards.forEach((card, i) => {
      const el = document.createElement("button");
      el.className = "project-card";
      el.setAttribute("aria-label", card.title);

      const img = document.createElement("img");
      img.src = card.cover;
      img.alt = card.title;
      img.loading = "lazy";
      el.appendChild(img);

      if (card.tag) {
        const tag = document.createElement("span");
        tag.className = "project-card-tag";
        tag.textContent = card.tag;
        el.appendChild(tag);
      }

      const text = document.createElement("div");
      text.className = "project-card-text";
      text.innerHTML = `<h3>${card.title}</h3><p>${card.subtitle}</p>`;
      el.appendChild(text);

      el.addEventListener("click", card.onClick);
      el.addEventListener("mouseenter", () => setCursorMode("view"));
      el.addEventListener("mouseleave", () => setCursorMode("default"));

      projectGrid.appendChild(el);
      requestAnimationFrame(() => {
        setTimeout(() => el.classList.add("is-shown"), i * 60);
      });
    });
  }

  function showProjects(scroll) {
    workTitle.textContent = "Projects";
    workSubtitle.textContent = "";
    backBtn.hidden = true;
    showView("projects");
    if (scroll) {
      window.scrollTo({ top: document.getElementById("work").offsetTop - 90, behavior: "smooth" });
    }
  }

  /* ---------- single project ---------- */
  const projectItemsGrid = document.getElementById("projectItemsGrid");
  const projectStory = document.getElementById("projectStory");

  function setStory(el, text) {
    el.textContent = text || "";
    el.hidden = !text;
  }

  function showProject(slug) {
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) return;
    workTitle.textContent = project.title;
    workSubtitle.textContent = project.subtitle;
    backLabel.textContent = "All projects";
    backBtn.hidden = false;
    backBtn.onclick = showProjects;
    setStory(projectStory, project.story);
    renderItemsGrid(projectItemsGrid, project.items);
    showView("project");
  }

  /* ---------- travel map ---------- */
  const mapSvgHolder = document.getElementById("mapSvgHolder");
  const mapPins = document.getElementById("mapPins");
  let mapLoaded = false;

  function loadMap() {
    if (mapLoaded) return Promise.resolve();
    return fetch("images/map/world-map.svg")
      .then((res) => res.text())
      .then((svgText) => {
        mapSvgHolder.innerHTML = svgText;
        mapLoaded = true;
      })
      .catch(() => {
        mapSvgHolder.innerHTML = "";
      });
  }

  function renderPins() {
    mapPins.innerHTML = "";
    TRAVEL.destinations.forEach((dest) => {
      const left = ((dest.lon + 180) / 360) * 100;
      const top = ((90 - dest.lat) / 180) * 100;

      const pin = document.createElement("button");
      pin.className = "map-pin";
      pin.style.left = left + "%";
      pin.style.top = top + "%";
      pin.innerHTML = `<span class="map-pin-label">${dest.label}</span><span class="map-pin-dot"></span>`;
      pin.setAttribute("aria-label", dest.label);
      pin.addEventListener("click", () => showDestination(dest.key));
      pin.addEventListener("mouseenter", () => setCursorMode("link"));
      pin.addEventListener("mouseleave", () => setCursorMode("default"));
      mapPins.appendChild(pin);
    });
  }

  function showTravel() {
    workTitle.textContent = TRAVEL.title;
    workSubtitle.textContent = TRAVEL.subtitle;
    backLabel.textContent = "All projects";
    backBtn.hidden = false;
    backBtn.onclick = showProjects;
    showView("travel");
    loadMap().then(renderPins);
  }

  /* ---------- travel destination ---------- */
  const destinationGrid = document.getElementById("destinationGrid");
  const destinationStory = document.getElementById("destinationStory");

  function showDestination(key) {
    const dest = TRAVEL.destinations.find((d) => d.key === key);
    if (!dest) return;
    workTitle.textContent = dest.label;
    workSubtitle.textContent = "Travel";
    backLabel.textContent = "Travel";
    backBtn.hidden = false;
    backBtn.onclick = showTravel;
    setStory(destinationStory, dest.story);
    renderItemsGrid(destinationGrid, dest.items);
    showView("destination");
  }

  /* ---------- lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let currentIndex = 0;

  function openLightbox(i) {
    currentIndex = i;
    updateLightbox();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function updateLightbox() {
    const item = visibleItems[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = item.title;
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function nextImage(dir) {
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    updateLightbox();
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => nextImage(-1));
  document.getElementById("lightboxNext").addEventListener("click", () => nextImage(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") nextImage(-1);
    if (e.key === "ArrowRight") nextImage(1);
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => observer.observe(el));

  /* ---------- custom cursor ---------- */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (hasFinePointer) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.body.classList.add("cursor-ready");

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // delegated hover so dynamically created links/buttons are covered too
    document.addEventListener("mouseover", (e) => {
      const target = e.target.closest("a, button");
      if (target && !target.classList.contains("map-pin") && !target.classList.contains("project-card")) {
        setCursorMode("link");
      }
    });
    document.addEventListener("mouseout", (e) => {
      const target = e.target.closest("a, button");
      if (target && !target.classList.contains("map-pin") && !target.classList.contains("project-card")) {
        setCursorMode("default");
      }
    });
  }

  function setCursorMode(mode) {
    if (!cursorRing) return;
    cursorRing.classList.remove("is-link", "is-view");
    if (mode === "link") cursorRing.classList.add("is-link");
    if (mode === "view") cursorRing.classList.add("is-view");
  }

  /* ---------- magnetic buttons ---------- */
  if (hasFinePointer) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- init ---------- */
  renderProjectGrid();
  showProjects();
})();
