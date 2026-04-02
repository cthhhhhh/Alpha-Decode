import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Activity, ArrowLeft, Flag, BookOpen, FileText } from 'lucide-react';

import type { AdminStats, Tab } from './admin/types';
import { authHeaders } from './admin/utils';

import { DashboardTab } from './admin/DashboardTab';
import { UsersTab } from './admin/UsersTab';
import { ReportsTab } from './admin/ReportsTab';
import { ContentTab } from './admin/ContentTab';
import { SubmissionsTab } from './admin/SubmissionsTab';

export default function AdminPanel({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats', { headers: authHeaders() })
      .then(r => { if (!r.ok) throw new Error('Access denied'); return r.json(); })
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse">Loading Admin Dashboard...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center p-8">
      {onBack && <button onClick={onBack} className="self-start mb-6 flex items-center gap-2 px-5 py-2 bg-white rounded-full font-bold text-slate-500 shadow-sm"><ArrowLeft size={18} /> Back</button>}
      <div className="bg-red-50 text-red-500 border border-red-200 rounded-2xl px-5 py-4 font-bold">{error}</div>
    </div>
  );

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <Activity size={16} /> },
    { key: 'users', label: 'Users', icon: <Users size={16} /> },
    { key: 'reports', label: 'Reports', icon: <Flag size={16} /> },
    { key: 'content', label: 'Content', icon: <BookOpen size={16} /> },
    { key: 'submissions', label: 'Submissions', icon: <FileText size={16} /> },
  ];

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="w-full bg-green-500 text-white rounded-3xl py-6 px-4 text-center relative overflow-hidden shadow-lg shadow-green-500/20 mb-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_10%,transparent_80%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <Shield size={32} className="mb-2 drop-shadow-md" />
          <h1 className="text-3xl font-black tracking-tighter uppercase">Alpha Decode <span className="italic text-yellow-300">Admin</span></h1>
          <p className="text-base font-bold opacity-90">{stats?.message}</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl select-none">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          {activeTab === 'dashboard' && <DashboardTab stats={stats} />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'submissions' && <SubmissionsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
