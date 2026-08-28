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

if (document.querySelector(".slider-wrap")) {
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

const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
  const root = document.documentElement;

  const sync = () => {
    themeToggle.textContent = root.dataset.theme === "dark" ? "Light" : "Dark";
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
