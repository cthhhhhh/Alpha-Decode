import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle, Info } from 'lucide-react';

interface RegisterPageProps {
  onRegisterSuccess: (token: string, role: string, username: string, level?: number, xp?: number, maxUnlockedLessonIndex?: number, streak?: number, profilePic?: string, dailyQuizLastDate?: string, dailyQuizCompletedToday?: boolean, onboardingCompleted?: boolean) => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

const BackgroundBubble = ({ color, size, top, left, bottom, right, delay }: { color: string; size: string; top?: string; left?: string; bottom?: string; right?: string; delay: number }) => (
  <motion.div
    animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    className={`absolute rounded-full blur-[100px] opacity-10 ${color}`}
    style={{ width: size, height: size, top, left, bottom, right }}
  />
);

export default function RegisterPage({ onRegisterSuccess, onGoToLogin, onBack }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'USER' | 'CONTRIBUTOR'>('USER');
  const [contributorSuccess, setContributorSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (selectedRole === 'CONTRIBUTOR') {
        const res = await fetch('/api/auth/register-contributor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || 'Registration failed');
        }
        setContributorSuccess(true);
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || 'Registration failed');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        localStorage.removeItem('initialLevel');
        localStorage.removeItem('initialXp');
        onRegisterSuccess(data.token, data.role, data.username, data.level, data.coins, data.maxUnlockedLessonIndex, data.streak, data.profilePic, data.dailyQuizLastDate, data.dailyQuizCompletedToday, data.onboardingCompleted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (contributorSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <BackgroundBubble color="bg-blue-500" size="60vw" top="-10%" left="-20%" delay={0} />
          <BackgroundBubble color="bg-brand-secondary" size="50vw" bottom="-10%" right="-10%" delay={2} />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 relative z-10 w-full">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl border-4 border-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.1)] text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-blue-500" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 uppercase tracking-tight">Account Created!</h2>
            <p className="text-slate-500 font-bold mb-2">Your contributor account has been submitted for review.</p>
            <p className="text-slate-400 text-sm font-semibold mb-8">An admin will review your request. You'll be able to log in once approved.</p>
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoToLogin}
              className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#2563eb] transition-all"
            >
              GO TO LOGIN
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Vibrant Theme-Consistent Background */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundBubble color="bg-brand-primary" size="60vw" top="-10%" left="-20%" delay={0} />
        <BackgroundBubble color="bg-brand-secondary" size="50vw" bottom="-10%" right="-10%" delay={2} />
        <BackgroundBubble color="bg-brand-yellow" size="30vw" top="30%" left="60%" delay={4} />

        {/* Floating Emojis in brand colors */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-[15%] text-6xl opacity-20"
        >
          🧠
        </motion.div>
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-40 right-[15%] text-6xl opacity-20"
        >
          🔥
        </motion.div>
      </div>

      {/* Header Buttons */}
      <div className="absolute top-8 left-8 right-8 z-[210] flex justify-between items-center pointer-events-none">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full font-bold text-slate-500 hover:bg-white hover:text-slate-800 transition-all shadow-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </motion.button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10 w-full py-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border-4 border-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.1)] text-center relative"
        >
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter uppercase drop-shadow-sm pb-2">
              Create <span className="text-brand-primary italic">Account</span>
            </h1>
            <p className="text-slate-500 font-bold">Join Alpha Decode today</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 bg-red-50 text-red-500 border border-red-200 rounded-2xl px-5 py-4 mb-6 text-sm font-bold text-left"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pr-12 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('USER')}
                  className={`py-3 px-4 rounded-2xl border-2 font-black text-sm transition-all ${
                    selectedRole === 'USER'
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  🎓 Learner
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('CONTRIBUTOR')}
                  className={`py-3 px-4 rounded-2xl border-2 font-black text-sm transition-all ${
                    selectedRole === 'CONTRIBUTOR'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  ✍️ Contributor
                </button>
              </div>
              {selectedRole === 'CONTRIBUTOR' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-start gap-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl px-4 py-3 mt-3 text-xs font-bold"
                >
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>Contributor accounts require admin approval before you can log in. You'll be notified once approved.</span>
                </motion.div>
              )}
            </div>

            <div className="pt-2">
              <motion.button
                id="register-submit"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-white py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group ${
                  selectedRole === 'CONTRIBUTOR'
                    ? 'bg-blue-500 shadow-[0_6px_0_#2563eb] hover:shadow-[0_8px_15px_rgba(59,130,246,0.3)]'
                    : 'bg-brand-primary shadow-[0_6px_0_#46a302] hover:shadow-[0_8px_15px_rgba(88,204,2,0.3)]'
                }`}
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                {!loading && <UserPlus size={20} className="group-hover:scale-110 transition-transform" />}
              </motion.button>
            </div>
          </form>

          <p className="text-center text-slate-400 font-bold mt-8">
            Already have an account?{' '}
            <button onClick={onGoToLogin} className="text-brand-primary hover:text-brand-secondary transition-colors underline decoration-2 underline-offset-4">
              Sign in here
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
