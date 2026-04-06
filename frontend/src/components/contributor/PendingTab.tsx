import { useState } from 'react';
import { Clock, FileText, X } from 'lucide-react';
import type { Draft } from './types';
import { authHeaders } from '../admin/utils';

interface PendingTabProps {
  drafts: Draft[];
  onDraftsChange: () => void;
}

export function PendingTab({ drafts, onDraftsChange }: PendingTabProps) {
  const pending = drafts.filter(d => d.status === 'PENDING');
  const [deleting, setDeleting] = useState<number | null>(null);

  const dismiss = async (id: number) => {
    setDeleting(id);
    try {
      await fetch(`/api/drafts/${id}`, { method: 'DELETE', headers: authHeaders() });
      onDraftsChange();
    } finally {
      setDeleting(null);
    }
  };

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <Clock size={28} className="text-amber-500" />
        </div>
        <h3 className="font-black text-slate-700 text-lg mb-1">No Pending Submissions</h3>
        <p className="text-slate-400 font-bold text-sm">Submit a draft from the Create tab to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-black text-slate-500 uppercase tracking-wide">{pending.length} Pending</p>
      {pending.map(draft => {
        let questionCount = 0;
        try { questionCount = JSON.parse(draft.questionsJson).length; } catch { /* empty */ }
        return (
          <div key={draft.id} className="bg-white rounded-2xl border-2 border-amber-100 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-3xl shrink-0">{draft.emoji || '📄'}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-black text-slate-800 truncate">{draft.title}</h3>
                    <span className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide flex items-center gap-1">
                      <Clock size={9} /> Awaiting Review
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-semibold line-clamp-2">{draft.story}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm shrink-0 mt-1"
                  style={{ background: draft.colour }}
                />
                <button
                  onClick={() => dismiss(draft.id)}
                  disabled={deleting === draft.id}
                  title="Recall / Delete Draft"
                  className="p-1 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <FileText size={12} /> {questionCount} question{questionCount !== 1 ? 's' : ''}
              </span>
              <span className="text-xs font-bold text-slate-300">
                Submitted {new Date(draft.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
