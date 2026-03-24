import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';

interface AchievementInfo {
    id: number;
    name: string;
    description: string;
    icon: string;
    triggerType: string;
    threshold: number;
}

interface UserAchievementInfo {
    achievementId: number;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
}

const AchievementsSection = () => {
    const [all, setAll] = useState<AchievementInfo[]>([]);
    const [unlocked, setUnlocked] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

        Promise.all([
            fetch('/api/achievements').then(r => r.json()),
            token
                ? fetch('/api/achievements/me', { headers }).then(r => r.json())
                : Promise.resolve([]),
        ]).then(([allData, unlockedData]: [AchievementInfo[], UserAchievementInfo[]]) => {
            setAll(allData);
            const map = new Map<number, string>();
            unlockedData.forEach(ua => map.set(ua.achievementId, ua.unlockedAt));
            setUnlocked(map);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-8">
            <div className="text-slate-300 font-bold animate-pulse">Loading achievements...</div>
        </div>
    );

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Trophy size={20} className="text-brand-yellow" fill="currentColor" />
                <h3 className="text-lg font-black text-slate-900">Achievements</h3>
                <span className="ml-auto text-sm font-bold text-slate-400">
                    {unlocked.size}/{all.length} unlocked
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {all.map(a => {
                    const unlockedAt = unlocked.get(a.id);
                    const isUnlocked = !!unlockedAt;
                    return (
                        <motion.div
                            key={a.id}
                            whileHover={{ scale: 1.04 }}
                            className={`relative rounded-2xl p-4 text-center border-2 transition-all
                                ${isUnlocked
                                    ? 'border-brand-yellow/40 bg-brand-yellow/5 shadow-sm'
                                    : 'border-slate-100 bg-slate-50 opacity-50'}`}
                        >
                            <div className="text-3xl mb-2">{a.icon}</div>
                            <p className={`text-xs font-black leading-tight mb-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                {a.name}
                            </p>
                            <p className={`text-[10px] leading-tight ${isUnlocked ? 'text-slate-500' : 'text-slate-300'}`}>
                                {a.description}
                            </p>
                            {isUnlocked && unlockedAt && (
                                <p className="text-[9px] font-black text-brand-yellow mt-2 uppercase tracking-wide">
                                    {formatDate(unlockedAt)}
                                </p>
                            )}
                            {!isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                                    <span className="text-xl">🔒</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsSection;
