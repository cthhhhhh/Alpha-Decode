import { useEffect, useState } from 'react';
import { Youtube, Instagram } from 'lucide-react';
import { motion } from 'motion/react';

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.28-1.42 4.766 4.766 0 0 1-1.309-3.266h-2.92v13.047c0 2.107-1.707 3.815-3.815 3.815a3.815 3.815 0 0 1-3.815-3.815c0-2.107 1.707-3.815 3.815-3.815.422 0 .825.068 1.202.194v-2.935C7.942 8.163 7.228 8.01 6.47 8.01a6.74 6.74 0 0 0-6.74 6.74 6.74 6.74 0 0 0 6.74 6.74c3.722 0 6.74-3.018 6.74-6.74V7.551a10.457 10.457 0 0 0 6.379 2.164V6.787a4.773 4.773 0 0 1-1.309-.101z" />
    </svg>
);

interface ApiTerm {
    id: number;
    term: string;
    definition: string;
    example: string;
    difficulty: string;
    category: string;
}

interface DailyWordProps {
    authToken: string | null;
}

const DailyWord = ({ authToken }: DailyWordProps) => {
    const [dailyTerm, setDailyTerm] = useState<ApiTerm | null>(null);

    const handleShare = () => {
        const text = `Today's word on Alpha Decode: "${dailyTerm?.term}" — ${dailyTerm?.definition}`;
        if (navigator.share) {
            navigator.share({ title: 'Alpha Decode Word of the Day', text });
        } else {
            navigator.clipboard.writeText(text);
        }
    };

    useEffect(() => {
        fetch('/api/terms/')
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data: ApiTerm[]) => {
                if (data.length > 0) {
                    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                    const selected = data[dayOfYear % data.length];
                    setDailyTerm(selected);
                }
            })
            .catch(() => { });
    }, [authToken]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white rounded-[2rem] p-8 mb-8 relative shadow-2xl shadow-slate-900/40 border border-white/5"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <span className="bg-brand-yellow text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-brand-yellow/20">
                            Daily Slang
                        </span>
                        <span className="text-slate-400 text-xs font-bold tracking-tight">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                    <div className="flex-1">
                        <motion.h2 layout="position" className="text-6xl font-black mb-3 tracking-tighter">
                            {dailyTerm?.term ?? '…'}
                        </motion.h2>

                        <motion.p layout="position" className="text-xl text-slate-300 max-w-xl font-medium leading-relaxed">
                            {dailyTerm?.definition ?? 'Loading today\'s word…'}
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <a 
                                href={dailyTerm?.term ? `https://www.tiktok.com/search?q=${encodeURIComponent(dailyTerm.term + ' slang')}` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#00f2ea] hover:bg-[#00f2ea]/10 hover:border-[#00f2ea]/30 transition-all group shadow-lg"
                                title="TikTok Brainrot"
                            >
                                <TikTokIcon size={20} />
                            </a>
                            <a 
                                href={dailyTerm?.term ? `https://www.instagram.com/explore/tags/${encodeURIComponent(dailyTerm.term.replace(/\s+/g, ''))}` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#e1306c] hover:bg-[#e1306c]/10 hover:border-[#e1306c]/30 transition-all group shadow-lg"
                                title="Insta Reels"
                            >
                                <Instagram size={20} />
                            </a>
                            <a 
                                href={dailyTerm?.term ? `https://www.youtube.com/results?search_query=${encodeURIComponent(dailyTerm.term + ' slang')}` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#ff0000] hover:bg-[#ff0000]/10 hover:border-[#ff0000]/30 transition-all group shadow-lg"
                                title="YouTube Lore"
                            >
                                <Youtube size={20} />
                            </a>
                        </div>

                        <div className="w-px h-8 bg-white/10 mx-1" />

                        <button onClick={handleShare} className="border border-white/20 px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-colors opacity-80 hover:opacity-100 shadow-lg">
                            Share
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/10 blur-[80px] -ml-20 -mb-20 rounded-full" />
            </div>
        </motion.div>
    );
};

export default DailyWord;
