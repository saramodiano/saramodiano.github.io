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

  /* ---------- slide deck (prev/next viewer, with optional B&W->color hover panels) ---------- */
  const deckEl = document.getElementById("projectDeck");
  const deckStage = document.getElementById("deckStage");
  const deckCounter = document.getElementById("deckCounter");
  const deckPrevBtn = document.getElementById("deckPrev");
  const deckNextBtn = document.getElementById("deckNext");
  let deckItems = [];
  let deckIndex = 0;

  function renderDeck(items) {
    deckItems = items;
    deckIndex = 0;
    showDeckSlide();
  }

  function showDeckSlide() {
    const item = deckItems[deckIndex];
    deckStage.innerHTML = "";

    if (item.type === "panorama") {
      deckStage.appendChild(buildPanorama(item));
    } else if (item.hotspots && item.hotspots.length) {
      deckStage.appendChild(buildPanel(item));
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.title;
      deckStage.appendChild(img);
    }

    deckCounter.textContent = `${deckIndex + 1} / ${deckItems.length}`;
  }

  // Resolves once an <img>'s natural size is known.
  function whenReady(img) {
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  }

  // The deck frame is a fixed 16:9 box and photos are shown with
  // object-fit:contain, so most images are letterboxed (pillarboxed) inside
  // it rather than filling it edge to edge. This returns, in real pixels,
  // where the actual visible photo sits within the frame.
  function getContainRect(frame, img) {
    const frameW = frame.clientWidth;
    const frameH = frame.clientHeight;
    const frameRatio = frameW / frameH;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let renderedW, renderedH;
    if (imgRatio > frameRatio) {
      renderedW = frameW;
      renderedH = frameW / imgRatio;
    } else {
      renderedH = frameH;
      renderedW = frameH * imgRatio;
    }
    return {
      offsetX: (frameW - renderedW) / 2,
      offsetY: (frameH - renderedH) / 2,
      renderedW,
      renderedH,
    };
  }

  function buildPanel(item) {
    const frame = document.createElement("div");
    frame.className = "panel-frame";

    const base = document.createElement("img");
    base.className = "panel-base";
    base.src = item.src;
    base.alt = item.title;
    frame.appendChild(base);

    whenReady(base).then(() => {
      const rect = getContainRect(frame, base);

      // cap each hotspot's diameter (as a fraction of the photo's own size)
      // so it never overlaps a sibling hotspot or spills past the photo edge
      const diameters = item.hotspots.map((h) => {
        let d = Math.min(Math.max(h.w, h.h), 0.6);
        item.hotspots.forEach((other) => {
          if (other === h) return;
          const dist = Math.hypot(h.cx - other.cx, h.cy - other.cy);
          d = Math.min(d, dist * 0.92);
        });
        d = Math.min(d, 2 * Math.min(h.cx, 1 - h.cx, h.cy, 1 - h.cy));
        return Math.max(d, 0.08);
      });

      item.hotspots.forEach((h, i) => {
        const d = diameters[i];
        const diameterPx = d * rect.renderedW;
        const centerX = rect.offsetX + h.cx * rect.renderedW;
        const centerY = rect.offsetY + h.cy * rect.renderedH;
        const leftPx = centerX - diameterPx / 2;
        const topPx = centerY - diameterPx / 2;

        const hotspot = document.createElement("div");
        hotspot.className = "panel-hotspot";
        hotspot.style.left = `${leftPx}px`;
        hotspot.style.top = `${topPx}px`;
        hotspot.style.width = `${diameterPx}px`;
        hotspot.style.height = `${diameterPx}px`;
        hotspot.setAttribute("tabindex", "0");
        hotspot.setAttribute("aria-label", "Reveal color");

        // the lens: a full-size color copy of the same photo, offset so the
        // correct region shows through this circular window
        const lens = document.createElement("img");
        lens.className = "panel-hotspot-img";
        lens.src = item.src;
        lens.alt = "";
        lens.style.width = `${rect.renderedW}px`;
        lens.style.height = `${rect.renderedH}px`;
        lens.style.left = `${-(leftPx - rect.offsetX)}px`;
        lens.style.top = `${-(topPx - rect.offsetY)}px`;
        hotspot.appendChild(lens);

        hotspot.addEventListener("click", () => hotspot.classList.toggle("is-active"));
        frame.appendChild(hotspot);
      });
    });

    return frame;
  }

  function buildPanorama(item) {
    const frame = document.createElement("div");
    frame.className = "panel-frame panorama-frame";

    const base = document.createElement("img");
    base.className = "panel-base";
    base.src = item.src;
    base.alt = item.title;
    frame.appendChild(base);

    whenReady(base).then(() => {
      const rect = getContainRect(frame, base);

      item.hotspots.forEach((h) => {
        const marker = document.createElement("button");
        marker.className = "panorama-hotspot";
        marker.style.left = `${rect.offsetX + h.cx * rect.renderedW}px`;
        marker.style.top = `${rect.offsetY + h.cy * rect.renderedH}px`;
        marker.setAttribute("aria-label", h.title || "Reveal photo");

        const popup = document.createElement("img");
        popup.className = "panorama-hotspot-img";
        popup.src = h.src;
        popup.alt = h.title || "";
        marker.appendChild(popup);

        if (h.title) {
          const label = document.createElement("span");
          label.className = "panorama-hotspot-label";
          label.textContent = h.title;
          marker.appendChild(label);
        }

        marker.addEventListener("click", () => marker.classList.toggle("is-active"));
        frame.appendChild(marker);
      });
    });

    return frame;
  }

  deckPrevBtn.addEventListener("click", () => {
    deckIndex = (deckIndex - 1 + deckItems.length) % deckItems.length;
    showDeckSlide();
  });
  deckNextBtn.addEventListener("click", () => {
    deckIndex = (deckIndex + 1) % deckItems.length;
    showDeckSlide();
  });

  /* ---------- projects overview ---------- */
  const projectGrid = document.getElementById("projectGrid");

  function renderProjectGrid() {
    projectGrid.innerHTML = "";

    const cards = PROJECTS.filter((p) => !p.draft).map((p) => ({
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

    if (project.deck) {
      projectItemsGrid.hidden = true;
      deckEl.hidden = false;
      renderDeck(project.items);
    } else {
      deckEl.hidden = true;
      projectItemsGrid.hidden = false;
      renderItemsGrid(projectItemsGrid, project.items);
    }

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

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // no-op: gallery/map-pin hover handlers call this, but the site now uses the normal cursor
  function setCursorMode() {}

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

  /* ---------- discourage casual image saving ----------
     Not foolproof (nothing on the web can be) — this just removes the
     obvious right-click / drag-to-save path for casual visitors. */
  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  /* ---------- init ---------- */
  renderProjectGrid();
  showProjects();
})();
