import { motion } from 'motion/react';
import { Users, UserCheck, Activity } from 'lucide-react';
import type { AdminStats } from './types';

export function DashboardTab({ stats }: { stats: AdminStats | null }) {
  if (!stats) return null;
  const cards = [
    { label: 'Standard Users', value: stats.totalUsers, color: 'bg-blue-100 text-blue-500', icon: <Users size={28} /> },
    { label: 'Contributors', value: stats.contributors, color: 'bg-indigo-100 text-indigo-500', icon: <UserCheck size={28} /> },
    { label: 'Active Sessions', value: stats.activeSessions, color: 'bg-green-100 text-green-500', icon: <Activity size={28} />, ping: true },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map(c => (
        <motion.div key={c.label} whileHover={{ y: -4 }} className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-1">{c.label}</p>
            <p className="text-5xl font-black text-slate-800">{c.value}</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative ${c.color}`}>
            {c.icon}
            {c.ping && <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-ping" />}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
