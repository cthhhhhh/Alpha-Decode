import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, Send, AlertCircle } from 'lucide-react';
import type { DraftSummary, DraftDetail } from './types';
import { authHeaders, STATUS_STYLES } from './utils';
import { ConfirmModal } from '../admin/ConfirmModal';

interface Props {
  onEditDraft: (draft: DraftDetail) => void;
}

export function MyDraftsTab({ onEditDraft }: Props) {
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/drafts/my', { headers: authHeaders() })
      .then(r => r.json())
      .then(setDrafts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    await fetch(`/api/drafts/${id}`, { method: 'DELETE', headers: authHeaders() });
    setDrafts(d => d.filter(x => x.id !== id));
  };

  const handleSubmit = async (id: number) => {
    setSubmitting(id);
    try {
      const res = await fetch(`/api/drafts/${id}/submit`, { method: 'POST', headers: authHeaders() });
      if (!res.ok) throw new Error();
      const updated: DraftSummary = await res.json();
      setDrafts(d => d.map(x => x.id === id ? updated : x));
    } finally {
      setSubmitting(null);
    }
  };

  const handleEdit = async (id: number) => {
    const res = await fetch(`/api/drafts/${id}`, { headers: authHeaders() });
    const detail: DraftDetail = await res.json();
    onEditDraft(detail);
  };

  const canEdit   = (d: DraftSummary) => d.status === 'DRAFT' || d.status === 'REJECTED';
  const canSubmit = (d: DraftSummary) => d.status === 'DRAFT' || d.status === 'REJECTED';
  const canDelete = (d: DraftSummary) => d.status === 'DRAFT' || d.status === 'REJECTED';

  if (loading) return <div className="text-center text-slate-400 font-bold py-12 animate-pulse">Loading drafts...</div>;

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">✏️</p>
        <p className="font-black text-lg">No drafts yet</p>
        <p className="text-sm font-bold">Head to Create Draft to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {drafts.map(draft => {
          const style = STATUS_STYLES[draft.status] ?? STATUS_STYLES.DRAFT;
          return (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-4 flex items-center gap-3">
                <span className="text-2xl">{draft.emoji || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 truncate">{draft.title}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    Updated {new Date(draft.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${style.className}`}>
                  {style.label}
                </span>
              </div>

              {draft.status === 'REJECTED' && draft.rejectionNote && (
                <div className="mx-4 mb-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                  <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700 font-bold">{draft.rejectionNote}</p>
                </div>
              )}

              <div className="px-4 pb-3 flex gap-2">
                <button
                  onClick={() => handleEdit(draft.id)}
                  disabled={!canEdit(draft)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleSubmit(draft.id)}
                  disabled={!canSubmit(draft) || submitting === draft.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={12} /> {submitting === draft.id ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(draft.id)}
                  disabled={!canDelete(draft)}
                  className="py-2 px-3 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => { if (confirmDeleteId !== null) handleDelete(confirmDeleteId); }}
        title="Delete Draft"
        message="Are you sure you want to delete this draft? This cannot be undone."
        confirmLabel="Delete"
        type="danger"
      />
    </div>
  );
}
