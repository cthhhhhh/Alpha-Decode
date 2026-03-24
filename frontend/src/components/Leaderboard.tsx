import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Star, Zap, Crown } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    username: string;
    level: number;
    xp: number;
    streak: number;
}

interface Props {
    authUsername: string | null;
}

const PODIUM_COLORS = ['bg-yellow-400', 'bg-slate-300', 'bg-amber-600'];
const PODIUM_SIZES = ['h-24', 'h-16', 'h-12'];

const Leaderboard = ({ authUsername }: Props) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/leaderboard', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        })
            .then(r => r.json())
            .then((data: LeaderboardEntry[]) => { setEntries(data); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="text-2xl font-black text-slate-300 animate-pulse">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center py-20 text-slate-400">
            <p className="font-bold">Could not load leaderboard.</p>
        </div>
    );

    const top3 = entries.slice(0, 3);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Podium */}
            {top3.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-end justify-center gap-4 mb-4">
                        {/* Reorder: 2nd, 1st, 3rd */}
                        {[top3[1], top3[0], top3[2]].map((entry, podiumSlot) => {
                            if (!entry) return <div key={podiumSlot} className="w-24" />;
                            const displayRank = entry.rank;
                            const colorIdx = displayRank - 1;
                            const isMe = entry.username === authUsername;
                            const medalEmoji = ['🥇', '🥈', '🥉'][colorIdx] ?? '';
                            return (
                                <motion.div
                                    key={entry.rank}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: podiumSlot * 0.1 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <span className="text-2xl">{medalEmoji}</span>
                                    <div className={`text-center px-3 py-2 rounded-2xl border-2 ${isMe ? 'border-brand-primary bg-brand-primary/10' : 'border-slate-200 bg-white'}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-lg mx-auto mb-1">
                                            {entry.username.charAt(0).toUpperCase()}
                                        </div>
                                        <p className={`text-xs font-black truncate max-w-[72px] ${isMe ? 'text-brand-primary' : 'text-slate-700'}`}>
                                            {isMe ? 'You' : entry.username}
                                        </p>
                                        <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                            <Star size={10} className="text-brand-yellow" fill="currentColor" />
                                            <span className="text-[10px] font-black text-slate-500">{entry.xp}</span>
                                        </div>
                                    </div>
                                    <div className={`w-20 ${PODIUM_COLORS[colorIdx]} ${PODIUM_SIZES[colorIdx]} rounded-t-xl flex items-end justify-center pb-1`}>
                                        <span className="text-white font-black text-xl">#{displayRank}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Ranked list */}
            <div className="space-y-3">
                {entries.map((entry, i) => {
                    const isMe = entry.username === authUsername;
                    return (
                        <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
                                ${isMe
                                    ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10'
                                    : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            {/* Rank */}
                            <div className="w-8 text-center">
                                {entry.rank <= 3
                                    ? <span className="text-xl">{['🥇', '🥈', '🥉'][entry.rank - 1]}</span>
                                    : <span className="font-black text-slate-400 text-sm">#{entry.rank}</span>}
                            </div>

                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base shrink-0
                                ${isMe ? 'bg-brand-primary' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                                {isMe ? <Crown size={18} /> : entry.username.charAt(0).toUpperCase()}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-black truncate ${isMe ? 'text-brand-primary' : 'text-slate-800'}`}>
                                    {isMe ? `${entry.username} (You)` : entry.username}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-0.5">
                                        <Zap size={11} className="text-brand-accent" />
                                        <span className="text-[11px] font-bold text-slate-400">LVL {entry.level}</span>
                                    </div>
                                    {entry.streak > 0 && (
                                        <div className="flex items-center gap-0.5">
                                            <Flame size={11} className="text-orange-400" fill="currentColor" />
                                            <span className="text-[11px] font-bold text-slate-400">{entry.streak}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* XP */}
                            <div className="flex items-center gap-1 shrink-0">
                                <Star size={16} className="text-brand-yellow" fill="currentColor" />
                                <span className="font-black text-slate-700">{entry.xp}</span>
                            </div>
                        </motion.div>
                    );
                })}

                {entries.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="font-bold">No players yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
