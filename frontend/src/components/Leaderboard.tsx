import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Flame, Zap, Crown, Star } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    username: string;
    level: number;
    xp: number;
    streak: number;
}

interface MyRankResponse {
    rank: number;
    entry: LeaderboardEntry;
}

interface Props {
    authUsername: string | null;
}

const PODIUM_COLORS = ['bg-yellow-400', 'bg-slate-300', 'bg-amber-600'];
const PODIUM_SIZES = ['h-40', 'h-28', 'h-20'];

const Leaderboard = ({ authUsername }: Props) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [period, setPeriod] = useState<'allTime' | 'weekly'>('allTime');
    const [sort, setSort] = useState<'xp' | 'streak'>('xp');
    const [myRank, setMyRank] = useState<MyRankResponse | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`/api/leaderboard?period=${period}&sort=${sort}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        })
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data: LeaderboardEntry[]) => { setEntries(data); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, [period, sort]);

    useEffect(() => {
        if (!authUsername) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch(`/api/leaderboard/me?period=${period}&sort=${sort}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : null)
            .then((data: MyRankResponse | null) => setMyRank(data))
            .catch(() => {});
    }, [authUsername, period, sort]);

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
    const isInTopList = entries.some(e => e.username === authUsername);

    return (
        <div className="max-w-4xl mx-auto w-full overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800">Leaderboard</h2>
                    <p className="text-slate-500 lowercase first-letter:uppercase">Top players ranked by {sort === 'xp' ? 'stars' : 'streak'}.</p>
                </div>

                {/* Filter toggles moved to top right */}
                <div className="flex items-center gap-3">
                    <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden bg-white select-none">
                        {(['allTime', 'weekly'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => { if (period !== p) { setPeriod(p); setLoading(true); } }}
                                className={`px-4 py-1.5 text-xs font-black uppercase tracking-wide transition-colors
                                    ${period === p ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {p === 'allTime' ? 'All Time' : 'This Week'}
                            </button>
                        ))}
                    </div>
                    <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden bg-white select-none">
                        {(['xp', 'streak'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => { if (sort !== s) { setSort(s); setLoading(true); } }}
                                className={`px-4 py-1.5 text-xs font-black uppercase tracking-wide transition-colors
                                    ${sort === s ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {s === 'xp' ? 'By Stars' : 'By Streak'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Podium */}
            {top3.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="flex items-end justify-center gap-2 sm:gap-4 mb-4">
                        {/* Reorder: 2nd, 1st, 3rd */}
                        {[top3[1], top3[0], top3[2]].map((entry, podiumSlot) => {
                            if (!entry) return <div key={podiumSlot} className="w-20 sm:w-24" />;
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
                                    <span className="text-2xl sm:text-3xl">{medalEmoji}</span>
                                    <div className={`text-center px-3 sm:px-4 py-2 sm:py-3 rounded-2xl border-2 ${isMe ? 'border-brand-primary bg-brand-primary/10' : 'border-slate-200 bg-white'}`}>
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-black text-lg sm:text-2xl mx-auto mb-1">
                                            {entry.username.charAt(0).toUpperCase()}
                                        </div>
                                        <p className={`text-xs sm:text-sm font-black truncate max-w-[72px] sm:max-w-[88px] ${isMe ? 'text-brand-primary' : 'text-slate-700'}`}>
                                            {isMe ? 'You' : entry.username}
                                        </p>
                                        <div className="flex items-center justify-center gap-0.5 mt-1">
                                            {sort === 'streak' ? (
                                                <>
                                                    <Flame size={13} className="text-orange-400 fill-current" />
                                                    <span className="text-xs font-black text-slate-500">{entry.streak}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Star size={13} className="text-brand-yellow fill-current" />
                                                    <span className="text-xs font-black text-slate-500">{entry.xp} Stars</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`w-20 sm:w-28 ${PODIUM_COLORS[colorIdx]} ${PODIUM_SIZES[colorIdx]} rounded-t-xl flex items-end justify-center pb-2`}>
                                        <span className="text-white font-black text-lg sm:text-2xl">#{displayRank}</span>
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
                                        <Zap size={11} className="text-brand-accent fill-current" />
                                        <span className="text-[11px] font-bold text-slate-400">LVL {entry.level}</span>
                                    </div>
                                    {sort === 'streak' ? (
                                        <div className="flex items-center gap-0.5">
                                            <Star size={11} className="text-brand-yellow fill-current" />
                                            <span className="text-[11px] font-bold text-slate-400">{entry.xp} Stars</span>
                                        </div>
                                    ) : (
                                        entry.streak > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <Flame size={11} className="text-orange-400" fill="currentColor" />
                                                <span className="text-[11px] font-bold text-slate-400">{entry.streak}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* XP or Streak value based on sort */}
                            <div className="flex items-center gap-1 shrink-0">
                                {sort === 'streak' ? (
                                    <>
                                        <Flame size={16} className="text-orange-400" fill="currentColor" />
                                        <span className="font-black text-slate-700">{entry.streak}</span>
                                    </>
                                ) : (
                                    <>
                                        <Star size={16} className="text-brand-yellow fill-current" />
                                        <span className="font-black text-slate-700">{entry.xp} Stars</span>
                                    </>
                                )}
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

                {/* My Rank card — shown when current user is not in the visible list */}
                {authUsername && myRank && myRank.entry && !isInTopList && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 border-t-2 border-dashed border-slate-200 pt-4"
                    >
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wide mb-2">Your Rank</p>
                        <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10">
                            <div className="w-8 text-center">
                                <span className="font-black text-slate-400 text-sm">#{myRank.rank}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base shrink-0 bg-brand-primary">
                                <Crown size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black truncate text-brand-primary">
                                    {myRank.entry.username} (You)
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-0.5">
                                        <Zap size={11} className="text-brand-accent fill-current" />
                                        <span className="text-[11px] font-bold text-slate-400">LVL {myRank.entry.level}</span>
                                    </div>
                                    {sort === 'streak' ? (
                                        <div className="flex items-center gap-0.5">
                                            <Star size={11} className="text-brand-yellow fill-current" />
                                            <span className="text-[11px] font-bold text-slate-400">{myRank.entry.xp} Stars</span>
                                        </div>
                                    ) : (
                                        myRank.entry.streak > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <Flame size={11} className="text-orange-400" fill="currentColor" />
                                                <span className="text-[11px] font-bold text-slate-400">{myRank.entry.streak}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {sort === 'streak' ? (
                                    <>
                                        <Flame size={16} className="text-orange-400" fill="currentColor" />
                                        <span className="font-black text-slate-700">{myRank.entry.streak}</span>
                                    </>
                                ) : (
                                    <>
                                        <Star size={16} className="text-brand-yellow fill-current" />
                                        <span className="font-black text-slate-700">{myRank.entry.xp} Stars</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
