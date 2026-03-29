import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { DraftSummary } from './types';
import { authHeaders, STATUS_STYLES } from './utils';
import { ConfirmModal } from '../admin/ConfirmModal';

export function ApprovedTab() {
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch('/api/drafts/my/approved', { headers: authHeaders() })
      .then(r => r.json())
      .then(setDrafts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDismiss = async (id: number) => {
    await fetch(`/api/drafts/${id}`, { method: 'DELETE', headers: authHeaders() });
    setDrafts(d => d.filter(x => x.id !== id));
  };

  if (loading) return <div className="text-center text-slate-400 font-bold py-12 animate-pulse">Loading approved lessons...</div>;

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">🎉</p>
        <p className="font-black text-lg">No approved lessons yet</p>
        <p className="text-sm font-bold">Submit a draft and wait for admin approval!</p>
      </div>
    );
  }

  const deletedDrafts = drafts.filter(d => d.status === 'DELETED');

  return (
    <div className="space-y-3">
      {deletedDrafts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 flex items-start gap-2"
        >
          <AlertTriangle size={15} className="text-zinc-500 mt-0.5 shrink-0" />
          <p className="text-xs text-zinc-600 font-bold">
            {deletedDrafts.length} of your lessons {deletedDrafts.length === 1 ? 'was' : 'were'} removed by an admin. You can dismiss {deletedDrafts.length === 1 ? 'it' : 'them'} using the trash button.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {drafts.map(draft => {
          const style = STATUS_STYLES[draft.status] ?? STATUS_STYLES.APPROVED;
          const isDeleted = draft.status === 'DELETED';
          return (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${isDeleted ? 'border-zinc-200 opacity-70' : 'border-slate-100'}`}
            >
              <div className="p-4 flex items-center gap-3">
                <span className={`text-2xl ${isDeleted ? 'grayscale' : ''}`}>{draft.emoji || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-black truncate ${isDeleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {draft.title}
                  </p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    {isDeleted
                      ? `Removed ${new Date(draft.updatedAt).toLocaleDateString()}`
                      : `Approved ${new Date(draft.updatedAt).toLocaleDateString()}`}
                  </p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${style.className}`}>
                  {style.label}
                </span>
              </div>

              {!isDeleted && (
                <div className="px-4 pb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  <p className="text-xs text-green-700 font-bold">
                    Live and visible to all learners
                    {draft.lessonId ? ` · Lesson #${draft.lessonId}` : ''}
                  </p>
                </div>
              )}

              {isDeleted && (
                <div className="px-4 pb-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-zinc-500 font-bold">This lesson was removed by an admin</p>
                  <button
                    onClick={() => setConfirmDeleteId(draft.id)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-all"
                  >
                    <Trash2 size={12} /> Dismiss
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => { if (confirmDeleteId !== null) handleDismiss(confirmDeleteId); }}
        title="Dismiss Deleted Lesson"
        message="This will permanently remove this entry from your dashboard. You cannot undo this."
        confirmLabel="Dismiss"
        type="danger"
      />
    </div>
  );
}
