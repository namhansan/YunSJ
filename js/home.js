function projectCardHTML(p) {
  const cover = p.cover ? `<img src="${p.cover}" alt="${escapeHtml(tf(p, "title"))}">` : "";
  return `
    <a class="project-card" href="project.html?id=${encodeURIComponent(p.slug)}">
      <div class="thumb">${cover}</div>
      <div class="body">
        <div class="cat-row">
          <span class="cat">${escapeHtml(categoryLabel(p.category))}</span>
          ${p.brand ? `<span class="brand-tag">${escapeHtml(p.brand)}</span>` : ""}
        </div>
        <h3>${escapeHtml(tf(p, "title"))}</h3>
        <div class="meta">${escapeHtml(p.period || "")}${p.organizer ? " · " + escapeHtml(p.organizer) : ""}</div>
      </div>
    </a>`;
}

function brandCardHTML(b) {
  const logo = b.logo ? `<img src="${b.logo}" alt="${escapeHtml(tf(b, "name"))}">` : "";
  const visit = b.url ? `<a class="btn outline small" href="${b.url}" target="_blank" rel="noopener">${t("brand_visit")}</a>` : "";
  const related = `<a class="btn outline small" href="projects.html?brand=${encodeURIComponent(b.name)}">${t("brand_related")}</a>`;
  return `
    <div class="brand-card">
      <div class="brand-logo">${logo}</div>
      <h3>${escapeHtml(tf(b, "name"))}</h3>
      ${tf(b, "tagline") ? `<div class="brand-tagline">${escapeHtml(tf(b, "tagline"))}</div>` : ""}
      <p>${escapeHtml(tf(b, "description"))}</p>
      <div class="brand-actions">${visit}${related}</div>
    </div>`;
}

async function renderLive() {
  const live = await fetchJSON("content/live.json");
  const el = document.querySelector("[data-live]");
  if (!el || !live || !live.enabled || !live.youtube_url) return;

  const vid = extractYoutubeId(live.youtube_url);
  const thumb = vid
    ? `<img src="https://img.youtube.com/vi/${vid}/hqdefault.jpg" alt="">`
    : "";

  el.innerHTML = `
    <div class="live-card">
      <a class="live-thumb" href="${live.youtube_url}" target="_blank" rel="noopener">
        ${thumb}
        <span class="play-icon"><span class="play-icon-circle"></span></span>
      </a>
      <div class="live-body">
        <span class="live-badge"><span class="live-dot"></span> ${t("live_badge")}</span>
        <h3>${escapeHtml(tf(live, "title"))}</h3>
        ${tf(live, "description") ? `<p>${escapeHtml(tf(live, "description"))}</p>` : ""}
        <a class="btn small" style="align-self:flex-start;" href="${live.youtube_url}" target="_blank" rel="noopener">${t("live_watch")}</a>
      </div>
    </div>`;
  el.closest("section").style.display = "block";
}

async function renderBanner() {
  const banner = await fetchJSON("content/banner.json");
  const el = document.querySelector("[data-banner]");
  if (!el || !banner || !banner.enabled) return;
  const img = banner.image ? `<div class="banner-photo"><img src="${banner.image}" alt=""></div>` : "";
  const link = banner.link
    ? `<a class="btn" href="${banner.link}">${escapeHtml(tf(banner, "link_text") || t("banner_default_link"))}</a>`
    : "";
  el.innerHTML = `
    <div class="banner-inner">
      ${img}
      <div class="banner-text">
        <div class="section-eyebrow">NOW ON</div>
        <h2>${escapeHtml(tf(banner, "title"))}</h2>
        <p>${escapeHtml(tf(banner, "description"))}</p>
        ${link}
      </div>
    </div>`;
  el.style.display = "block";
}

async function renderBrands() {
  const data = await fetchJSON("content/brands.json");
  const el = document.querySelector("[data-brands]");
  if (!el) return;
  const items = (data && data.items) ? data.items : [];
  if (!items.length) {
    el.closest("section").style.display = "none";
    return;
  }
  el.innerHTML = items.map(brandCardHTML).join("");
}

async function renderHome() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-tagline]").forEach(el => el.textContent = tf(site, "tagline"));
    document.querySelectorAll("[data-intro]").forEach(el => el.textContent = tf(site, "intro"));
    document.querySelectorAll("[data-phone]").forEach(el => el.textContent = site.phone || "");
    document.querySelectorAll("[data-email]").forEach(el => el.textContent = site.email || "");
    document.querySelectorAll("[data-footer-name]").forEach(el => el.textContent = site.name_footer || "");
    const photoEl = document.querySelector("[data-photo]");
    if (photoEl && site.profile_photo) photoEl.innerHTML = `<img src="${site.profile_photo}" alt="${escapeHtml(site.name_kr)}">`;
    const titlesEl = document.querySelector("[data-titles]");
    if (titlesEl && site.titles) {
      titlesEl.innerHTML = site.titles.map(tt => `<span class="pill">${escapeHtml(tf(tt, "label"))}</span>`).join("");
    }
  }

  await renderLive();
  await renderBanner();
  await renderBrands();

  const projects = await fetchJSON("content/projects.json");
  const grid = document.querySelector("[data-featured-projects]");
  if (grid) {
    const items = (projects && projects.items) ? projects.items : [];
    const featured = items.filter(p => p.featured).length ? items.filter(p => p.featured) : items;
    const top = featured.slice(0, 6);
    grid.innerHTML = top.length ? top.map(projectCardHTML).join("") : `<div class="empty-state">${t("empty_projects")}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", renderHome);
