import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import type { ContributorStats } from './types';
import { authHeaders } from './utils';

export function ContributorDashboardTab() {
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/drafts/my/stats', { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setStats({
        total: data.total,
        draft: data.draft,
        submitted: data.submitted,
        approved: data.approved,
        rejected: data.rejected,
        deleted: data.deleted ?? 0,
      }))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Drafts',    value: stats?.total,     icon: <FileText size={22} />,     color: 'text-blue-500',   bg: 'bg-blue-50' },
    { label: 'Pending Review',  value: stats?.submitted, icon: <Clock size={22} />,         color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Approved',        value: stats?.approved,  icon: <CheckCircle2 size={22} />,  color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Rejected',        value: stats?.rejected,  icon: <XCircle size={22} />,       color: 'text-red-500',    bg: 'bg-red-50' },
  ];

  if (loading) return <div className="text-center text-slate-400 font-bold py-12 animate-pulse">Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {cards.map(c => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.bg} ${c.color}`}>
              {c.icon}
            </div>
            <p className="text-3xl font-black text-slate-800">{c.value ?? 0}</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-wide mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {stats && stats.rejected > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-black text-red-700 text-sm">
              You have {stats.rejected} rejected draft{stats.rejected > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-600 font-bold mt-0.5">
              Review the feedback in My Drafts and re-submit when ready.
            </p>
          </div>
        </motion.div>
      )}

      {stats && stats.deleted > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-zinc-100 border border-zinc-300 rounded-2xl px-5 py-4 flex items-start gap-3"
        >
          <Trash2 size={18} className="text-zinc-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-black text-zinc-700 text-sm">
              {stats.deleted} of your approved lesson{stats.deleted > 1 ? 's have' : ' has'} been removed by an admin
            </p>
            <p className="text-xs text-zinc-600 font-bold mt-0.5">
              Check the Approved tab to dismiss or review the deleted entries.
            </p>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-black text-slate-700 mb-2">How it works</h3>
        <ol className="space-y-2 text-sm text-slate-600 font-bold">
          <li className="flex items-start gap-2"><span className="text-blue-500 font-black">1.</span> Create a draft lesson with questions in the Create tab</li>
          <li className="flex items-start gap-2"><span className="text-yellow-600 font-black">2.</span> Submit it for admin review when you&apos;re happy</li>
          <li className="flex items-start gap-2"><span className="text-green-600 font-black">3.</span> Once approved, your lesson goes live for all learners!</li>
        </ol>
      </div>
    </div>
  );
}
