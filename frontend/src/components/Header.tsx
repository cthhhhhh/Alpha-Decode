import { Flame, Star, Zap } from 'lucide-react';

interface Props {
    streak: number;
    xp: number;
    level: number;
}

const Header = ({ streak, xp, level }: Props) => (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-green-500 text-white p-1 rounded-lg">
                    <span className="font-black text-xl px-1">a</span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                    Alpha<span className="text-green-500">Decode</span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-orange-500 font-bold">
                    <Flame size={20} fill="currentColor" />
                    <span>{streak}</span>
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
        </div>
    </header>
);

export default Header;
