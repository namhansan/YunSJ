let ALL_MEDIA = [];
let CURRENT_TYPE = "all";

function mediaCardHTML(m) {
  const cover = m.cover ? `<div class="thumb"><img src="${m.cover}" alt="${escapeHtml(tf(m, "title"))}"></div>` : "";
  const linkBtn = m.link
    ? `<a class="btn outline small" href="${m.link}" target="_blank" rel="noopener">${t("media_view_link")}</a>` : "";
  const fileBtn = m.file
    ? `<a class="btn outline small" href="${m.file}" target="_blank" rel="noopener">${t("media_view_file")}</a>` : "";
  const lang = getLang();
  const typeLabel = (MEDIA_TYPE_LABELS[lang] && MEDIA_TYPE_LABELS[lang][m.type]) || m.type || "";
  return `
    <div class="media-card">
      ${cover}
      <div class="body">
        <div class="media-type">${escapeHtml(typeLabel)}</div>
        <h3>${escapeHtml(tf(m, "title"))}</h3>
        <div class="meta">${escapeHtml(m.source || "")}${m.date ? " · " + escapeHtml(m.date) : ""}</div>
        ${tf(m, "summary") ? `<p>${escapeHtml(tf(m, "summary"))}</p>` : ""}
        <div class="links">${linkBtn}${fileBtn}</div>
      </div>
    </div>`;
}

function renderMediaGrid() {
  const grid = document.querySelector("[data-media-grid]");
  const list = CURRENT_TYPE === "all" ? ALL_MEDIA : ALL_MEDIA.filter(m => m.type === CURRENT_TYPE);
  const sorted = [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  grid.innerHTML = sorted.length
    ? sorted.map(mediaCardHTML).join("")
    : `<div class="empty-state">${t("empty_media")}</div>`;
}

async function renderMediaPage() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    applySiteBasics(site);
  }

  const data = await fetchJSON("content/media.json");
  ALL_MEDIA = (data && data.items) ? data.items : [];

  const bar = document.querySelector("[data-filter-bar]");
  const lang = getLang();
  const options = [["all", t("filter_all")], ...Object.keys(MEDIA_TYPE_LABELS.ko).map(k => [k, MEDIA_TYPE_LABELS[lang][k]])];
  bar.innerHTML = options.map(([key, label]) =>
    `<button class="filter-btn ${key === CURRENT_TYPE ? "active" : ""}" data-type="${key}">${escapeHtml(label)}</button>`
  ).join("");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    CURRENT_TYPE = btn.dataset.type;
    bar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMediaGrid();
  });

  renderMediaGrid();
}

document.addEventListener("DOMContentLoaded", renderMediaPage);
