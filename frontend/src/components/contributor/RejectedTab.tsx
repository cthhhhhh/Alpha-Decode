import { useState } from 'react';
import { XCircle, Trash2, AlertCircle, FileText, RotateCcw } from 'lucide-react';
import { authHeaders } from '../admin/utils';
import type { Draft } from './types';

interface RejectedTabProps {
  drafts: Draft[];
  onDraftsChange: () => void;
}

export function RejectedTab({ drafts, onDraftsChange }: RejectedTabProps) {
  const rejected = drafts.filter(d => d.status === 'REJECTED' || d.status === 'DELETED');
  const [revising, setRevising] = useState<number | null>(null);

  const handleRevise = async (draft: Draft) => {
    setRevising(draft.id);
    try {
      const body = {
        title: draft.title,
        story: draft.story,
        emoji: draft.emoji,
        colour: draft.colour,
        questionsJson: draft.questionsJson,
      };
      await fetch('/api/drafts', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
      onDraftsChange();
    } finally {
      setRevising(null);
    }
  };

  if (rejected.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <XCircle size={28} className="text-slate-400" />
        </div>
        <h3 className="font-black text-slate-700 text-lg mb-1">Nothing Here</h3>
        <p className="text-slate-400 font-bold text-sm">Rejected or removed content will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-black text-slate-500 uppercase tracking-wide">{rejected.length} Rejected / Deleted</p>
      {rejected.map(draft => {
        let questionCount = 0;
        try { questionCount = JSON.parse(draft.questionsJson).length; } catch { /* empty */ }
        const isDeleted = draft.status === 'DELETED';
        return (
          <div key={draft.id} className={`bg-white rounded-2xl border-2 p-5 ${isDeleted ? 'border-slate-200' : 'border-red-100'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-3xl shrink-0">{draft.emoji || '📄'}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-black text-slate-800 truncate">{draft.title}</h3>
                    {isDeleted ? (
                      <span className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide flex items-center gap-1">
                        <Trash2 size={9} /> Deleted
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-100 text-red-600 uppercase tracking-wide flex items-center gap-1">
                        <XCircle size={9} /> Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-semibold line-clamp-2">{draft.story}</p>
                </div>
              </div>
              <div
                className="w-5 h-5 rounded-full shrink-0 mt-1 border-2 border-white shadow-sm"
                style={{ background: draft.colour }}
              />
            </div>

            {/* Reason block */}
            {isDeleted ? (
              <div className="mt-4 flex items-start gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                <AlertCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-slate-500">The lesson created from this draft was removed by an admin.</p>
              </div>
            ) : draft.rejectionReason ? (
              <div className="mt-4 flex items-start gap-2 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-wide mb-0.5">Rejection Reason</p>
                  <p className="text-xs font-bold text-red-600">{draft.rejectionReason}</p>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <FileText size={12} /> {questionCount} question{questionCount !== 1 ? 's' : ''}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {!isDeleted && (
                <button
                  onClick={() => handleRevise(draft)}
                  disabled={revising === draft.id}
                  className="flex items-center gap-1.5 text-xs font-black text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={11} />
                  {revising === draft.id ? 'Creating...' : 'Revise'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
