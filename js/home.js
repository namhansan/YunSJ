function projectCardHTML(p) {
  const cover = p.cover ? `<img src="${p.cover}" alt="${escapeHtml(tf(p, "title"))}">` : "";
  return `
    <a class="project-card reveal" href="project.html?id=${encodeURIComponent(p.slug)}">
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
    <div class="brand-card reveal">
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
  if (!el || !live || !live.enabled) return;

  const vid = extractYoutubeId(live.youtube_url);
  const hasThumb = !!vid;
  const thumb = hasThumb
    ? `<a class="live-thumb" href="${live.youtube_url}" target="_blank" rel="noopener">
         <img src="https://img.youtube.com/vi/${vid}/hqdefault.jpg" alt="">
         <span class="play-icon"><span class="play-icon-circle"></span></span>
       </a>`
    : "";
  const watchBtn = live.youtube_url
    ? `<a class="btn small" style="align-self:flex-start;" href="${live.youtube_url}" target="_blank" rel="noopener">${t("live_watch")}</a>`
    : "";

  el.innerHTML = `
    <div class="live-card${hasThumb ? "" : " no-thumb"}">
      ${thumb}
      <div class="live-body">
        <span class="live-badge"><span class="live-dot"></span> ${t("live_badge")}</span>
        <h3>${escapeHtml(tf(live, "title"))}</h3>
        ${tf(live, "description") ? `<p>${escapeHtml(tf(live, "description"))}</p>` : ""}
        ${watchBtn}
      </div>
    </div>`;
  el.closest("section").style.display = "block";
}

let BANNER_ITEMS = [];
let BANNER_INDEX = 0;

function eventLink(e) {
  if (e.link) return { href: e.link, target: "_blank", rel: 'rel="noopener"' };
  return { href: `event.html?id=${encodeURIComponent(e.slug)}`, target: "_self", rel: "" };
}

function eventCardHTML(e) {
  const img = e.image ? `<img src="${e.image}" alt="${escapeHtml(tf(e, "title"))}">` : "";
  const loc = tf(e, "location");
  const lang = getLang();
  const statusLabel = EVENT_STATUS_LABELS[lang][e.status] || "";
  const catLabel = EVENT_CATEGORY_LABELS[lang][e.category] || "";
  const { href, target, rel } = eventLink(e);
  return `
    <a class="project-card reveal" href="${href}" target="${target}" ${rel}>
      <div class="thumb">${img}${e.status === "past" ? `<span class="status-badge past">${escapeHtml(statusLabel)}</span>` : ""}</div>
      <div class="body">
        <div class="cat-row">
          ${catLabel ? `<span class="cat">${escapeHtml(catLabel)}</span>` : ""}
          ${loc ? `<span class="brand-tag">${escapeHtml(loc)}</span>` : ""}
          ${e.status === "ongoing" ? `<span class="brand-tag status-ongoing">${escapeHtml(statusLabel)}</span>` : ""}
        </div>
        <h3>${escapeHtml(tf(e, "title"))}</h3>
        <div class="meta">${escapeHtml(e.period || "")}</div>
        ${tf(e, "description") ? `<p style="font-size:14px;color:var(--navy-soft);margin:10px 0 0;">${escapeHtml(tf(e, "description"))}</p>` : ""}
      </div>
    </a>`;
}

function renderBannerFrame() {
  const el = document.querySelector("[data-banner]");
  if (!el || !BANNER_ITEMS.length) return;
  const b = BANNER_ITEMS[BANNER_INDEX];
  const img = b.image ? `<div class="banner-photo"><img src="${b.image}" alt=""></div>` : "";
  const bLink = eventLink(b);
  const link = `<a class="btn" href="${bLink.href}" target="${bLink.target}" ${bLink.rel}>${escapeHtml(tf(b, "link_text") || t("banner_default_link"))}</a>`;
  const arrows = BANNER_ITEMS.length > 1
    ? `<button class="carousel-arrow prev" data-dir="-1" aria-label="prev">‹</button>
       <button class="carousel-arrow next" data-dir="1" aria-label="next">›</button>`
    : "";
  const dots = BANNER_ITEMS.length > 1
    ? `<div class="carousel-dots">${BANNER_ITEMS.map((_, i) => `<span class="dot${i === BANNER_INDEX ? " active" : ""}" data-dot="${i}"></span>`).join("")}</div>`
    : "";

  el.querySelector(".wrap").innerHTML = `
    <div class="banner-carousel">
      ${arrows}
      <div class="banner-inner">
        ${img}
        <div class="banner-text">
          <div class="section-eyebrow">${t("events_eyebrow")}</div>
          <h2><a href="#current-events">${escapeHtml(tf(b, "title"))}</a></h2>
          ${b.location || b.period ? `<div class="banner-meta">${escapeHtml(tf(b, "location") || "")}${b.location && b.period ? " · " : ""}${escapeHtml(b.period || "")}</div>` : ""}
          <p>${escapeHtml(tf(b, "description"))}</p>
          ${link}
        </div>
      </div>
      ${dots}
    </div>`;

  el.querySelectorAll("[data-dir]").forEach(btn => {
    btn.addEventListener("click", () => {
      BANNER_INDEX = (BANNER_INDEX + parseInt(btn.dataset.dir) + BANNER_ITEMS.length) % BANNER_ITEMS.length;
      renderBannerFrame();
    });
  });
  el.querySelectorAll("[data-dot]").forEach(dot => {
    dot.addEventListener("click", () => {
      BANNER_INDEX = parseInt(dot.dataset.dot);
      renderBannerFrame();
    });
  });
}

async function renderBannerAndEvents() {
  const data = await fetchJSON("content/banners.json");
  const bannerEl = document.querySelector("[data-banner]");
  const eventsEl = document.querySelector("[data-events]");
  const items = (data && data.items) ? data.items.filter(i => i.enabled !== false && i.status !== "past") : [];
  BANNER_ITEMS = items;
  BANNER_INDEX = 0;

  if (bannerEl) {
    if (items.length) {
      renderBannerFrame();
      bannerEl.style.display = "block";
    } else {
      bannerEl.style.display = "none";
    }
  }

  if (eventsEl) {
    if (items.length) {
      const titleEl = eventsEl.querySelector("[data-events-title]");
      if (titleEl) titleEl.textContent = tf(data, "section_title") || t("events_title_fallback");
      eventsEl.querySelector("[data-events-grid]").innerHTML = items.map(eventCardHTML).join("");
      eventsEl.closest("section").style.display = "block";
    } else {
      eventsEl.closest("section").style.display = "none";
    }
  }
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

// 히어로 + 각 섹션(.section) 중 실제로 화면에 "보이는" 것만 순서대로 골라
// 배경을 흰색(band-light)/연회색(band-deep)으로 번갈아 붙인다.
// 배너·라이브·진행중 행사처럼 켜졌다 꺼졌다 하는 블록이 있어도
// 항상 인접한 두 블록의 배경이 달라지도록 매번 다시 계산.
function equalizeSectionBands() {
  const hero = document.querySelector(".hero");
  const sections = Array.from(document.querySelectorAll("body > .section, main .section"));
  const isVisible = (el) => !!el && window.getComputedStyle(el).display !== "none";

  if (hero) {
    hero.classList.remove("band-light", "band-deep");
    hero.classList.add("band-light");
  }

  let deepNext = true; // 히어로 바로 다음에 보이는 섹션은 연회색으로 시작
  sections.forEach((sec) => {
    sec.classList.remove("band-light", "band-deep");
    if (!isVisible(sec)) return; // 숨겨진 섹션은 순서 계산에서 제외
    sec.classList.add(deepNext ? "band-deep" : "band-light");
    deepNext = !deepNext;
  });
}

let BANNER_TIMER = null;
function startBannerAutoplay() {
  clearInterval(BANNER_TIMER);
  const el = document.querySelector("[data-banner]");
  if (!el || BANNER_ITEMS.length <= 1 || window.getComputedStyle(el).display === "none") return;
  const advance = () => {
    BANNER_INDEX = (BANNER_INDEX + 1) % BANNER_ITEMS.length;
    renderBannerFrame();
  };
  BANNER_TIMER = setInterval(advance, 6000);
  el.addEventListener("mouseenter", () => clearInterval(BANNER_TIMER));
  el.addEventListener("mouseleave", () => {
    clearInterval(BANNER_TIMER);
    BANNER_TIMER = setInterval(advance, 6000);
  });
}

async function renderHome() {
  equalizeSectionBands(); // 데이터 로드 전 1차 계산 (깜빡임 최소화)

  const site = await fetchJSON("content/site.json");
  if (site) {
    applySiteBasics(site);
    document.querySelectorAll("[data-tagline]").forEach(el => el.textContent = tf(site, "tagline"));
    document.querySelectorAll("[data-intro]").forEach(el => el.textContent = tf(site, "intro"));
    document.querySelectorAll("[data-phone]").forEach(el => el.textContent = site.phone || "");
    document.querySelectorAll("[data-email]").forEach(el => el.textContent = site.email || "");
    const photoEl = document.querySelector("[data-photo]");
    if (photoEl && site.profile_photo) photoEl.innerHTML = `<img src="${site.profile_photo}" alt="${escapeHtml(site.name_kr)}">`;
    const titlesEl = document.querySelector("[data-titles]");
    if (titlesEl && site.titles) {
      titlesEl.innerHTML = site.titles.map(tt => `<span class="pill">${escapeHtml(tf(tt, "label"))}</span>`).join("");
    }
  }

  await renderLive();
  await renderBannerAndEvents();
  await renderBrands();

  const projects = await fetchJSON("content/projects.json");
  const grid = document.querySelector("[data-featured-projects]");
  if (grid) {
    const items = (projects && projects.items) ? projects.items : [];
    const featured = items.filter(p => p.featured).length ? items.filter(p => p.featured) : items;
    const top = featured.slice(0, 6);
    grid.innerHTML = top.length ? top.map(projectCardHTML).join("") : `<div class="empty-state">${t("empty_projects")}</div>`;
  }

  equalizeSectionBands();
  observeReveals();
  startBannerAutoplay();
}

document.addEventListener("DOMContentLoaded", renderHome);
