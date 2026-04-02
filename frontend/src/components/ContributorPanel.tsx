import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenSquare, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

import type { ContribTab, Draft } from './contributor/types';
import { authHeaders } from './admin/utils';

import { CreateDraftTab } from './contributor/CreateDraftTab';
import { PendingTab } from './contributor/PendingTab';
import { ApprovedTab } from './contributor/ApprovedTab';
import { RejectedTab } from './contributor/RejectedTab';

export default function ContributorPanel({ onBack: _onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<ContribTab>('create');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = useCallback(() => {
    setLoading(true);
    fetch('/api/drafts/mine', { headers: authHeaders() })
      .then(r => r.json())
      .then(setDrafts)
      .catch(() => setDrafts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDrafts(); }, [fetchDrafts]);

  const pendingCount = drafts.filter(d => d.status === 'PENDING').length;
  const approvedCount = drafts.filter(d => d.status === 'APPROVED').length;
  const rejectedCount = drafts.filter(d => d.status === 'REJECTED' || d.status === 'DELETED').length;

  const TABS: { key: ContribTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'create', label: 'Create', icon: <Plus size={16} /> },
    { key: 'pending', label: 'Pending', icon: <Clock size={16} />, count: pendingCount },
    { key: 'approved', label: 'Approved', icon: <CheckCircle size={16} />, count: approvedCount },
    { key: 'rejected', label: 'Rejected / Deleted', icon: <XCircle size={16} />, count: rejectedCount },
  ];

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="w-full bg-blue-500 text-white rounded-3xl py-6 px-4 text-center relative overflow-hidden shadow-lg shadow-blue-500/20 mb-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_10%,transparent_80%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <PenSquare size={32} className="mb-2 drop-shadow-md" />
          <h1 className="text-3xl font-black tracking-tighter uppercase">Contributor <span className="italic text-yellow-300">Dashboard</span></h1>
          <p className="text-base font-bold opacity-90">Create and submit lesson content for review</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl select-none">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all relative ${activeTab === t.key ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            {t.count !== undefined && t.count > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white ${
                t.key === 'pending' ? 'bg-amber-500' : t.key === 'approved' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 font-bold animate-pulse">Loading...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
            {activeTab === 'create' && <CreateDraftTab drafts={drafts} onDraftsChange={fetchDrafts} />}
            {activeTab === 'pending' && <PendingTab drafts={drafts} />}
            {activeTab === 'approved' && <ApprovedTab drafts={drafts} />}
            {activeTab === 'rejected' && <RejectedTab drafts={drafts} onDraftsChange={fetchDrafts} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
