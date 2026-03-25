import { motion } from 'motion/react';
import { Zap, BookOpen, Flame } from 'lucide-react';

interface Props {
  level: number;
  xp: number;
  lessonsCompleted: number;
  streak: number;
  loginDates: string[];
  onViewGlossary: () => void;
}

const XP_PER_LEVEL = 50;

export default function LearnSidebarLeft({ level, xp, lessonsCompleted, streak, loginDates, onViewGlossary }: Props) {
  const relXp = xp % XP_PER_LEVEL;
  const xpLeft = XP_PER_LEVEL - relXp;
  const progressPct = Math.min((relXp / XP_PER_LEVEL) * 100, 100);

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })(); // Mon=0, Sun=6
  const weekData = days.map((day, idx) => {
    if (idx > todayIdx) return { day, status: 'future' };
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + (idx - todayIdx));
    const dateStr = dateObj.toISOString().slice(0, 10);
    return { day, status: loginDates.includes(dateStr) ? 'active' : 'missed' };
  });

  return (
    <div className="space-y-4">
      {/* Level Progress */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-red-500/10"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Level Progress</h4>
            <h2 className="text-2xl font-black text-slate-800">Level {level}</h2>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
            <Zap size={20} className="fill-current" />
          </div>
        </div>

        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-red-500 rounded-full"
          />
        </div>
        <p className="text-[11px] font-bold text-slate-400">
          {relXp} / {XP_PER_LEVEL} Stars  •  {xpLeft} to Level {level + 1}
        </p>
      </motion.div>

      {/* Daily Quiz Streak */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-xl hover:shadow-orange-500/10"
      >
        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
          <Flame size={20} className="fill-current" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Daily Quiz Streak</h4>
          <p className="text-sm font-black text-slate-800 whitespace-nowrap">{streak} day{streak === 1 ? '' : 's'}</p>
        </div>
      </motion.div>

      {/* Words Mastered */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-xl hover:shadow-blue-500/10"
      >
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
          <BookOpen size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Words Mastered</h4>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black text-slate-800 whitespace-nowrap">{lessonsCompleted} lesson{lessonsCompleted === 1 ? '' : 's'} done</p>
            <button onClick={onViewGlossary} className="text-xs font-bold text-blue-500 hover:text-blue-600 shrink-0">
              View &rarr;
            </button>
          </div>
        </div>
      </motion.div>

      {/* This Week */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-green-500/10"
      >
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">This Week (Login Streak)</h4>
        <div className="flex justify-between items-center">
          {weekData.map((d, i) => {
            let colorClasses = 'bg-slate-100 border-slate-100'; // future
            if (d.status === 'active') colorClasses = 'bg-green-500 border-green-500 shadow-sm shadow-green-500/30';
            if (d.status === 'missed') colorClasses = 'bg-red-500 border-red-500 shadow-sm shadow-red-500/30';

            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-xl border-2 ${colorClasses} transition-colors duration-500`} />
                <span className="text-[10px] font-bold text-slate-400">{d.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
