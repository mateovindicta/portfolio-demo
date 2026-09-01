document.getElementById("year").textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

if (header && hero) {
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        header.classList.toggle("scrolled", !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  ).observe(hero);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const indexItems = document.querySelectorAll(".index-item");

indexItems.forEach((item) => {
  const btn = item.querySelector(".index-link");
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    indexItems.forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".index-link").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

const navLinks = document.querySelectorAll(".site-nav a");
const sections = [...navLinks]
  .map((link) => {
    const hash = link.getAttribute("href");
    return hash && hash.startsWith("#") ? document.querySelector(hash) : null;
  })
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          )
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => spy.observe(section));

document.querySelectorAll("[data-showcase]").forEach((showcase) => {
  const slides = [...showcase.querySelectorAll(".showcase-slide")];
  const wrap = showcase.closest(".showcase-wrap");
  const current = wrap.querySelector(".showcase-current");
  const total = wrap.querySelector(".showcase-total");
  let index = 0;

  if (total) total.textContent = slides.length;

  const show = (i) => {
    slides[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
    if (current) current.textContent = index + 1;
  };

  wrap.querySelectorAll(".showcase-arrow").forEach((btn) => {
    btn.addEventListener("click", () => show(index + Number(btn.dataset.dir)));
  });
});

if (
  document.querySelector(".slider-wrap") ||
  document.querySelector(".mosaic-grid")
) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<img alt="">';
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");

  const closeLightbox = () => lightbox.classList.remove("open");
  lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  const openLightbox = (img) => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add("open");
  };

  window.__openLightbox = openLightbox;
}

document.querySelectorAll(".slider-wrap").forEach((wrap) => {
  const slider = wrap.querySelector("[data-slider]");
  const slides = [...slider.querySelectorAll(".slide")];
  const current = wrap.querySelector(".slider-current");
  const total = wrap.querySelector(".slider-total");
  let index = 0;

  if (total) total.textContent = slides.length;

  const applyRatio = () => {
    if (!slider.classList.contains("adaptive")) return;
    const img = slides[index].querySelector("img");
    if (!img) return;
    const set = () => {
      if (img.naturalWidth && img.naturalHeight) {
        slider.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
      }
    };
    if (img.complete) set();
    else img.addEventListener("load", set, { once: true });
  };

  applyRatio();

  const show = (i) => {
    slides[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
    if (current) current.textContent = index + 1;
    applyRatio();
  };

  wrap.querySelectorAll(".slider-arrow").forEach((btn) => {
    btn.addEventListener("click", () => show(index + Number(btn.dataset.dir)));
  });

  slider.addEventListener("click", () => show(index + 1));

  const fsBtn = wrap.querySelector(".fullsize-btn");
  if (fsBtn && window.__openLightbox) {
    fsBtn.addEventListener("click", () => {
      const img = slides[index].querySelector("img");
      if (img) window.__openLightbox(img);
    });
  }
});

document.querySelectorAll(".mosaic-item .mosaic-img img").forEach((img) => {
  if (!window.__openLightbox) return;
  img.style.cursor = "zoom-in";
  img.addEventListener("click", () => window.__openLightbox(img));
});

const themeToggle = document.querySelector(".theme-toggle");

const SUN_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const MOON_ICON =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

if (themeToggle) {
  const root = document.documentElement;

  const sync = () => {
    themeToggle.innerHTML =
      root.dataset.theme === "dark" ? SUN_ICON : MOON_ICON;
  };
  sync();

  themeToggle.addEventListener("click", () => {
    if (root.dataset.theme === "dark") {
      delete root.dataset.theme;
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {}
    } else {
      root.dataset.theme = "dark";
      try {
        localStorage.setItem("theme", "dark");
      } catch (e) {}
    }
    sync();
  });
}
