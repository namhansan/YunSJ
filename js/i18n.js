const LANG_KEY = "site_lang";

const CATEGORY_LABELS = {
  ko: { director: "축제총감독", direction: "행사연출", consulting: "컨설팅·연구", lecture: "강의·교육" },
  en: { director: "Festival Director", direction: "Event Direction", consulting: "Consulting & Research", lecture: "Lecture & Education" }
};

const MEDIA_TYPE_LABELS = {
  ko: { press: "언론보도", interview: "인터뷰", book: "저서", report: "리포트" },
  en: { press: "Press", interview: "Interview", book: "Publications", report: "Report" }
};

const UI_STRINGS = {
  ko: {
    nav_home: "홈", nav_profile: "프로필", nav_projects: "프로젝트", nav_contact: "연락처",
    hero_eyebrow: "축제총감독 · 문화기획가",
    btn_projects: "프로젝트 보기", btn_profile: "프로필 자세히 보기",
    brands_eyebrow: "BUSINESS", brands_title: "사업 브랜드",
    brands_desc: "여러 사업 브랜드를 통해 축제·문화 콘텐츠를 기획하고 있습니다.",
    brand_visit: "바로가기", brand_related: "관련 프로젝트",
    featured_eyebrow: "SELECTED WORKS", featured_title: "대표 프로젝트",
    featured_desc: "축제 총감독, 행사 연출, 컨설팅·연구, 강의 등 다양한 영역에서 진행한 프로젝트를 소개합니다.",
    view_all: "전체 프로젝트 보기 →",
    contact_eyebrow: "CONTACT", contact_title: "문의하기",
    contact_phone: "전화", contact_email: "이메일",
    footer_rights: "All rights reserved.",
    projects_eyebrow: "PROJECTS", projects_title: "전체 프로젝트",
    projects_desc: "카테고리와 브랜드를 선택해서 원하는 프로젝트만 모아볼 수 있습니다.",
    filter_all: "전체", filter_brand_all: "전체 브랜드",
    empty_projects: "진행 중인 프로젝트가 곧 소개될 예정입니다.",
    empty_filtered: "해당 조건에 프로젝트가 아직 없습니다.",
    back_to_list: "← 전체 프로젝트로 돌아가기",
    not_found: "프로젝트를 찾을 수 없습니다.",
    report_link: "📄 관련 보고서 보기",
    profile_eyebrow: "PROFILE", profile_title: "프로필",
    loading: "불러오는 중…",
    banner_default_link: "자세히 보기",
    sec_education: "학력", sec_current: "현직", sec_director: "축제 총감독",
    sec_direction: "행사 연출", sec_consulting: "축제개발 컨설팅 · 연구",
    sec_school: "축제학교", sec_lecture: "대학 · 대학원 강의",
    sec_eval: "축제 평가", sec_awards: "수상 내역", empty_section: "등록된 내용이 없습니다.",
    nav_media: "미디어",
    media_eyebrow: "MEDIA & PUBLICATIONS", media_title: "언론·인터뷰·저서",
    media_desc: "그동안 소개된 언론 보도, 인터뷰, 저서, 연구 리포트를 모아봤습니다.",
    media_view_link: "원문 보기", media_view_file: "PDF 보기",
    empty_media: "곧 자료가 채워질 예정입니다.",
    live_badge: "LIVE", live_watch: "지금 시청하기 →",
    events_eyebrow: "NOW ON", events_title_fallback: "진행중인 행사",
    empty_events: "현재 진행 중인 행사가 없습니다.",
    nav_events: "행사",
    events_page_desc: "현재 진행 중이거나 곧 열리는 행사들을 소개합니다.",
    back_to_events: "← 전체 행사로 돌아가기",
    event_not_found: "행사를 찾을 수 없습니다."
  },
  en: {
    nav_home: "Home", nav_profile: "Profile", nav_projects: "Projects", nav_contact: "Contact",
    hero_eyebrow: "Festival Director · Cultural Planner",
    btn_projects: "View Projects", btn_profile: "View Full Profile",
    brands_eyebrow: "BUSINESS", brands_title: "Business Brands",
    brands_desc: "Planning festivals and cultural content through several business brands.",
    brand_visit: "Visit site", brand_related: "Related projects",
    featured_eyebrow: "SELECTED WORKS", featured_title: "Featured Projects",
    featured_desc: "Selected work across festival direction, event production, consulting & research, and education.",
    view_all: "View all projects →",
    contact_eyebrow: "CONTACT", contact_title: "Contact",
    contact_phone: "Phone", contact_email: "Email",
    footer_rights: "All rights reserved.",
    projects_eyebrow: "PROJECTS", projects_title: "All Projects",
    projects_desc: "Filter by category or brand to find what you're looking for.",
    filter_all: "All", filter_brand_all: "All brands",
    empty_projects: "New projects will be introduced soon.",
    empty_filtered: "No projects match this filter yet.",
    back_to_list: "← Back to all projects",
    not_found: "Project not found.",
    report_link: "📄 View report",
    profile_eyebrow: "PROFILE", profile_title: "Profile",
    loading: "Loading…",
    banner_default_link: "Learn more",
    sec_education: "Education", sec_current: "Current Positions", sec_director: "Festival Direction",
    sec_direction: "Event Direction", sec_consulting: "Consulting & Research",
    sec_school: "Festival Schools", sec_lecture: "University Lectures",
    sec_eval: "Festival Evaluation", sec_awards: "Awards", empty_section: "Nothing added yet.",
    nav_media: "Media",
    media_eyebrow: "MEDIA & PUBLICATIONS", media_title: "Press, Interviews & Publications",
    media_desc: "A collection of press coverage, interviews, publications, and research reports.",
    media_view_link: "View source", media_view_file: "View PDF",
    empty_media: "Content coming soon.",
    live_badge: "LIVE", live_watch: "Watch now →",
    events_eyebrow: "NOW ON", events_title_fallback: "Ongoing Events",
    empty_events: "No ongoing events right now.",
    nav_events: "Events",
    events_page_desc: "Events that are currently underway or coming up soon.",
    back_to_events: "← Back to all events",
    event_not_found: "Event not found."
  }
};

function getLang() {
  return localStorage.getItem(LANG_KEY) === "en" ? "en" : "ko";
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

function t(key) {
  const lang = getLang();
  return (UI_STRINGS[lang] && UI_STRINGS[lang][key]) || UI_STRINGS.ko[key] || key;
}

// bilingual content field fallback: obj.field_en (if lang=en and non-empty) else obj.field
function tf(obj, field) {
  if (!obj) return "";
  const lang = getLang();
  if (lang === "en") {
    const enVal = obj[field + "_en"];
    if (enVal) return enVal;
  }
  return obj[field] || "";
}

function categoryLabel(cat) {
  const lang = getLang();
  return (CATEGORY_LABELS[lang] && CATEGORY_LABELS[lang][cat]) || cat || "";
}

function applyStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.documentElement.lang = getLang();
}

function initLangToggle() {
  const btns = document.querySelectorAll("[data-lang-btn]");
  btns.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.langBtn === getLang());
    btn.addEventListener("click", () => {
      setLang(btn.dataset.langBtn);
      window.location.reload();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyStaticI18n();
  initLangToggle();
});
