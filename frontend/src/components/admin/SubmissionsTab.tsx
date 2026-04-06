import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronDown, ChevronUp, Check, X, AlertCircle, CheckCircle, Trash2, RefreshCcw } from 'lucide-react';
import type { Draft } from '../contributor/types';
import { authHeaders } from './utils';
import { ConfirmModal } from './ConfirmModal';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  INTRO:     { label: 'Intro',     color: 'bg-blue-100 text-blue-700' },
  SELECT:    { label: 'Select',    color: 'bg-purple-100 text-purple-700' },
  TRANSLATE: { label: 'Translate', color: 'bg-orange-100 text-orange-700' },
};

type RecentEntry = { id: number; title: string; contributorUsername: string; emoji: string; action: 'approved' | 'rejected' };

const LS_KEY = 'admin_recently_resolved';
function loadRecent(): RecentEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveRecent(entries: RecentEntry[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(entries));
}

export function SubmissionsTab() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [recentlyResolved, setRecentlyResolved] = useState<RecentEntry[]>(loadRecent);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info' | 'warning' | 'success';
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmLabel: 'Confirm',
    onConfirm: () => { }
  });

  const pushRecent = (entry: RecentEntry) => {
    setRecentlyResolved(prev => {
      const next = [entry, ...prev].slice(0, 10);
      saveRecent(next);
      return next;
    });
  };

  const fetchDrafts = () => {
    setLoading(true);
    fetch('/api/drafts/pending', { headers: authHeaders() })
      .then(r => r.json())
      .then(setDrafts)
      .catch(() => setDrafts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrafts(); }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/drafts/${id}/approve`, { method: 'POST', headers: authHeaders() });
      if (!res.ok) throw new Error(await res.text());
      const draft = drafts.find(d => d.id === id);
      if (draft) {
        pushRecent({ id, title: draft.title, contributorUsername: draft.contributorUsername, emoji: draft.emoji, action: 'approved' as const });
      }
      setDrafts(prev => prev.filter(d => d.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectReason.trim()) { setError('Please enter a rejection reason.'); return; }
    setActionLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/drafts/${id}/reject`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ rejectionReason: rejectReason }),
      });
      if (!res.ok) throw new Error(await res.text());
      const draft = drafts.find(d => d.id === id);
      if (draft) {
        pushRecent({ id, title: draft.title, contributorUsername: draft.contributorUsername, emoji: draft.emoji, action: 'rejected' as const });
      }
      setDrafts(prev => prev.filter(d => d.id !== id));
      setRejectingId(null);
      setRejectReason('');
      if (expandedId === id) setExpandedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const removeRecent = (id: number) => setRecentlyResolved(prev => { const next = prev.filter(r => r.id !== id); saveRecent(next); return next; });
  const clearRecent = () => { setRecentlyResolved([]); localStorage.removeItem(LS_KEY); };

  const handleApproveClick = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Approve Submission?',
      message: 'Are you sure you want to approve this submission? It will become a live lesson immediately.',
      type: 'success',
      confirmLabel: 'Approve',
      onConfirm: () => handleApprove(id),
    });
  };

  const handleClearRecentClick = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear History?',
      message: 'Are you sure you want to clear your recently resolved history? This action cannot be undone.',
      type: 'danger',
      confirmLabel: 'Clear All',
      onConfirm: clearRecent,
    });
  };

  const handleRemoveRecentClick = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove from History?',
      message: 'Are you sure you want to permanently remove this item from your resolved history?',
      type: 'danger',
      confirmLabel: 'Remove',
      onConfirm: () => removeRecent(id),
    });
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400 font-bold animate-pulse">Loading submissions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><FileText className="text-blue-500" size={20} /> Pending ({drafts.length})</h2>
        <button onClick={fetchDrafts} className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-full"><RefreshCcw size={18} /></button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-500 border border-red-200 rounded-2xl px-4 py-3 text-sm font-bold">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="bg-green-50 rounded-2xl p-10 text-center border-2 border-green-100">
          <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-green-700">All clear!</h3>
          <p className="text-green-600/80 font-bold text-sm">No pending submissions.</p>
        </div>
      ) : (
        <>
          <p className="text-sm font-black text-slate-500 uppercase tracking-wide">{drafts.length} Pending Submission{drafts.length !== 1 ? 's' : ''}</p>
          {drafts.map(draft => {
            let questions: Record<string, unknown>[] = [];
            try { questions = JSON.parse(draft.questionsJson); } catch { /* empty */ }
            const isExpanded = expandedId === draft.id;
            const isRejecting = rejectingId === draft.id;

            return (
              <div key={draft.id} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-3xl shrink-0">{draft.emoji || '📄'}</span>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-800 truncate text-lg">{draft.title}</h3>
                        <p className="text-xs font-bold text-slate-400 mb-2">by {draft.contributorUsername}</p>
                        <p className="text-sm text-slate-500 font-semibold line-clamp-2">{draft.story}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: draft.colour }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <FileText size={12} /> {questions.length} question{questions.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        {new Date(draft.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : draft.id)}
                      className="flex items-center gap-1 text-xs font-black text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? 'Hide' : 'Preview'}
                    </button>
                  </div>
                </div>

                {/* Expandable preview */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-100 bg-slate-50 px-5 py-4"
                    >
                      {questions.length === 0 ? (
                        <p className="text-xs text-slate-400 font-bold italic">No questions in this draft.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">Questions</p>
                          {questions.map((q, i) => {
                            const qType = (q.question_type as string) ?? 'INTRO';
                            const cfg = TYPE_LABELS[qType] ?? { label: qType, color: 'bg-slate-100 text-slate-600' };
                            return (
                              <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-slate-200">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${cfg.color}`}>
                                  {cfg.label}
                                </span>
                                <span className="text-sm font-bold text-slate-700 truncate">{(q.title as string) || '(no title)'}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="px-5 pb-5">
                  {isRejecting ? (
                    <div className="space-y-3">
                      <textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason for the contributor..."
                        rows={3}
                        className="w-full border-2 border-red-200 rounded-xl px-4 py-3 text-sm font-bold focus:border-red-400 outline-none resize-none bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(draft.id)}
                          disabled={actionLoading === draft.id}
                          className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-black text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <X size={14} /> {actionLoading === draft.id ? 'Rejecting...' : 'Confirm Reject'}
                        </button>
                        <button
                          onClick={() => { setRejectingId(null); setRejectReason(''); setError(''); }}
                          className="px-4 py-2.5 bg-slate-200 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApproveClick(draft.id)}
                        disabled={actionLoading === draft.id}
                        className="flex-1 py-3 bg-green-500 text-white rounded-xl font-black text-sm shadow-[0_4px_0_#16a34a] hover:shadow-[0_6px_12px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={16} /> {actionLoading === draft.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => { setRejectingId(draft.id); setError(''); }}
                        disabled={actionLoading === draft.id}
                        className="flex-1 py-3 bg-red-50 text-red-500 border-2 border-red-200 rounded-xl font-black text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Recently Resolved */}
      {recentlyResolved.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recently Resolved</h3>
            <button
              onClick={handleClearRecentClick}
              className="flex items-center gap-1.5 text-[10px] font-black text-red-400 hover:text-red-500 transition-colors uppercase tracking-wider bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-100"
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
          <div className="space-y-2">
            {recentlyResolved.map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 opacity-60 hover:opacity-100 transition-opacity group"
              >
                <span className="text-sm font-bold text-slate-500">
                  {r.emoji} {r.title} · <span className="text-slate-400">by {r.contributorUsername}</span>
                </span>
                <div className="flex items-center gap-3">
                  {r.action === 'approved' ? (
                    <span className="text-xs font-black text-green-500 flex items-center gap-1.5">
                      <CheckCircle size={14} /> Approved
                    </span>
                  ) : (
                    <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                      <X size={14} /> Rejected
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveRecentClick(r.id)}
                    className="p-1.5 text-red-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                    title="Remove from history"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmModal
        {...confirmConfig}
        onClose={() => setConfirmConfig(c => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}
