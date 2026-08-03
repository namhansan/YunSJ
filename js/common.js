async function fetchJSON(path) {
  try {
    const res = await fetch(path + "?t=" + Date.now());
    if (!res.ok) throw new Error("failed to load " + path);
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function extractYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([\w-]{6,})/,
    /[?&]v=([\w-]{6,})/,
    /youtube\.com\/live\/([\w-]{6,})/,
    /youtube\.com\/embed\/([\w-]{6,})/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function initBackToTop() {
  const btn = document.querySelector("[data-back-to-top]");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function observeReveals(root = document) {
  const items = root.querySelectorAll(".reveal:not(.reveal-ready)");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(el => el.classList.add("reveal-ready", "in-view"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  items.forEach((el, i) => {
    el.classList.add("reveal-ready");
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
    io.observe(el);
  });
}
window.observeReveals = observeReveals;

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const statusEl = form.querySelector("[data-form-status]");
  const submitBtn = form.querySelector('button[type="submit"]');

  const encode = (data) =>
    Object.keys(data).map(k => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    submitBtn.disabled = true;
    statusEl.textContent = t("contact_form_sending");
    statusEl.className = "form-status";

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(data),
    })
      .then(() => {
        statusEl.textContent = t("contact_form_success");
        statusEl.className = "form-status success";
        form.reset();
      })
      .catch(() => {
        statusEl.textContent = t("contact_form_error");
        statusEl.className = "form-status error";
      })
      .finally(() => { submitBtn.disabled = false; });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initBackToTop();
  observeReveals();
  initContactForm();
});
