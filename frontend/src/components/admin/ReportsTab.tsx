import { useState, useEffect } from 'react';
import { RefreshCcw, CheckCircle, Flag, ExternalLink, Trash2 } from 'lucide-react';
import type { FlagItem } from './types';
import { authHeaders, formatReason } from './utils';
import { ConfirmModal } from './ConfirmModal';

export function ReportsTab() {
  const [flags, setFlags] = useState<FlagItem[]>([]);
  const [lessonMap, setLessonMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => { }
  });

  const fetchFlags = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/flags', { headers: authHeaders() }),
      fetch('/api/lessons/', { headers: authHeaders() }),
    ])
      .then(async ([fr, lr]) => {
        if (!fr.ok) throw new Error('Failed to load flags');
        const [flagData, lessonData] = await Promise.all([fr.json(), lr.ok ? lr.json() : []]);
        setFlags(flagData);
        const map: Record<number, string> = {};
        (lessonData as { id: number; title: string }[]).forEach(l => { map[l.id] = l.title; });
        setLessonMap(map);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFlags(); }, []);

  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolveError, setResolveError] = useState('');

  const handleResolve = async (id: number) => {
    setResolvingId(id);
    setResolveError('');
    try {
      const res = await fetch(`/api/flags/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: 'RESOLVED' }),
      });
      if (res.ok) {
        setFlags(f => f.map(x => x.id === id ? { ...x, status: 'RESOLVED' } : x));
      } else {
        const text = await res.text();
        setResolveError(`Failed (${res.status}): ${text}`);
      }
    } catch (e) {
      setResolveError('Network error — is the backend running?');
    } finally {
      setResolvingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Report?',
      message: 'Are you sure you want to permanently delete this report? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/flags/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
          });
          if (res.ok) {
            setFlags(f => f.filter(x => x.id !== id));
          } else {
            alert('Failed to delete report');
          }
        } catch (e) {
          alert('Network error');
        }
      }
    });
  };

  const handleClearResolved = async () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Clear History?',
      message: 'Are you sure you want to delete ALL resolved reports? This will permanently wipe your resolution history.',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/flags/resolved', {
            method: 'DELETE',
            headers: authHeaders(),
          });
          if (res.ok) {
            setFlags(f => f.filter(x => x.status !== 'RESOLVED'));
          } else {
            alert('Failed to clear resolved reports');
          }
        } catch (e) {
          alert('Network error');
        }
      }
    });
  };

  const contentLabel = (flag: FlagItem) => {
    if (flag.contentContext) return flag.contentContext;
    const ct = flag.contentType?.toUpperCase();
    if (ct === 'LESSON') return lessonMap[flag.contentId] || `Lesson #${flag.contentId}`;
    if (ct === 'TERM') return `Slang Term #${flag.contentId}`;
    if (ct === 'QUIZ') return `Checkpoint Quiz #${flag.contentId}`;
    if (ct === 'QUESTION') return `Quiz Question #${flag.contentId}`;
    return `${flag.contentType} #${flag.contentId}`;
  };

  if (loading) return <div className="text-center p-12 text-slate-400 font-bold animate-pulse">Loading Reports...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-200">{error}</div>;

  const pending = flags.filter(f => f.status === 'PENDING');
  const resolved = flags.filter(f => f.status === 'RESOLVED').slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2"><Flag className="text-red-500" size={20} /> Pending ({pending.length})</h2>
        <button onClick={fetchFlags} className="p-2 text-slate-400 hover:text-brand-primary transition-colors hover:bg-slate-100 rounded-full"><RefreshCcw size={18} /></button>
      </div>

      {resolveError && (
        <div className="bg-red-50 border border-red-200 text-red-600 font-bold text-sm px-4 py-3 rounded-xl">
          {resolveError}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="bg-green-50 rounded-2xl p-10 text-center border-2 border-green-100">
          <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-green-700">All clear!</h3>
          <p className="text-green-600/80 font-bold text-sm">No pending reports.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map(flag => (
            <div key={flag.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm font-black">{formatReason(flag.reason)}</span>
                  <span className="text-sm font-bold text-slate-400">by {flag.reportedBy} · {new Date(flag.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 font-medium text-base mb-3">"{flag.details || 'No details provided'}"</p>
                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 border border-slate-200">
                  <ExternalLink size={13} /> {contentLabel(flag)}
                </span>
              </div>
              <button
                onClick={() => handleResolve(flag.id)}
                disabled={resolvingId === flag.id}
                className="shrink-0 bg-green-50 text-green-600 border border-green-200 px-5 py-3 rounded-xl text-sm font-black hover:bg-green-500 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resolvingId === flag.id ? 'Resolving…' : 'Mark Resolved'}
              </button>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recently Resolved</h3>
            <button
              onClick={handleClearResolved}
              className="flex items-center gap-1.5 text-[10px] font-black text-red-400 hover:text-red-500 transition-colors uppercase tracking-wider bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-100"
            >
              <Trash2 size={14} /> Clear All
            </button>
          </div>
          <div className="space-y-2">
            {resolved.map(f => (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 opacity-60 hover:opacity-100 transition-opacity group" key={f.id}>
                <span className="text-sm font-bold text-slate-500">[{contentLabel(f)}] {formatReason(f.reason)}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-green-500 flex items-center gap-1.5"><CheckCircle size={14} /> Resolved</span>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1.5 text-red-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                    title="Delete permanently"
                  >
                    <Trash2 size={20} />
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
