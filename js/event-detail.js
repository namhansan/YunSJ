async function renderEventDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const site = await fetchJSON("content/site.json");
  if (site) {
    applySiteBasics(site);
  }

  const data = await fetchJSON("content/banners.json");
  const items = (data && data.items) ? data.items : [];
  const ev = items.find(e => e.slug === id);

  const container = document.querySelector("[data-event-detail]");
  if (!ev) {
    container.innerHTML = `<div class="empty-state">${t("event_not_found")} <a href="events.html">${t("back_to_events")}</a></div>`;
    return;
  }

  document.title = `${tf(ev, "title")} | ${site ? site.name_kr : ""}`;

  const cover = ev.image ? `<div class="detail-cover"><img src="${ev.image}" alt="${escapeHtml(tf(ev, "title"))}"></div>` : "";
  const gallery = (ev.gallery && ev.gallery.length)
    ? `<div class="gallery">${ev.gallery.map(g => `<img src="${g.photo || g}" alt="">`).join("")}</div>`
    : "";
  const report = ev.report_file
    ? `<a class="report-link" href="${ev.report_file}" target="_blank" rel="noopener">${t("report_link")}</a>`
    : "";
  const bodyText = tf(ev, "body") || tf(ev, "description");

  container.innerHTML = `
    <a class="back-link" href="events.html">${t("back_to_events")}</a>
    <div class="cat-row">${ev.location ? `<span class="brand-tag">${escapeHtml(tf(ev, "location"))}</span>` : ""}</div>
    <h1 class="detail-title">${escapeHtml(tf(ev, "title"))}</h1>
    <div class="detail-meta">${escapeHtml(ev.period || "")}</div>
    ${cover}
    <p class="detail-summary">${escapeHtml(tf(ev, "description"))}</p>
    <div class="detail-body">${escapeHtml(bodyText)}</div>
    ${report}
    ${gallery}
  `;
}

document.addEventListener("DOMContentLoaded", renderEventDetail);
