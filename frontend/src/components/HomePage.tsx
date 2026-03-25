import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Globe, BookOpen, Trophy, Zap } from 'lucide-react';
import mascot from '../assets/mascot_v3.png';

interface Props {
    authToken: string | null;
}

const HomePage = ({ authToken }: Props) => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (authToken) {
            navigate('/home');
        } else {
            navigate('/onboarding');
        }
    };

    const features = [
        {
            icon: <BookOpen className="text-brand-primary" size={24} />,
            title: "Gen Alpha Lore",
            description: "Master the history of Skibidi, the origin of Fanum Tax, and the deep lore of the brain rot universe."
        },
        {
            icon: <Trophy className="text-brand-yellow" size={24} />,
            title: "Rizz Training",
            description: "Interactive lessons on modern social dynamics. Go from negative rizz to ultimate alpha status."
        },
        {
            icon: <Zap className="text-brand-accent" size={24} />,
            title: "Daily Streaks",
            description: "Build a learning streak that would make Duo jealous. 5 minutes a day to become a slang pro."
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b-2 border-slate-100 z-50 px-6 sm:px-12 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.svg" alt="Alpha Decode" className="w-10 h-10 group-hover:scale-110 transition-transform" />
                    <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Alpha <span className="text-brand-primary uppercase">Decode</span></span>
                </div>

                <div className="flex items-center gap-4">
                    {authToken && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-primary text-white font-black hover:bg-brand-primary/90 transition-all uppercase text-sm tracking-widest shadow-[0_4px_0_#46a302]"
                        >
                            Open App
                        </motion.button>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center pt-24 lg:pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                    {/* Mascot Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        className="flex justify-center lg:justify-end relative"
                    >
                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -left-10 text-4xl sm:text-6xl z-20"
                        >
                            💀
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute -bottom-10 -right-5 text-4xl sm:text-6xl z-20"
                        >
                            🔥
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute top-1/2 -left-20 text-4xl sm:text-5xl z-20 hidden lg:block"
                        >
                            🚽
                        </motion.div>

                        <div className="relative">
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 xl:w-[420px] xl:h-[420px] overflow-hidden rounded-full"
                            >
                                <img src={mascot} alt="Alpha Decode Sensei" className="w-full h-full object-contain scale-110" />

                                {/* Knowledge Import Effect */}
                                <motion.div
                                    animate={{ top: ['100%', '0%', '100%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-0 right-0 h-1 bg-brand-yellow/50 shadow-[0_0_20px_rgba(255,200,0,1)] z-20"
                                />
                                <motion.div
                                    animate={{ opacity: [0, 0.3, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-yellow/20 to-transparent h-1/2 z-10"
                                />
                            </motion.div>

                            {/* Decorative background blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/5 rounded-full blur-3xl -z-10" />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-10 -right-10 w-32 h-32 bg-brand-yellow/20 rounded-full blur-2xl"
                            />
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 bg-brand-yellow/10 text-brand-yellow px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border-2 border-brand-yellow/10">
                                <Sparkles size={14} />
                                The #1 Brain Rot Academy
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 tracking-tight leading-[0.95]">
                                THE WORLD'S BEST <br />
                                <span className="text-brand-primary italic uppercase underline decoration-brand-yellow underline-offset-8">ROTTING WAY.</span>
                            </h1>
                            <p className="max-w-md text-xl font-bold text-slate-500 leading-relaxed uppercase italic">
                                Learning "Skibidi" is free, fun, and effective. Become a Rizzologist in just 5 minutes a day.
                            </p>
                        </motion.div>

                        {/* Knowledge Proficiency Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="w-full max-w-xs sm:max-w-sm bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 shadow-sm group hover:border-brand-yellow transition-colors"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Global Proficiency</span>
                                <span className="text-xs font-black text-brand-yellow uppercase">Level: Sigma</span>
                            </div>
                            <div className="h-4 bg-slate-200 rounded-full overflow-hidden relative">
                                <motion.div
                                    animate={{ width: ['40%', '95%', '70%'] }}
                                    transition={{ duration: 5, repeat: Infinity, times: [0, 0.7, 1] }}
                                    className="absolute inset-y-0 left-0 bg-brand-yellow shadow-[0_0_10px_rgba(255,200,0,0.5)]"
                                />
                            </div>
                            <div className="mt-4 flex justify-between text-[10px] font-black uppercase text-slate-400">
                                <span>Lesser Brain</span>
                                <span>Omniscient Alpha 🧠</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, translateY: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGetStarted}
                                className="px-10 py-5 rounded-2xl bg-brand-primary text-white font-black text-xl shadow-[0_8px_0_#46a302] hover:shadow-[0_12px_24px_rgba(88,204,2,0.3)] transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
                            >
                                Get Started
                                <ChevronRight size={24} strokeWidth={3} />
                            </motion.button>

                            {!authToken && (
                                <motion.button
                                    whileHover={{ scale: 1.05, translateY: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/login')}
                                    className="px-10 py-5 rounded-2xl border-2 border-slate-200 text-slate-500 font-black text-xl hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-wider bg-white shadow-[0_4px_0_#e2e8f0] active:shadow-none"
                                >
                                    I already have an account
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 lg:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 w-full"
                >
                    {features.map((f, i) => (
                        <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-shadow group">
                            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-800">{f.title}</h3>
                            <p className="font-bold text-slate-500 text-sm leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t-2 border-slate-100 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                        <Globe size={18} />
                        <span className="font-bold text-sm uppercase tracking-widest text-slate-600">English</span>
                    </div>

                    <div className="flex gap-8">
                        <a href="#" className="text-slate-400 font-black text-xs uppercase hover:text-brand-primary transition-colors">Privacy</a>
                        <a href="#" className="text-slate-400 font-black text-xs uppercase hover:text-brand-primary transition-colors">Terms</a>
                        <a href="#" className="text-slate-400 font-black text-xs uppercase hover:text-brand-primary transition-colors">Mission</a>
                        <a href="#" className="text-slate-400 font-black text-xs uppercase hover:text-brand-primary transition-colors">Contact</a>
                    </div>

                    <div className="text-slate-300 font-bold text-xs uppercase tracking-widest">
                        © 2026 ALPHA DECODE INC.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
