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
      <div className="flex items-center justify-center py-20 text-slate-400 animate-pulse uppercase tracking-[0.2em] font-black">
        Initializing Command Center...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-600">
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="mt-2">{error}</p>
        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl">Go Home</button>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-4">
        <div className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">System Overview</div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard title="Total Users" value={stats.users} icon="👤" />
        <StatCard title="Analyses Run" value={stats.analyses} icon="📊" />
        <StatCard title="Skills Tracked" value={stats.skills} icon="⚡" />
      </div>

      {/* User Management */}
      <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Control access and monitor activity.</p>
          </div>
          <button onClick={fetchData} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
             <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {users.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/10 flex items-center justify-center text-blue-600 font-bold">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${
                      u.role === 'admin' 
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-900' 
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:bg-slate-900 dark:border-slate-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className={`text-xs font-bold ${u.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => toggleStatus(u.id, u.is_active)}
                      disabled={u.id === user.id}
                      className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                        u.is_active
                          ? 'border-rose-100 text-rose-600 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/20'
                          : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-950/20'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
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
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm hover:border-blue-500/30 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{value}</div>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
