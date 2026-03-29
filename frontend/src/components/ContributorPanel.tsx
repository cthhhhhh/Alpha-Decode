import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, FileText, Activity, PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { ContributorTab, DraftDetail } from './contributor/types';
import { ContributorDashboardTab } from './contributor/ContributorDashboardTab';
import { MyDraftsTab } from './contributor/MyDraftsTab';
import { ApprovedTab } from './contributor/ApprovedTab';
import { CreateDraftTab } from './contributor/CreateDraftTab';

export default function ContributorPanel({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<ContributorTab>('dashboard');
  const [editingDraft, setEditingDraft] = useState<DraftDetail | null>(null);

  const TABS: { key: ContributorTab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard',  label: 'Dashboard',   icon: <Activity size={16} /> },
    { key: 'my-drafts',  label: 'My Drafts',   icon: <FileText size={16} /> },
    { key: 'approved',   label: 'Approved',    icon: <CheckCircle2 size={16} /> },
    { key: 'create',     label: 'Create Draft', icon: <PlusCircle size={16} /> },
  ];

  const handleEditDraft = (draft: DraftDetail) => {
    setEditingDraft(draft);
    setActiveTab('create');
  };

  const handleSaved = () => {
    // keep editing draft in place so user can see updates
  };

  const handleTabChange = (tab: ContributorTab) => {
    if (tab !== 'create') setEditingDraft(null);
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="w-full bg-blue-500 text-white rounded-3xl py-6 px-4 text-center relative overflow-hidden shadow-lg shadow-blue-500/20 mb-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_10%,transparent_80%)]" />
        <div className="relative z-10 flex flex-col items-center">
          {onBack && (
            <button onClick={onBack}
              className="absolute left-0 top-0 flex items-center gap-1.5 px-4 py-2 text-white/80 hover:text-white font-bold text-sm">
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <Pencil size={32} className="mb-2 drop-shadow-md" />
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Alpha Decode <span className="italic text-yellow-300">Contributor</span>
          </h1>
          <p className="text-base font-bold opacity-90">Create lessons for the community</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl select-none">
        {TABS.map(t => (
          <button key={t.key} onClick={() => handleTabChange(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === t.key ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
          {activeTab === 'dashboard' && <ContributorDashboardTab />}
          {activeTab === 'my-drafts' && <MyDraftsTab onEditDraft={handleEditDraft} />}
          {activeTab === 'approved' && <ApprovedTab />}
          {activeTab === 'create' && (
            <CreateDraftTab editingDraft={editingDraft} onSaved={handleSaved} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
