function listBlock(items) {
  if (!items || !items.length) return `<div class="empty-state">${t("empty_section")}</div>`;
  return `<ul class="career-list">${items.map(i => `<li>${escapeHtml(tf(i, "content"))}</li>`).join("")}</ul>`;
}

function eduBlock(items) {
  if (!items || !items.length) return `<div class="empty-state">${t("empty_section")}</div>`;
  return `<ul class="career-list">${items.map(e => {
    const school = tf(e, "school");
    const note = tf(e, "note");
    return `<li><span>${escapeHtml(school)}${note ? " — " + escapeHtml(note) : ""}</span></li>`;
  }).join("")}</ul>`;
}

function awardBlock(items) {
  if (!items || !items.length) return `<div class="empty-state">${t("empty_section")}</div>`;
  return `<ul class="career-list">${items.map(a => `
    <li><span class="tag">${escapeHtml(a.year || "")}</span><span>${escapeHtml(tf(a, "title"))}</span></li>
  `).join("")}</ul>`;
}

async function renderProfile() {
  const site = await fetchJSON("content/site.json");
  if (site) {
    applySiteBasics(site);
    const photoEl = document.querySelector("[data-photo]");
    if (photoEl && site.profile_photo) photoEl.innerHTML = `<img src="${site.profile_photo}" alt="${escapeHtml(site.name_kr)}">`;
  }

  const profile = await fetchJSON("content/profile.json");
  if (!profile) return;

  const introEl = document.querySelector("[data-intro-long]");
  if (introEl) introEl.textContent = tf(profile, "intro_long");

  const sections = [
    ["education", "sec_education", eduBlock],
    ["current_positions", "sec_current", listBlock],
    ["festival_director", "sec_director", listBlock],
    ["event_direction", "sec_direction", listBlock],
    ["consulting_research", "sec_consulting", listBlock],
    ["school_activities", "sec_school", listBlock],
    ["lectures", "sec_lecture", listBlock],
    ["festival_evaluation", "sec_eval", listBlock],
    ["awards", "sec_awards", awardBlock]
  ];

  const container = document.querySelector("[data-career-sections]");
  if (container) {
    container.innerHTML = sections.map(([key, labelKey, fn]) => {
      const data = profile[key];
      if (!data || !data.length) return "";
      return `<div class="career-block"><h3>${t(labelKey)}</h3>${fn(data)}</div>`;
    }).join("");
  }
}

document.addEventListener("DOMContentLoaded", renderProfile);
