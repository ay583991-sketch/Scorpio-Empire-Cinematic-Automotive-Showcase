(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Mobile navigation
  const menuToggle = $("#menu-toggle");
  const navMenu = $("#nav-menu");
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    navMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  $$(".site-nav a").forEach((link) =>
    link.addEventListener("click", closeMenu),
  );
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Header glass treatment + scroll progress + restrained parallax.
  const header = $("#site-header");
  const progressBar = $("#scroll-progress-bar");
  let scrollPending = false;
  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    scrollPending = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollPending) {
        window.requestAnimationFrame(updateScrollUI);
        scrollPending = true;
      }
    },
    { passive: true },
  );
  updateScrollUI();

  // Reveal elements as they enter the viewport.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // 3D cursor tilt: transforms are bounded to avoid a disorienting effect.
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const heroWrap = $("#hero-car-wrap");
  if (canHover && !reducedMotion) {
    heroWrap?.addEventListener("pointermove", (event) => {
      const bounds = heroWrap.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroWrap.style.transform = `rotateY(${-11 + x * 9}deg) rotateX(${3 - y * 7}deg) rotateZ(${-1 + x * 1.5}deg)`;
    });
    heroWrap?.addEventListener("pointerleave", () => {
      heroWrap.style.transform = "rotateY(-11deg) rotateX(3deg) rotateZ(-1deg)";
    });

    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (window.innerWidth <= 520) return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.transform = `rotateX(${-y * 4.5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Subtle cursor halo on precision-pointer devices.
  const pointerGlow = $("#pointer-glow");
  if (canHover && !reducedMotion && pointerGlow) {
    let glowPending = false;
    window.addEventListener(
      "pointermove",
      (event) => {
        if (glowPending) return;
        glowPending = true;
        window.requestAnimationFrame(() => {
          pointerGlow.style.left = `${event.clientX}px`;
          pointerGlow.style.top = `${event.clientY}px`;
          pointerGlow.style.opacity = "1";
          glowPending = false;
        });
      },
      { passive: true },
    );
  }

  // Accessible image lightbox.
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  const lightboxClose = $("#lightbox-close");
  let lastFocusedElement = null;
  function openLightbox(button) {
    const imagePath = button.dataset.lightbox;
    if (!imagePath) return;
    const sourceImage = $("img", button);
    lastFocusedElement = document.activeElement;
    lightboxImage.src = imagePath;
    lightboxImage.alt =
      sourceImage?.alt ||
      button.dataset.caption ||
      "Scorpio gallery photograph";
    lightboxCaption.textContent = button.dataset.caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.removeAttribute("src");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  }
  $$("[data-lightbox]").forEach((button) =>
    button.addEventListener("click", () => openLightbox(button)),
  );
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open"))
      closeLightbox();
    if (event.key === "Tab" && lightbox.classList.contains("is-open")) {
      event.preventDefault();
      lightboxClose.focus();
    }
  });

  // Client-side demo form: validate and explain that no backend is connected.
  const form = $("#contact-form");
  const formStatus = $("#form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";
    const requiredFields = $$(
      "input[required], textarea[required], select[required]",
      form,
    );
    let firstInvalid = null;
    requiredFields.forEach((field) => {
      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      formStatus.textContent =
        "Please check the highlighted fields and complete the form.";
      firstInvalid.focus();
      return;
    }
    formStatus.textContent =
      "Thanks — your form looks good. This preview does not send data yet; connect a secure form backend before going live.";
  });
  $$("input, textarea, select", form).forEach((field) => {
    field.addEventListener("input", () =>
      field.setAttribute("aria-invalid", String(!field.checkValidity())),
    );
    field.addEventListener("change", () =>
      field.setAttribute("aria-invalid", String(!field.checkValidity())),
    );
  });

  // Highlight the nav destination currently nearest the viewport.
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const targetId = entry.target.id;
          $$(".nav-link").forEach((link) => {
            const active = link.getAttribute("href") === `#${targetId}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-34% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
})();
