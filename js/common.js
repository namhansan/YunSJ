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

document.addEventListener("DOMContentLoaded", initNav);
