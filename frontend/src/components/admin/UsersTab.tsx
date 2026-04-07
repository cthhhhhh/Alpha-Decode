import { Ban, BookOpen, CheckCircle, ChevronDown, ChevronUp, Clock, Coins, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Trash2, Trophy, UserCheck, Zap, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { RolePickerModal } from './RolePickerModal';
import type { UserData, UserStats } from './types';
import { authHeaders, ROLE_COLOR } from './utils';

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
  const [deleteError, setDeleteError] = useState('');
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
    setDeleteError('');
    showConfirm('Delete User', 'Permanently delete this account and all its data? This cannot be undone.', 'Delete', 'danger', async () => {
      closeModal();
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
        if (res.ok) {
          setUsers(u => u.filter(x => x.id !== id));
        } else {
          const msg = await res.text();
          setDeleteError(msg || `Failed to delete user (status ${res.status})`);
        }
      } catch {
        setDeleteError('Network error — could not delete user.');
      }
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
        if (res.ok) setUsers(u => u.map(x => x.id === user.id ? { ...x, enabled: !x.enabled, pendingApproval: false } : x));
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
      {deleteError && (
        <div className="mb-4 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-3 text-sm font-bold">
          <span>⚠️ {deleteError}</span>
          <button onClick={() => setDeleteError('')} className="text-red-400 hover:text-red-600 font-black text-lg leading-none">×</button>
        </div>
      )}
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

        <div>
          <table className="w-full text-left table-fixed">
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
              <col className="w-[13%]" />
              <col className="w-[29%]" />
            </colgroup>
            <thead>
              <tr className="text-xs uppercase tracking-wider font-black text-slate-400 border-b-2 border-slate-100">
                <th className="px-5 pl-10 py-5 text-left">User</th>
                <th className="px-4 pl-5 text-left">Role</th>
                <th className="px-4 pl-5 text-left">Statistics</th>
                <th className="px-4 pl-5 text-left">Status</th>
                <th className="px-4 pl-35 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <Fragment key={user.id}>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-5">
                      <div className="relative pl-5">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2">
                          <span className={`block w-2.5 h-2.5 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                          {user.isOnline && <span className="absolute inset-0 block w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />}
                        </span>
                        <p className="font-black text-slate-800 text-base truncate">{user.username}</p>
                        <p className="text-sm text-slate-400 font-medium truncate">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className={`px-3 py-1 rounded-full text-sm font-black ${ROLE_COLOR[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
                            <Trophy size={13} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Rank</p>
                            <p className="text-sm font-black text-slate-800">Lvl {user.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-200">
                            <Coins size={13} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Coins</p>
                            <p className="text-sm font-black text-slate-800">{user.coins.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      {user.pendingApproval ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider bg-amber-50/50 border-amber-100 text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="flex flex-col leading-tight"><span>Pending</span><span>Approval</span></span>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider whitespace-nowrap ${user.enabled ? 'bg-green-50/50 border-green-100 text-green-600' : 'bg-red-50/50 border-red-100 text-red-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                          {user.enabled ? 'Verified' : 'Banned'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openRolePicker(user)} title="Change role"
                          className="p-2.5 rounded-xl text-indigo-500 bg-indigo-50/30 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all active:scale-95 shadow-sm">
                          <UserCheck size={18} />
                        </button>
                        {user.pendingApproval && (
                          <div className="flex gap-1.5 items-center">
                              <button
                                onClick={() => showConfirm('Approve Contributor', `Approve ${user.username} as a contributor?`, 'Approve', 'success', async () => {
                                  closeModal();
                                  const res = await fetch(`/api/admin/users/${user.id}/approve-contributor`, { method: 'POST', headers: authHeaders() });
                                  if (res.ok) setUsers(u => u.map(x => x.id === user.id ? { ...x, role: 'CONTRIBUTOR', enabled: true, pendingApproval: false } : x));
                                })}
                                title="Approve contributor"
                                className="p-2 rounded-xl text-blue-500 bg-blue-50/30 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all active:scale-95 shadow-sm"
                              >
                                <ShieldCheck size={17} />
                              </button>
                              <button
                                onClick={() => showConfirm('Reject Request', `Reject ${user.username}'s request?`, 'Reject', 'danger', async () => {
                                  closeModal();
                                  const res = await fetch(`/api/admin/users/${user.id}/reject-contributor`, { method: 'POST', headers: authHeaders() });
                                  if (res.ok) setUsers(u => u.map(x => x.id === user.id ? { ...x, pendingApproval: false } : x));
                                })}
                                title="Reject request"
                                className="p-2 rounded-xl text-red-500 bg-red-50/30 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all active:scale-95 shadow-sm"
                              >
                                <X size={17} />
                              </button>
                          </div>
                        )}
                        {!user.pendingApproval && (
                          <button onClick={() => handleBanToggle(user)} title={user.enabled ? "Ban user" : "Unban user"}
                            disabled={user.username === currentUser}
                            className={`p-2 rounded-xl border border-transparent transition-all active:scale-95 shadow-sm ${user.username === currentUser ? 'text-slate-200' : (user.enabled ? 'text-orange-500 bg-orange-50/30 hover:bg-orange-50 hover:border-orange-100' : 'text-green-600 bg-green-50/30 hover:bg-green-50 hover:border-green-100')}`}>
                            {user.enabled ? <Ban size={17} /> : <CheckCircle size={17} />}
                          </button>
                        )}
                        <button onClick={() => handleReset(user)} title="Reset progress"
                          className="p-2 rounded-xl text-blue-500 bg-blue-50/30 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all active:scale-95 shadow-sm">
                          <RotateCcw size={17} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} title="Delete user" disabled={user.role === 'ADMIN' || user.username === currentUser}
                          className={`p-2 rounded-xl border border-transparent transition-all active:scale-95 shadow-sm ${user.role === 'ADMIN' || user.username === currentUser ? 'text-slate-200' : 'text-red-500 bg-red-50/30 hover:bg-red-50 hover:border-red-100'}`}>
                          <Trash2 size={17} />
                        </button>
                        <button onClick={() => toggleExpand(user.id)}
                          className={`p-2 rounded-xl transition-all shadow-sm ${expandedId === user.id ? 'bg-slate-200 text-slate-800' : 'text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600'}`}>
                          {expandedId === user.id ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === user.id && (
                    <tr key={`stats-${user.id}`}>
                      <td colSpan={5} className="px-5 pb-4 bg-slate-50">
                        {userStats[user.id] ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                            {[
                              { label: 'Level', val: userStats[user.id].level, icon: <Trophy size={14} />, color: 'text-brand-primary bg-brand-primary/10' },
                              { label: 'Coins', val: userStats[user.id].coins.toLocaleString(), icon: <Coins size={14} />, color: 'text-amber-600 bg-amber-50' },
                              { label: 'Streak', val: `${userStats[user.id].streak} days`, icon: <Zap size={14} />, color: 'text-orange-500 bg-orange-50' },
                              { label: 'Lessons', val: userStats[user.id].lessonsCompleted, icon: <BookOpen size={14} />, color: 'text-indigo-600 bg-indigo-50' },
                              { label: 'Quizzes', val: userStats[user.id].dailyQuizzesTaken, icon: <CheckCircle size={14} />, color: 'text-green-600 bg-green-50' },
                              { label: 'Active', val: userStats[user.id].lastActive, icon: <Clock size={14} />, color: 'text-slate-600 bg-slate-100' },
                            ].map(s => (
                              <div key={s.label} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.color}`}>
                                  {s.icon}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                                  <p className="font-black text-slate-800 text-sm">{s.val}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 pt-3 animate-pulse font-bold">Loading stats...</p>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
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
