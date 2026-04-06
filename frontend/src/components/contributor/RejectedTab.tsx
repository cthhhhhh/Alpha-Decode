import { useState } from 'react';
import { XCircle, Trash2, AlertCircle, FileText, RotateCcw, X, CheckCircle } from 'lucide-react';
import { authHeaders } from '../admin/utils';
import type { Draft } from './types';
import { ConfirmModal } from '../admin/ConfirmModal';

interface RejectedTabProps {
  drafts: Draft[];
  onDraftsChange: () => void;
  onReviseSuccess?: (newId: number) => void;
}

export function RejectedTab({ drafts, onDraftsChange, onReviseSuccess }: RejectedTabProps) {
  const rejected = drafts.filter(d => d.status === 'REJECTED' || d.status === 'DELETED');
  const [revising, setRevising] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [revisedIds, setRevisedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('revised_draft_ids') || '[]'); }
    catch { return []; }
  });

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

  const markAsRevised = (id: number) => {
    try {
      const prev = JSON.parse(localStorage.getItem('revised_draft_ids') || '[]');
      if (!prev.includes(id)) {
        const next = [...prev, id];
        localStorage.setItem('revised_draft_ids', JSON.stringify(next));
        setRevisedIds(next);
      }
    } catch {
      localStorage.setItem('revised_draft_ids', JSON.stringify([id]));
      setRevisedIds([id]);
    }
  };

  const dismiss = async (id: number) => {
    setDeleting(id);
    try {
      await fetch(`/api/drafts/${id}`, { method: 'DELETE', headers: authHeaders() });
      onDraftsChange();
    } finally {
      setDeleting(null);
    }
  };

  const clearAll = async () => {
    for (const draft of rejected) {
      await fetch(`/api/drafts/${draft.id}`, { method: 'DELETE', headers: authHeaders() });
    }
    onDraftsChange();
  };

  const handleDismissClick = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Record?',
      message: 'Remove this rejected/deleted record from your dashboard history?',
      type: 'warning',
      confirmLabel: 'Remove',
      onConfirm: () => dismiss(id),
    });
  };

  const handleClearAllClick = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear History?',
      message: 'Clear your history of all rejected and deleted drafts from the dashboard?',
      type: 'danger',
      confirmLabel: 'Clear All',
      onConfirm: clearAll,
    });
  };

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
      const res = await fetch('/api/drafts', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
      const newDraft = await res.json();
      markAsRevised(draft.id);
      if (onReviseSuccess) {
        onReviseSuccess(newDraft.id);
      } else {
        onDraftsChange();
      }
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
      <div className="flex items-center justify-between">
        <p className="text-sm font-black text-slate-500 uppercase tracking-wide">{rejected.length} Rejected / Deleted</p>
        <button
          onClick={handleClearAllClick}
          className="flex items-center gap-1.5 text-[10px] font-black text-red-400 hover:text-red-500 transition-colors uppercase tracking-wider bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-100"
        >
          <Trash2 size={13} /> Clear All
        </button>
      </div>
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
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm bg-red-500"
                />
                <button
                  onClick={() => handleDismissClick(draft.id)}
                  disabled={deleting === draft.id}
                  title="Delete record"
                  className="p-1 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                >
                  <X size={14} />
                </button>
              </div>
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
                  disabled={revising === draft.id || revisedIds.includes(draft.id)}
                  className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition-colors ${revisedIds.includes(draft.id) ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-100' : 'text-blue-500 bg-blue-50 hover:bg-blue-100 disabled:opacity-50'}`}
                >
                  {revisedIds.includes(draft.id) ? (
                    <>
                      <CheckCircle size={11} />
                      Revised
                    </>
                  ) : (
                    <>
                      <RotateCcw size={11} />
                      {revising === draft.id ? 'Creating...' : 'Revise'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
      <ConfirmModal
        {...confirmConfig}
        onClose={() => setConfirmConfig(c => ({ ...c, isOpen: false }))}
      />
    </div>
  );
}
