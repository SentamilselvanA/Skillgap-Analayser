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

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
  },

  // ─── Skills ───────────────────────────────────────────────────
  skills: {
    getAll: () => request("/skills"),
    add: (skill) => request("/skills", { method: "POST", body: JSON.stringify(skill) }),
    delete: (id) => request(`/skills/${id}`, { method: "DELETE" }),
    bulkReplace: (skills) => request("/skills", { method: "PUT", body: JSON.stringify({ skills }) }),
  },

  // ─── Analysis ─────────────────────────────────────────────────
  analysis: {
    save: (data) => request("/analysis", { method: "POST", body: JSON.stringify(data) }),
    getHistory: () => request("/analysis"),
    delete: (id) => request(`/analysis/${id}`, { method: "DELETE" }),
  },

  // ─── Health ───────────────────────────────────────────────────
  health: () => request("/health"),

  // ─── Admin ────────────────────────────────────────────────────
  admin: {
    getUsers: () => request("/admin/users"),
    toggleStatus: (id, is_active) => 
      request(`/admin/users/${id}/status`, { 
        method: "PATCH", 
        body: JSON.stringify({ is_active }) 
      }),
    getStats: () => request("/admin/stats"),
  },
};

