import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, UserCheck, Ban, CheckCircle, RotateCcw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { UserData, UserStats } from './types';
import { authHeaders, ROLE_COLOR } from './utils';
import { ConfirmModal } from './ConfirmModal';
import { RolePickerModal } from './RolePickerModal';

export function UsersTab() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<'id' | 'alpha' | 'level'>('id');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'CONTRIBUTOR' | 'USER'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<Record<number, UserStats>>({});
  const filterRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<{
    title: string; message: string; confirmLabel: string; type: 'danger' | 'info' | 'warning' | 'success'; onConfirm: () => void;
  } | null>(null);
  const [rolePicker, setRolePicker] = useState<UserData | null>(null);
  const currentUser = localStorage.getItem('username');

  const showConfirm = (title: string, message: string, confirmLabel: string, type: 'danger' | 'info' | 'warning' | 'success', onConfirm: () => void) =>
    setModal({ title, message, confirmLabel, type, onConfirm });
  const closeModal = () => setModal(null);

  const fetchUsers = () => {
    fetch('/api/admin/users', { headers: authHeaders() }).then(r => r.json()).then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    const id = setInterval(fetchUsers, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilters(false);
    };
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowFilters(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);

  const toggleExpand = async (id: number) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!userStats[id]) {
      const data = await fetch(`/api/admin/users/${id}/stats`, { headers: authHeaders() }).then(r => r.json());
      setUserStats(prev => ({ ...prev, [id]: data }));
    }
  };

  const handleDelete = (id: number) => {
    showConfirm('Delete User', 'Permanently delete this account and all its data? This cannot be undone.', 'Delete', 'danger', async () => {
      closeModal();
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) setUsers(u => u.filter(x => x.id !== id));
    });
  };

  const openRolePicker = (user: UserData) => setRolePicker(user);

  const handleRoleChange = async (user: UserData, newRole: string) => {
    setRolePicker(null);
    const res = await fetch(`/api/admin/users/${user.id}/role`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ role: newRole }) });
    if (res.ok) setUsers(u => u.map(x => x.id === user.id ? { ...x, role: newRole } : x));
  };

  const handleBanToggle = (user: UserData) => {
    const isBanning = user.enabled;
    showConfirm(
      isBanning ? 'Ban User' : 'Unban User',
      isBanning ? `Ban ${user.username}? They won't be able to log in until unbanned.` : `Restore access for ${user.username}?`,
      isBanning ? 'Ban' : 'Unban',
      isBanning ? 'warning' : 'success',
      async () => {
        closeModal();
        const res = await fetch(`/api/admin/users/${user.id}/${isBanning ? 'ban' : 'unban'}`, { method: 'POST', headers: authHeaders() });
        if (res.ok) setUsers(u => u.map(x => x.id === user.id ? { ...x, enabled: !x.enabled } : x));
      }
    );
  };

  const handleReset = (user: UserData) => {
    showConfirm('Reset Progress', `Clear all coins, level, streak, and lesson progress for ${user.username}? This cannot be undone.`, 'Reset', 'info', async () => {
      closeModal();
      await fetch(`/api/admin/users/${user.id}/reset`, { method: 'POST', headers: authHeaders() });
      fetchUsers();
    });
  };

  const filtered = users
    .filter(u => (u.username.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())) && (roleFilter === 'ALL' || u.role === roleFilter))
    .sort((a, b) => sortMode === 'id' ? a.id - b.id : sortMode === 'alpha' ? a.username.localeCompare(b.username) : b.level - a.level || b.coins - a.coins);

  if (loading) return <div className="text-center p-12 text-slate-400 font-bold animate-pulse">Loading users...</div>;

  return (
    <>
      <AnimatePresence>
        {modal && (
          <ConfirmModal
          isOpen={!!modal}
            title={modal.title}
            message={modal.message}
            confirmLabel={modal.confirmLabel}
            type={modal.type}
            onConfirm={modal.onConfirm}
            onClose={closeModal}
          />
        )}
        {rolePicker && (
          <RolePickerModal
            username={rolePicker.username}
            currentRole={rolePicker.role}
            onConfirm={newRole => handleRoleChange(rolePicker, newRole)}
            onCancel={() => setRolePicker(null)}
          />
        )}
      </AnimatePresence>

      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-t-[22px]">
          <h2 className="text-xl font-black text-slate-800">User Management</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input type="text" placeholder="Search user..." value={query} onChange={e => setQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-brand-primary outline-none w-44 sm:w-56" />
            </div>
            <div ref={filterRef} className="relative">
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-xl border-2 transition-all ${showFilters ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 bg-white text-slate-500'}`}>
                <SlidersHorizontal size={18} />
              </button>
              {showFilters && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-2 w-56 bg-white border-2 border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sort by</p>
                    {(['id', 'alpha', 'level'] as const).map(m => (
                      <button key={m} onClick={() => { setSortMode(m); setShowFilters(false); }} className={`block w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold ${sortMode === m ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                        {m === 'id' ? 'ID' : m === 'alpha' ? 'A–Z' : 'Level / Coins'}
                      </button>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(['ALL', 'ADMIN', 'CONTRIBUTOR', 'USER'] as const).map(r => (
                        <button key={r} onClick={() => { setRoleFilter(r); setShowFilters(false); }} className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border-2 transition-all ${roleFilter === r ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white border-slate-200 text-slate-500'}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <colgroup>
              <col className="w-[35%]" />
              <col className="w-[12%]" />
              <col className="w-[18%]" />
              <col className="w-[12%]" />
              <col className="w-[23%]" />
            </colgroup>
            <thead>
              <tr className="text-xs uppercase tracking-wider font-black text-slate-400 border-b-2 border-slate-100">
                <th className="px-10 py-4 text-left">User</th>
                <th className="px-7 py-4 text-left">Role</th>
                <th className="px-5 py-4 text-left">Level / Coins</th>
                <th className="px-7 py-4 text-left">Status</th>
                <th className="px-7 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <>
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-5">
                      <div className="relative pl-5">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2">
                          <span className={`block w-2.5 h-2.5 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                          {user.isOnline && <span className="absolute inset-0 block w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />}
                        </span>
                        <p className="font-black text-slate-800 text-base">{user.username}</p>
                        <p className="text-sm text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm font-black ${ROLE_COLOR[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-5 py-5 font-bold text-slate-600 text-base">
                      Lvl {user.level} <span className="text-slate-400 font-medium text-sm">({user.coins} Coins)</span>
                    </td>
                    <td className="px-5 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm font-black ${user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.enabled ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openRolePicker(user)} title="Change role"
                          className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition-colors">
                          <UserCheck size={18} />
                        </button>
                        <button onClick={() => handleBanToggle(user)} 
                          disabled={user.username === currentUser}
                          title={user.username === currentUser ? 'You cannot ban yourself' : (user.enabled ? 'Ban' : 'Unban')}
                          className={`p-2 rounded-xl transition-colors ${user.username === currentUser ? 'text-slate-200 cursor-not-allowed' : (user.enabled ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50')}`}>
                          {user.enabled ? <Ban size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button onClick={() => handleReset(user)} title="Reset progress" className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 transition-colors">
                          <RotateCcw size={18} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} disabled={user.role === 'ADMIN' || user.username === currentUser} 
                          title={user.username === currentUser ? 'You cannot delete yourself' : (user.role === 'ADMIN' ? 'Admin users cannot be deleted' : 'Delete user')}
                          className={`p-2 rounded-xl transition-colors ${user.role === 'ADMIN' || user.username === currentUser ? 'text-slate-200 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}>
                          <Trash2 size={18} />
                        </button>
                        <button onClick={() => toggleExpand(user.id)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors">
                          {expandedId === user.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === user.id && (
                    <tr key={`stats-${user.id}`}>
                      <td colSpan={5} className="px-5 pb-4 bg-slate-50">
                        {userStats[user.id] ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                            {[
                              { label: 'Level', val: userStats[user.id].level },
                              { label: 'Coins', val: userStats[user.id].coins },
                              { label: 'Streak', val: `${userStats[user.id].streak} days` },
                              { label: 'Lessons Done', val: userStats[user.id].lessonsCompleted },
                              { label: 'Daily Quizzes', val: userStats[user.id].dailyQuizzesTaken },
                              { label: 'Last Active', val: userStats[user.id].lastActive },
                            ].map(s => (
                              <div key={s.label} className="bg-white rounded-xl p-3 border border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{s.label}</p>
                                <p className="font-black text-slate-800 text-sm mt-0.5">{s.val}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 pt-3 animate-pulse font-bold">Loading stats...</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 font-bold">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
