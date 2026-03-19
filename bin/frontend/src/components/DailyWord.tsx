import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface ApiTerm { id: number; term: string; definition: string; }

interface DailyWordProps {
    onLearnMore?: () => void;
}

const DailyWord = ({ onLearnMore }: DailyWordProps) => {
    const [dailyTerm, setDailyTerm] = useState<ApiTerm | null>(null);

    useEffect(() => {
        fetch('/api/terms/')
            .then(r => r.json())
            .then((data: ApiTerm[]) => {
                if (data.length > 0) {
                    // Pick a term based on day-of-year so it changes daily but is consistent
                    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                    setDailyTerm(data[dayOfYear % data.length]);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white rounded-3xl p-8 mb-8 relative overflow-hidden"
        >
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-brand-yellow text-slate-900 text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                        Daily Slang
                    </span>
                    <span className="text-slate-400 text-xs font-medium">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <h2 className="text-5xl font-black mb-2">{dailyTerm?.term ?? '…'}</h2>
                <p className="text-xl text-slate-300 mb-6 max-w-xl">
                    {dailyTerm?.definition ?? 'Loading today\'s word…'}
                </p>
                <div className="flex gap-3">
                    <button onClick={onLearnMore} className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">
                        Learn More
                    </button>
                    <button className="border border-white/20 px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                        Share
                    </button>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-3xl -mr-20 -mt-20 rounded-full" />
        </motion.div>
    );
};

export default DailyWord;
