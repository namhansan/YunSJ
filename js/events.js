let ALL_EVENTS = [];
let CURRENT_TAB = "current"; // current | past | all
let CURRENT_CATEGORY = "all";
let DATE_FILTER = null;

function renderEventsGrid() {
  const grid = document.querySelector("[data-events-grid]");
  let list = ALL_EVENTS;
  if (DATE_FILTER) {
    list = list.filter(e => e.start_date && DATE_FILTER >= e.start_date && DATE_FILTER <= (e.end_date || e.start_date));
  } else {
    if (CURRENT_TAB === "current") list = list.filter(e => e.status !== "past");
    if (CURRENT_TAB === "past") list = list.filter(e => e.status === "past");
    if (CURRENT_CATEGORY !== "all") list = list.filter(e => e.category === CURRENT_CATEGORY);
  }
  grid.innerHTML = list.length ? list.map(eventCardHTML).join("") : `<div class="empty-state">${t("empty_events")}</div>`;
}

async function renderEventsPage() {
  const site = await fetchJSON("content/site.json");
  applySiteBasics(site);

  const data = await fetchJSON("content/banners.json");
  ALL_EVENTS = (data && data.items) ? data.items : [];

  const params = new URLSearchParams(window.location.search);
  const dateParam = params.get("date");
  if (dateParam) DATE_FILTER = dateParam;

  const titleEl = document.querySelector("[data-events-title]");
  if (titleEl) {
    titleEl.textContent = dateParam
      ? dateParam
      : (data && tf(data, "section_title")) || t("events_title_fallback");
  }

  const tabBar = document.querySelector("[data-status-tabs]");
  const tabs = [["current", t("tab_current_events")], ["past", t("tab_past_events")], ["all", t("filter_all")]];
  tabBar.innerHTML = tabs.map(([key, label]) =>
    `<button class="filter-btn ${key === CURRENT_TAB ? "active" : ""}" data-tab="${key}">${label}</button>`
  ).join("");
  tabBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    CURRENT_TAB = btn.dataset.tab;
    DATE_FILTER = null;
    tabBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderEventsGrid();
  });

  const lang = getLang();
  const catBar = document.querySelector("[data-category-tabs]");
  const cats = [["all", t("filter_category_all")], ...Object.keys(EVENT_CATEGORY_LABELS.ko).map(k => [k, EVENT_CATEGORY_LABELS[lang][k]])];
  catBar.innerHTML = cats.map(([key, label]) =>
    `<button class="filter-btn ${key === CURRENT_CATEGORY ? "active" : ""}" data-cat="${key}">${escapeHtml(label)}</button>`
  ).join("");
  catBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    CURRENT_CATEGORY = btn.dataset.cat;
    DATE_FILTER = null;
    catBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderEventsGrid();
  });

  renderEventsGrid();
}

document.addEventListener("DOMContentLoaded", renderEventsPage);
