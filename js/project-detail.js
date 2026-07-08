async function renderProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-footer-name]").forEach(el => el.textContent = site.name_footer || "");
  }

  const data = await fetchJSON("content/projects.json");
  const items = (data && data.items) ? data.items : [];
  const project = items.find(p => p.slug === id);

  const container = document.querySelector("[data-project-detail]");
  if (!project) {
    container.innerHTML = `<div class="empty-state">${t("not_found")} <a href="projects.html">${t("back_to_list")}</a></div>`;
    return;
  }

  document.title = `${tf(project, "title")} | ${site ? site.name_kr : ""}`;

  const cover = project.cover ? `<div class="detail-cover"><img src="${project.cover}" alt="${escapeHtml(tf(project, "title"))}"></div>` : "";
  const gallery = (project.gallery && project.gallery.length)
    ? `<div class="gallery">${project.gallery.map(g => `<img src="${g.photo || g}" alt="">`).join("")}</div>`
    : "";
  const report = project.report_file
    ? `<a class="report-link" href="${project.report_file}" target="_blank" rel="noopener">${t("report_link")}</a>`
    : "";

  container.innerHTML = `
    <a class="back-link" href="projects.html">${t("back_to_list")}</a>
    <div class="cat-row"><div class="detail-cat">${escapeHtml(categoryLabel(project.category))}</div>${project.brand ? `<span class="brand-tag">${escapeHtml(project.brand)}</span>` : ""}</div>
    <h1 class="detail-title">${escapeHtml(tf(project, "title"))}</h1>
    <div class="detail-meta">${escapeHtml(project.period || "")}${project.organizer ? " · " + escapeHtml(project.organizer) : ""}</div>
    ${cover}
    <p class="detail-summary">${escapeHtml(tf(project, "summary"))}</p>
    <div class="detail-body">${escapeHtml(tf(project, "description"))}</div>
    ${report}
    ${gallery}
  `;
}

document.addEventListener("DOMContentLoaded", renderProjectDetail);
