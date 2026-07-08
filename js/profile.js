function listBlock(items) {
  if (!items || !items.length) return `<div class="empty-state">등록된 내용이 없습니다.</div>`;
  return `<ul class="career-list">${items.map(i => `<li>${escapeHtml(typeof i === "string" ? i : i.title || "")}</li>`).join("")}</ul>`;
}

function eduBlock(items) {
  if (!items || !items.length) return "";
  return `<ul class="career-list">${items.map(e => `
    <li><span>${escapeHtml(e.school || "")}${e.note ? " — " + escapeHtml(e.note) : ""}</span></li>
  `).join("")}</ul>`;
}

function awardBlock(items) {
  if (!items || !items.length) return "";
  return `<ul class="career-list">${items.map(a => `
    <li><span class="tag">${escapeHtml(a.year || "")}</span><span>${escapeHtml(a.title || "")}</span></li>
  `).join("")}</ul>`;
}

async function renderProfile() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    document.querySelectorAll("[data-name]").forEach(el => el.textContent = site.name_kr || "");
    document.querySelectorAll("[data-nickname]").forEach(el => el.textContent = site.nickname ? `(${site.nickname})` : "");
    const photoEl = document.querySelector("[data-photo]");
    if (photoEl && site.profile_photo) photoEl.innerHTML = `<img src="${site.profile_photo}" alt="${escapeHtml(site.name_kr)}">`;
  }

  const profile = await fetchJSON("content/profile.json");
  if (!profile) return;

  const introEl = document.querySelector("[data-intro-long]");
  if (introEl) introEl.textContent = profile.intro_long || "";

  const sections = [
    ["education", "학력", eduBlock],
    ["current_positions", "현직", listBlock],
    ["festival_director", "축제 총감독", listBlock],
    ["event_direction", "행사 연출", listBlock],
    ["consulting_research", "축제개발 컨설팅 · 연구", listBlock],
    ["school_activities", "축제학교", listBlock],
    ["lectures", "대학·대학원 강의", listBlock],
    ["festival_evaluation", "축제 평가", listBlock],
    ["awards", "수상 내역", awardBlock]
  ];

  const container = document.querySelector("[data-career-sections]");
  if (container) {
    container.innerHTML = sections.map(([key, label, fn]) => {
      const data = profile[key];
      if (!data || !data.length) return "";
      return `<div class="career-block"><h3>${label}</h3>${fn(data)}</div>`;
    }).join("");
  }
}

document.addEventListener("DOMContentLoaded", renderProfile);
