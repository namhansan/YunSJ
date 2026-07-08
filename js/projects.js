let ALL_PROJECTS = [];

function renderGrid(filter) {
  const grid = document.querySelector("[data-project-grid]");
  const list = filter === "all" ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.category === filter);
  const sorted = [...list].sort((a, b) => (b.order || 0) - (a.order || 0));
  grid.innerHTML = sorted.length
    ? sorted.map(projectCardHTML).join("")
    : `<div class="empty-state">해당 카테고리에 프로젝트가 아직 없습니다.</div>`;
}

async function renderProjectsPage() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-nickname]").forEach(el => el.textContent = site.nickname ? `(${site.nickname})` : "");
  }

  const data = await fetchJSON("content/projects.json");
  ALL_PROJECTS = (data && data.items) ? data.items : [];

  const filterBar = document.querySelector("[data-filter-bar]");
  const cats = [["all", "전체"], ...Object.entries(CATEGORY_LABELS)];
  filterBar.innerHTML = cats.map(([key, label], i) =>
    `<button class="filter-btn ${i === 0 ? "active" : ""}" data-filter="${key}">${label}</button>`
  ).join("");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderGrid(btn.dataset.filter);
  });

  renderGrid("all");
}

document.addEventListener("DOMContentLoaded", renderProjectsPage);
