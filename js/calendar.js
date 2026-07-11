let CAL_EVENTS = [];
let CAL_VIEW = "month"; // month | year
let CAL_DATE = new Date();

function pad2(n) { return String(n).padStart(2, "0"); }
function dateKey(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }

function eventsOnDate(dateStr) {
  return CAL_EVENTS.filter(e => {
    if (!e.start_date) return false;
    const start = e.start_date;
    const end = e.end_date || e.start_date;
    return dateStr >= start && dateStr <= end;
  });
}

function goToDate(dateStr) {
  window.location.href = `events.html?date=${dateStr}`;
}

function renderHeader() {
  const lang = getLang();
  const label = document.querySelector("[data-cal-label]");
  if (CAL_VIEW === "month") {
    label.textContent = CAL_DATE.toLocaleDateString(lang === "en" ? "en-US" : "ko-KR", { year: "numeric", month: "long" });
  } else {
    label.textContent = `${CAL_DATE.getFullYear()}`;
  }
}

function renderMonthGrid(year, monthIndex, compact) {
  const weekdays = t("weekdays").split(",");
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayStr = dateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  let cells = "";
  for (let i = 0; i < startOffset; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = dateKey(year, monthIndex, d);
    const evts = eventsOnDate(ds);
    const hasEvent = evts.length > 0;
    const isToday = ds === todayStr;
    cells += `<div class="cal-cell${hasEvent ? " has-event" : ""}${isToday ? " today" : ""}" ${hasEvent ? `data-date="${ds}"` : ""}>
      <span class="cal-daynum">${d}</span>${hasEvent && !compact ? `<span class="cal-dot"></span>` : hasEvent ? `<span class="cal-dot-mini"></span>` : ""}
    </div>`;
  }

  return `
    <div class="cal-grid ${compact ? "compact" : ""}">
      <div class="cal-weekdays">${weekdays.map(w => `<div>${w}</div>`).join("")}</div>
      <div class="cal-days">${cells}</div>
    </div>`;
}

function renderMonthView() {
  const el = document.querySelector("[data-cal-body]");
  el.className = "";
  el.innerHTML = renderMonthGrid(CAL_DATE.getFullYear(), CAL_DATE.getMonth(), false);
  el.querySelectorAll(".cal-cell.has-event").forEach(cell => {
    cell.addEventListener("click", () => goToDate(cell.dataset.date));
  });
}

function renderYearView() {
  const el = document.querySelector("[data-cal-body]");
  const year = CAL_DATE.getFullYear();
  const lang = getLang();
  el.className = "cal-year-grid";
  el.innerHTML = Array.from({ length: 12 }, (_, m) => {
    const monthLabel = new Date(year, m, 1).toLocaleDateString(lang === "en" ? "en-US" : "ko-KR", { month: "long" });
    return `
      <div class="cal-mini">
        <div class="cal-mini-title" data-goto-month="${m}">${monthLabel}</div>
        ${renderMonthGrid(year, m, true)}
      </div>`;
  }).join("");

  el.querySelectorAll(".cal-cell.has-event").forEach(cell => {
    cell.addEventListener("click", () => goToDate(cell.dataset.date));
  });
  el.querySelectorAll("[data-goto-month]").forEach(title => {
    title.addEventListener("click", () => {
      CAL_DATE = new Date(year, parseInt(title.dataset.gotoMonth), 1);
      CAL_VIEW = "month";
      syncViewButtons();
      render();
    });
  });
}

function render() {
  renderHeader();
  if (CAL_VIEW === "month") renderMonthView();
  else renderYearView();
}

function syncViewButtons() {
  document.querySelectorAll("[data-cal-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.calView === CAL_VIEW);
  });
}

function initControls() {
  document.querySelector("[data-cal-prev]").addEventListener("click", () => {
    if (CAL_VIEW === "month") CAL_DATE.setMonth(CAL_DATE.getMonth() - 1);
    else CAL_DATE.setFullYear(CAL_DATE.getFullYear() - 1);
    render();
  });
  document.querySelector("[data-cal-next]").addEventListener("click", () => {
    if (CAL_VIEW === "month") CAL_DATE.setMonth(CAL_DATE.getMonth() + 1);
    else CAL_DATE.setFullYear(CAL_DATE.getFullYear() + 1);
    render();
  });
  document.querySelector("[data-cal-today]").addEventListener("click", () => {
    CAL_DATE = new Date();
    render();
  });
  document.querySelectorAll("[data-cal-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      CAL_VIEW = btn.dataset.calView;
      syncViewButtons();
      render();
    });
  });
}

async function renderCalendarPage() {
  const site = await fetchJSON("content/site.json");
  applySiteBasics(site);

  const wrap = document.querySelector("[data-calendar-wrap]");
  if (site && site.calendar_enabled === false) {
    wrap.innerHTML = `<div class="empty-state">${t("calendar_disabled")}</div>`;
    return;
  }

  const data = await fetchJSON("content/banners.json");
  CAL_EVENTS = (data && data.items) ? data.items.filter(e => e.start_date) : [];

  initControls();
  syncViewButtons();
  render();
}

document.addEventListener("DOMContentLoaded", renderCalendarPage);
