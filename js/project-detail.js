async function renderProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-nickname]").forEach(el => el.textContent = site.nickname ? `(${site.nickname})` : "");
  }

  const data = await fetchJSON("content/projects.json");
  const items = (data && data.items) ? data.items : [];
  const project = items.find(p => p.slug === id);

  const container = document.querySelector("[data-project-detail]");
  if (!project) {
    container.innerHTML = `<div class="empty-state">프로젝트를 찾을 수 없습니다. <a href="projects.html">전체 프로젝트로 돌아가기</a></div>`;
    return;
  }

  document.title = `${project.title} | 윤성진(몽감독)`;

  const cover = project.cover ? `<div class="detail-cover"><img src="${project.cover}" alt="${escapeHtml(project.title)}"></div>` : "";
  const gallery = (project.gallery && project.gallery.length)
    ? `<div class="gallery">${project.gallery.map(g => `<img src="${g.photo || g}" alt="">`).join("")}</div>`
    : "";
  const report = project.report_file
    ? `<a class="report-link" href="${project.report_file}" target="_blank" rel="noopener">📄 관련 보고서 보기</a>`
    : "";

  container.innerHTML = `
    <a class="back-link" href="projects.html">← 전체 프로젝트로 돌아가기</a>
    <div class="detail-cat">${CATEGORY_LABELS[project.category] || project.category || ""}</div>
    <h1 class="detail-title">${escapeHtml(project.title)}</h1>
    <div class="detail-meta">${escapeHtml(project.period || "")}${project.organizer ? " · " + escapeHtml(project.organizer) : ""}</div>
    ${cover}
    <p class="detail-summary">${escapeHtml(project.summary || "")}</p>
    <div class="detail-body">${escapeHtml(project.description || "")}</div>
    ${report}
    ${gallery}
  `;
}

document.addEventListener("DOMContentLoaded", renderProjectDetail);
