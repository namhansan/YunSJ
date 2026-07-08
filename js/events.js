async function renderEventsPage() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    applySiteBasics(site);
  }

  const data = await fetchJSON("content/banners.json");
  const items = (data && data.items) ? data.items.filter(i => i.enabled !== false) : [];

  const titleEl = document.querySelector("[data-events-title]");
  if (titleEl) titleEl.textContent = (data && tf(data, "section_title")) || t("events_title_fallback");

  const grid = document.querySelector("[data-events-grid]");
  grid.innerHTML = items.length ? items.map(eventCardHTML).join("") : `<div class="empty-state">${t("empty_events")}</div>`;
}

document.addEventListener("DOMContentLoaded", renderEventsPage);
