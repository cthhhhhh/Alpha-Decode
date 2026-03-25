import { Flame, Star, Zap, LogOut, ChevronDown, User } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
    streak: number;
    xp: number;
    level: number;
    authToken: string | null;
    authUsername: string | null;
    authRole: string | null;
    onLogout: () => void;
    onViewProfile?: () => void;
}

const Header = ({ streak, xp, level, authToken, authUsername, authRole, onLogout, onViewProfile }: Props) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const streakAtRisk = useMemo(() => {
        if (streak <= 0) return false;
        const dailyQuizDate = localStorage.getItem('dailyQuizDate');
        const today = new Date().toISOString().slice(0, 10);
        if (dailyQuizDate === today) return false;
        return new Date().getHours() >= 18;
    }, [streak]);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Alpha Decode" className="w-8 h-8" />
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        Alpha <span className="text-green-500">Decode</span>
                    </h1>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center gap-1.5 text-orange-500 font-bold">
                            <Flame size={20} fill="currentColor" />
                            <span>{streak}</span>
                            {streakAtRisk && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-brand-yellow font-bold">
                            <Star size={20} fill="currentColor" />
                            <span>{xp}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-brand-accent font-bold">
                            <Zap size={20} fill="currentColor" />
                            <span>LVL {level}</span>
                        </div>
                    </div>

                    {/* Auth */}
                    {authToken ? (
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowUserMenu(v => !v)}
                                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-xl text-sm font-bold text-slate-700"
                            >
                                <span>{authRole?.toUpperCase() === 'ADMIN' ? '👑' : '🎓'} {authUsername}</span>
                                <ChevronDown size={14} />
                            </motion.button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                                    >
                                        <div className="px-3 py-2 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {authRole?.toUpperCase() === 'ADMIN' ? 'Admin' : 'User'}
                                            </p>
                                            <p className="text-sm font-black text-slate-800 truncate">{authUsername}</p>
                                        </div>
                                        {onViewProfile && (
                                            <button
                                                onClick={() => { onViewProfile(); setShowUserMenu(false); }}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                <User size={15} />
                                                View Profile
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { onLogout(); setShowUserMenu(false); }}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={15} />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Header;
