import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Eye, X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { authHeaders } from './utils';
import type { DraftSummary, DraftDetail } from './types';

export function DraftsTab() {
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewDraft, setPreviewDraft] = useState<DraftDetail | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [expandedPreviewQ, setExpandedPreviewQ] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError('');
    fetch('/api/drafts/submitted', { headers: authHeaders() })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text() || 'Failed to load submitted drafts');
        return r.json();
      })
      .then(setDrafts)
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Failed to load submitted drafts';
        setError(msg.includes('Failed to fetch')
          ? 'Cannot reach backend server. Start Spring Boot on port 8080 and keep Vite running.'
          : msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openPreview = async (id: number) => {
    setError('');
    try {
      const res = await fetch(`/api/drafts/${id}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(await res.text() || 'Failed to load draft preview');
      const detail: DraftDetail = await res.json();
      setPreviewDraft(detail);
      setExpandedPreviewQ(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load draft preview';
      setError(msg.includes('Failed to fetch')
        ? 'Cannot reach backend server. Start Spring Boot on port 8080 and keep Vite running.'
        : msg);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/drafts/${id}/review`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'APPROVE' }),
      });
      if (!res.ok) throw new Error(await res.text() || 'Approval failed');
      setDrafts(d => d.filter(x => x.id !== id));
      if (previewDraft?.id === id) setPreviewDraft(null);
      load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Approval failed';
      setError(msg.includes('Failed to fetch')
        ? 'Cannot reach backend server. Start Spring Boot on port 8080 and keep Vite running.'
        : msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    setError('');
    try {
      const res = await fetch(`/api/drafts/${id}/review`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'REJECT', rejectionNote: rejectNote }),
      });
      if (!res.ok) throw new Error(await res.text() || 'Rejection failed');
      setDrafts(d => d.filter(x => x.id !== id));
      setRejectingId(null);
      setRejectNote('');
      if (previewDraft?.id === id) setPreviewDraft(null);
      load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Rejection failed';
      setError(msg.includes('Failed to fetch')
        ? 'Cannot reach backend server. Start Spring Boot on port 8080 and keep Vite running.'
        : msg);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-center text-slate-400 font-bold py-12 animate-pulse">Loading submitted drafts...</div>;

  if (drafts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">✅</p>
        <p className="font-black text-lg">No pending drafts</p>
        <p className="text-sm font-bold">All submitted drafts have been reviewed.</p>
      </div>
    );
  }

  const TYPE_COLORS: Record<string, string> = {
    INTRO:     'bg-blue-100 text-blue-700',
    SELECT:    'bg-purple-100 text-purple-700',
    TRANSLATE: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-bold">
          {error}
        </div>
      )}
      {drafts.map(draft => (
        <motion.div key={draft.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{draft.emoji || '📝'}</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-800">{draft.title}</p>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                by <span className="text-blue-600">{draft.contributorUsername}</span> · {new Date(draft.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Reject note input */}
          <AnimatePresence>
            {rejectingId === draft.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="overflow-hidden mb-3">
                <textarea
                  className="w-full border-2 border-red-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:border-red-400 outline-none resize-none"
                  rows={3}
                  placeholder="Reason for rejection (shown to contributor)..."
                  value={rejectNote}
                  onChange={e => setRejectNote(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => openPreview(draft.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
              <Eye size={12} /> Preview
            </button>
            <button onClick={() => handleApprove(draft.id)} disabled={actionLoading === draft.id}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-green-500 text-white hover:bg-green-600 disabled:opacity-60 transition-all">
              <CheckCircle2 size={12} /> {actionLoading === draft.id ? '...' : 'Approve'}
            </button>
            {rejectingId === draft.id ? (
              <>
                <button onClick={() => handleReject(draft.id)} disabled={actionLoading === draft.id}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 transition-all">
                  <XCircle size={12} /> {actionLoading === draft.id ? '...' : 'Confirm Reject'}
                </button>
                <button onClick={() => { setRejectingId(null); setRejectNote(''); }}
                  className="px-3 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setRejectingId(draft.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                <XCircle size={12} /> Reject
              </button>
            )}
          </div>
        </motion.div>
      ))}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDraft && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPreviewDraft(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-slate-100 flex items-start gap-3">
                <span className="text-3xl">{previewDraft.emoji}</span>
                <div className="flex-1">
                  <h2 className="font-black text-xl text-slate-800">{previewDraft.title}</h2>
                  <p className="text-xs text-slate-500 font-bold">by {previewDraft.contributorUsername}</p>
                </div>
                <button onClick={() => setPreviewDraft(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-1">Story</p>
                  <p className="text-sm text-slate-700 font-bold leading-relaxed">{previewDraft.story}</p>
                </div>

                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} /> Questions ({previewDraft.questions?.length ?? 0})
                  </p>
                  <div className="space-y-2">
                    {(previewDraft.questions ?? []).map((q, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none"
                          onClick={() => setExpandedPreviewQ(expandedPreviewQ === i ? null : i)}>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${TYPE_COLORS[q.question_type] ?? 'bg-slate-100 text-slate-600'}`}>
                            {q.question_type}
                          </span>
                          <p className="flex-1 text-sm font-bold text-slate-700 truncate">{q.title || <span className="italic text-slate-400">Untitled</span>}</p>
                          {expandedPreviewQ === i ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                        </div>
                        <AnimatePresence>
                          {expandedPreviewQ === i && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <div className="px-3 pb-3 space-y-1 border-t border-slate-100 pt-2">
                                {q.content && <p className="text-xs text-slate-600 font-bold">{q.content}</p>}
                                {q.explanation && <p className="text-xs text-slate-500 italic">{q.explanation}</p>}
                                {q.question_type === 'SELECT' && q.options && (
                                  <ul className="space-y-1 pt-1">
                                    {q.options.map((o, oi) => (
                                      <li key={oi} className={`text-xs font-bold px-2 py-1 rounded-lg ${oi === q.correctAnswer ? 'bg-green-100 text-green-700' : 'text-slate-600'}`}>
                                        {oi === q.correctAnswer ? '✓ ' : ''}{o}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {q.question_type === 'TRANSLATE' && (
                                  <>
                                    {q.target && <p className="text-xs font-black text-slate-700 pt-1">Target: {q.target}</p>}
                                    {q.wordbank && <p className="text-xs text-slate-500 font-bold">Words: {q.wordbank.join(', ')}</p>}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white rounded-b-3xl px-6 py-4 border-t border-slate-100 flex gap-3">
                <button onClick={() => handleApprove(previewDraft.id)} disabled={actionLoading === previewDraft.id}
                  className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-black text-sm hover:bg-green-600 disabled:opacity-60 transition-all">
                  {actionLoading === previewDraft.id ? 'Approving...' : '✓ Approve'}
                </button>
                <button onClick={() => { setRejectingId(previewDraft.id); setPreviewDraft(null); }}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all">
                  ✕ Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
