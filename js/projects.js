let ALL_PROJECTS = [];
let CURRENT_CAT = "all";
let CURRENT_BRAND = "all";

function renderGrid() {
  const grid = document.querySelector("[data-project-grid]");
  let list = ALL_PROJECTS;
  if (CURRENT_CAT !== "all") list = list.filter(p => p.category === CURRENT_CAT);
  if (CURRENT_BRAND !== "all") list = list.filter(p => p.brand === CURRENT_BRAND);
  const sorted = [...list].sort((a, b) => (b.order || 0) - (a.order || 0));
  grid.innerHTML = sorted.length
    ? sorted.map(projectCardHTML).join("")
    : `<div class="empty-state">${t("empty_filtered")}</div>`;
}

async function renderProjectsPage() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-footer-name]").forEach(el => el.textContent = site.name_footer || "");
  }

  const data = await fetchJSON("content/projects.json");
  ALL_PROJECTS = (data && data.items) ? data.items : [];

  const params = new URLSearchParams(window.location.search);
  const brandParam = params.get("brand");
  if (brandParam) CURRENT_BRAND = brandParam;

  const catBar = document.querySelector("[data-filter-bar]");
  const catOptions = [["all", t("filter_all")], ...Object.keys(CATEGORY_LABELS.ko).map(k => [k, categoryLabel(k)])];
  catBar.innerHTML = catOptions.map(([key, label]) =>
    `<button class="filter-btn ${key === CURRENT_CAT ? "active" : ""}" data-cat="${key}">${label}</button>`
  ).join("");
  catBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    CURRENT_CAT = btn.dataset.cat;
    catBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid();
  });

  const brands = [...new Set(ALL_PROJECTS.map(p => p.brand).filter(Boolean))];
  const brandBar = document.querySelector("[data-brand-filter-bar]");
  if (brands.length) {
    const brandOptions = [["all", t("filter_brand_all")], ...brands.map(b => [b, b])];
    brandBar.innerHTML = brandOptions.map(([key, label]) =>
      `<button class="filter-btn ${key === CURRENT_BRAND ? "active" : ""}" data-brand="${key}">${escapeHtml(label)}</button>`
    ).join("");
    brandBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      CURRENT_BRAND = btn.dataset.brand;
      brandBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGrid();
    });
  } else {
    brandBar.style.display = "none";
  }

  renderGrid();
}

document.addEventListener("DOMContentLoaded", renderProjectsPage);
