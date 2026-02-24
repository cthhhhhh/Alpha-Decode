import { motion } from 'motion/react';
import { TERMS } from '../constants';

const DailyWord = () => (
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
                <span className="text-slate-400 text-xs font-medium">Feb 25, 2026</span>
            </div>
            <h2 className="text-5xl font-black mb-2">{TERMS[0].term}</h2>
            <p className="text-xl text-slate-300 mb-6 max-w-xl">
                {TERMS[0].definition}
            </p>
            <div className="flex gap-3">
                <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-slate-100 transition-colors">
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

export default DailyWord;
