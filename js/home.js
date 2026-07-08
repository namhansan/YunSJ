const CATEGORY_LABELS = {
  director: "축제총감독",
  direction: "행사연출",
  consulting: "컨설팅·연구",
  lecture: "강의·교육"
};

function projectCardHTML(p) {
  const cover = p.cover ? `<img src="${p.cover}" alt="${escapeHtml(p.title)}">` : "";
  return `
    <a class="project-card" href="project.html?id=${encodeURIComponent(p.slug)}">
      <div class="thumb">${cover}</div>
      <div class="body">
        <div class="cat">${CATEGORY_LABELS[p.category] || p.category || ""}</div>
        <h3>${escapeHtml(p.title)}</h3>
        <div class="meta">${escapeHtml(p.period || "")}${p.organizer ? " · " + escapeHtml(p.organizer) : ""}</div>
      </div>
    </a>`;
}

async function renderHome() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-nickname]").forEach(el => el.textContent = site.nickname ? `(${site.nickname})` : "");
    document.querySelectorAll("[data-tagline]").forEach(el => el.textContent = site.tagline || "");
    document.querySelectorAll("[data-intro]").forEach(el => el.textContent = site.intro || "");
    document.querySelectorAll("[data-phone]").forEach(el => el.textContent = site.phone || "");
    document.querySelectorAll("[data-email]").forEach(el => el.textContent = site.email || "");
    const photoEl = document.querySelector("[data-photo]");
    if (photoEl && site.profile_photo) photoEl.innerHTML = `<img src="${site.profile_photo}" alt="${escapeHtml(site.name_kr)}">`;
    const titlesEl = document.querySelector("[data-titles]");
    if (titlesEl && site.titles) {
      titlesEl.innerHTML = site.titles.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("");
    }
  }

  const projects = await fetchJSON("content/projects.json");
  const grid = document.querySelector("[data-featured-projects]");
  if (grid) {
    const items = (projects && projects.items) ? projects.items : [];
    const featured = items.filter(p => p.featured).length ? items.filter(p => p.featured) : items;
    const top = featured.slice(0, 6);
    grid.innerHTML = top.length
      ? top.map(projectCardHTML).join("")
      : `<div class="empty-state">진행 중인 프로젝트가 곧 소개될 예정입니다.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", renderHome);
