import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Activity, ArrowLeft, Trash2, ArrowUpCircle, ArrowDownCircle, Search, SlidersHorizontal } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  systemHealth: string;
  message: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  level: number;
  xp: number;
}

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<'id' | 'alpha' | 'level'>('id');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers })
      ]);
      
      if (!statsRes.ok || !usersRes.ok) {
        throw new Error('Access denied or server error');
      }
      
      const [statsData, usersData] = await Promise.all([
        statsRes.json(),
        usersRes.json()
      ]);
      
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        fetchData(); // Refresh stats
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (id: number, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        throw new Error('Failed to change role');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(query.toLowerCase()) || 
                          u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortMode === 'id') return a.id - b.id;
    if (sortMode === 'alpha') return a.username.localeCompare(b.username);
    if (sortMode === 'level') return b.level - a.level || b.xp - a.xp;
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center font-bold text-slate-500 animate-pulse">Loading Admin Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-8">
        <button onClick={onBack} className="self-start mb-6 flex items-center gap-2 px-5 py-2 bg-white rounded-full font-bold text-slate-500 shadow-sm">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="bg-red-50 text-red-500 border border-red-200 rounded-2xl px-5 py-4 font-bold text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      
      {/* Top Banner */}
      <div className="w-full bg-brand-primary text-white border-b-4 border-[#46a302] py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_10%,transparent_80%)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Shield size={48} className="mb-4 opacity-90 drop-shadow-md" />
          <h1 className="text-4xl font-black tracking-tighter uppercase drop-shadow-sm mb-2">
            Alpha Decode <span className="italic text-brand-yellow">Admin</span>
          </h1>
          <p className="text-xl font-bold opacity-90">{stats?.message || "Welcome to the Admin Dashboard!"}</p>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </motion.button>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div whileHover={{ y: -5 }} className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-1">Standard Users</h3>
                <p className="text-5xl font-black text-slate-800">{stats.totalUsers}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
                <Users size={32} />
              </div>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-1">Active Sessions</h3>
                <p className="text-5xl font-black text-slate-800">{stats.activeSessions}</p>
                <p className="text-xs font-bold text-green-500 mt-1">Live Tracking</p>
              </div>
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center relative">
                <Activity size={32} />
                <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
              </div>
            </motion.div>
          </div>
        )}

        <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-sm mb-8 relative">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-[22px]">
            <h2 className="text-xl font-black text-slate-800">User Management</h2>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-brand-primary outline-none transition-all w-48 sm:w-64"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-xl border-2 transition-all ${showFilters ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}
                >
                  <SlidersHorizontal size={20} />
                </button>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-64 bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Arrange By</p>
                      <div className="flex flex-col gap-1">
                        {(['id', 'alpha', 'level'] as const).map(mode => (
                          <button
                            key={mode}
                            onClick={() => { setSortMode(mode); setShowFilters(false); }}
                            className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${sortMode === mode ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {mode === 'id' ? 'ID (Number)' : mode === 'alpha' ? 'A–Z (Username)' : 'Level / XP'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Filter By Role</p>
                      <div className="flex flex-wrap gap-2">
                        {(['ALL', 'ADMIN', 'USER'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => { setRoleFilter(role); setShowFilters(false); }}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border-2 transition-all ${roleFilter === role ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-b-[22px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider font-black text-slate-400">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Level (XP)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-500">#{user.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{user.username}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      Lvl {user.level} <span className="text-xs text-slate-400 font-medium">({user.xp} XP)</span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleRoleChange(user.id, user.role)}
                        title={user.role === 'ADMIN' ? "Revert to User" : "Elevate to Admin"}
                        className={`p-2 rounded-xl transition-colors ${
                          user.role === 'ADMIN' ? 'text-amber-500 hover:bg-amber-50' : 'text-purple-500 hover:bg-purple-50'
                        }`}
                      >
                        {user.role === 'ADMIN' ? <ArrowDownCircle size={18} /> : <ArrowUpCircle size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.role === 'ADMIN'}
                        title={user.role === 'ADMIN' ? "Cannot delete an Admin directly" : "Delete User"}
                        className={`p-2 rounded-xl transition-colors ${
                          user.role === 'ADMIN' ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
