const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("skillgap_token");
}

export function setToken(token) {
  localStorage.setItem("skillgap_token", token);
}

export function clearToken() {
  localStorage.removeItem("skillgap_token");
}

export function isLoggedIn() {
  return !!getToken();
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  auth: {
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
  },

  skills: {
    getAll: () => request("/skills"),
    add: (skill) => request("/skills", { method: "POST", body: JSON.stringify(skill) }),
    addBatch: (skills) => request("/skills/batch", { method: "POST", body: JSON.stringify({ skills }) }),
    delete: (id) => request(`/skills/${id}`, { method: "DELETE" }),
    bulkReplace: (skills) => request("/skills", { method: "PUT", body: JSON.stringify({ skills }) }),
    uploadResume: async (formData) => {
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${BASE_URL}/skills/upload-resume`, { method: "POST", headers, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    },
    parseResumeText: (text) =>
      request("/skills/parse-text", { method: "POST", body: JSON.stringify({ text }) }),
  },

  analysis: {
    // AI-powered role gap analysis + roadmap via Groq
    groqAnalyze: (payload) =>
      request("/analysis/groq-analyze", { method: "POST", body: JSON.stringify(payload) }),
    save: (data) => request("/analysis", { method: "POST", body: JSON.stringify(data) }),
    getHistory: () => request("/analysis"),
    delete: (id) => request(`/analysis/${id}`, { method: "DELETE" }),
  },

  health: () => request("/health"),

  admin: {
    getUsers: () => request("/admin/users"),
    toggleStatus: (id, is_active) =>
      request(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ is_active }) }),
    getStats: () => request("/admin/stats"),
  },
};
