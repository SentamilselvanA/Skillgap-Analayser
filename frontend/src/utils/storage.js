const KEY = "skillgap_user_skills_v1";

export function loadSkills() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSkills(skills) {
  localStorage.setItem(KEY, JSON.stringify(skills));
}
