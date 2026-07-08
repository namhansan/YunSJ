function withinDateRange(popup) {
  const now = new Date();
  if (popup.start_date && now < new Date(popup.start_date)) return false;
  if (popup.end_date && now > new Date(popup.end_date)) return false;
  return true;
}

async function renderPopup() {
  const popup = await fetchJSON("content/popup.json");
  if (!popup || !popup.enabled || !withinDateRange(popup)) return;

  const dismissKey = "popup_dismissed_" + (popup.title || "default");
  const dismissedDate = localStorage.getItem(dismissKey);
  const today = new Date().toDateString();
  if (dismissedDate === today) return;

  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";
  const img = popup.image ? `<img src="${popup.image}" alt="">` : "";
  const link = popup.link
    ? `<a class="btn" href="${popup.link}" target="_blank" rel="noopener">${escapeHtml(tf(popup, "link_text") || t("banner_default_link"))}</a>`
    : "";

  overlay.innerHTML = `
    <div class="popup-box">
      <button class="popup-close" aria-label="close">×</button>
      ${img}
      <div class="popup-body">
        <h3>${escapeHtml(tf(popup, "title"))}</h3>
        <p>${escapeHtml(tf(popup, "content"))}</p>
        ${link}
        <label class="popup-dismiss"><input type="checkbox" id="popup-today"> ${getLang() === "en" ? "Don't show again today" : "오늘 하루 보지 않기"}</label>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector(".popup-close").addEventListener("click", () => {
    if (document.getElementById("popup-today").checked) {
      localStorage.setItem(dismissKey, today);
    }
    overlay.remove();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

document.addEventListener("DOMContentLoaded", renderPopup);
