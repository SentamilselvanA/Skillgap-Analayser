import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, analyses: 0, skills: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Basic frontend check, backend handles the real protection
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchData();
  }, [user, navigate]);

  async function fetchData() {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(userId, currentStatus) {
    try {
      await api.admin.toggleStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !currentStatus } : u))
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse uppercase tracking-[0.2em] font-black"
           style={{ color: "var(--tx-muted)" }}>
        Initializing Command Center...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl p-8 text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
        <h3 className="text-xl font-bold" style={{ color: "#ef4444" }}>Access Denied</h3>
        <p className="mt-2" style={{ color: "var(--tx-secondary)" }}>{error}</p>
        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl">Go Home</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-4">
        <div className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: "var(--tx-accent)" }}>System Overview</div>
        <h2 className="text-4xl font-black tracking-tight">Admin Dashboard</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Total Users" value={stats.users} icon="👤" />
        <StatCard title="Analyses Run" value={stats.analyses} icon="📊" />
        <StatCard title="Skills Tracked" value={stats.skills} icon="⚡" />
      </div>

      {/* User Management */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-sm"
           style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)" }}>
        <div className="p-8 flex justify-between items-center" style={{ borderBottom: "1px solid var(--bd-default)" }}>
          <div>
            <h3 className="text-xl font-bold" style={{ color: "var(--tx-primary)" }}>User Management</h3>
            <p className="text-sm mt-1" style={{ color: "var(--tx-secondary)" }}>Control access and monitor activity.</p>
          </div>
          <button onClick={fetchData}
                  className="p-2.5 rounded-xl transition-all"
                  style={{ border: "1px solid var(--bd-default)", color: "var(--tx-muted)" }}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest"
                  style={{ background: "var(--bg-surface)", color: "var(--tx-muted)" }}>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="transition-colors"
                    style={{ borderTop: "1px solid var(--bd-subtle)" }}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center font-bold"
                           style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", color: "#3b82f6" }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: "var(--tx-primary)" }}>{u.name}</div>
                        <div className="text-xs" style={{ color: "var(--tx-muted)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
                          style={u.role === "admin"
                            ? { background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", color: "#6366f1" }
                            : { background: "var(--bg-surface)", border: "1px solid var(--bd-default)", color: "var(--tx-muted)" }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-rose-500"}`} />
                      <span className="text-xs font-bold" style={{ color: u.is_active ? "#10b981" : "#ef4444" }}>
                        {u.is_active ? "Active" : "Deactivated"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm" style={{ color: "var(--tx-secondary)" }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => toggleStatus(u.id, u.is_active)}
                            disabled={u.id === user.id}
                            className="text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            style={u.is_active
                              ? { border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }
                              : { border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                      {u.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-3xl p-8 shadow-sm transition-all duration-300"
         style={{ background: "var(--bg-card)", border: "1px solid var(--bd-default)" }}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--tx-muted)" }}>{title}</div>
          <div className="text-3xl font-black" style={{ color: "var(--tx-primary)" }}>{value}</div>
        </div>
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl"
             style={{ background: "var(--bg-surface)", border: "1px solid var(--bd-default)" }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
