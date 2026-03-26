import { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (token: string, role: string, username: string, level?: number, xp?: number, maxUnlockedLessonIndex?: number, streak?: number, profilePic?: string, dailyQuizLastDate?: string, dailyQuizCompletedToday?: boolean, onboardingCompleted?: boolean) => void;
  onGoToRegister: () => void;
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

export default function LoginPage({ onLoginSuccess, onGoToRegister, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Invalid username or password');
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      onLoginSuccess(data.token, data.role, data.username, data.level, data.xp, data.maxUnlockedLessonIndex, data.streak, data.profilePic, data.dailyQuizLastDate, data.dailyQuizCompletedToday, data.onboardingCompleted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: forgotEmail }),
      });
      if (!res.ok) throw new Error(await res.text() || 'Invalid username or email');
      setForgotStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });
      if (!res.ok) throw new Error(await res.text() || 'Reset failed');
      setIsForgotMode(false);
      setPassword('');
      setSuccessMsg('Password reset successfully! You can now log in.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => {
            if (isForgotMode) {
              setIsForgotMode(false);
              setError('');
            } else {
              onBack();
            }
          }}
          className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-md border border-slate-200 rounded-full font-bold text-slate-500 hover:bg-white hover:text-slate-800 transition-all shadow-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </motion.button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10 w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border-4 border-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.1)] text-center relative"
        >
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter uppercase drop-shadow-sm pb-2">
              {isForgotMode ? (
                 <>Password <span className="text-brand-primary italic">Reset</span></>
              ) : (
                 <>Welcome <span className="text-brand-primary italic">Back</span></>
              )}
            </h1>
            <p className="text-slate-500 font-bold">
              {isForgotMode 
                 ? (forgotStep === 1 ? 'Verify your account details' : 'Create a new password')
                 : 'Sign in to Alpha Decode'}
            </p>
          </div>

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 bg-green-50 text-green-600 border border-green-200 rounded-2xl px-5 py-4 mb-6 text-sm font-bold text-left"
            >
              <span>{successMsg}</span>
            </motion.div>
          )}

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

          {!isForgotMode ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Username</label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pr-12 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setForgotStep(1);
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-brand-primary transition-colors inline-block pt-1"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <motion.button
                    id="login-submit"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#46a302] hover:shadow-[0_8px_15px_rgba(88,204,2,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {loading ? 'SIGNING IN...' : 'LOG IN'}
                    {!loading && <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
                  </motion.button>
                </div>
              </form>

              <p className="text-center text-slate-400 font-bold mt-8">
                Don't have an account?{' '}
                <button onClick={onGoToRegister} className="text-brand-primary hover:text-brand-secondary transition-colors underline decoration-2 underline-offset-4">
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              {forgotStep === 1 ? (
                <form onSubmit={handleForgotStep1} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Enter your registered username"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Enter your registered email"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      disabled={loading || !username || !forgotEmail}
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#46a302] hover:shadow-[0_8px_15px_rgba(88,204,2,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                      {loading ? 'VERIFYING...' : 'VERIFY ACCOUNT'}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotStep2} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Must be at least 6 characters"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pr-12 text-slate-700 placeholder-slate-400 text-base font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm"
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      disabled={loading || newPassword.length < 6}
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-brand-primary text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#46a302] hover:shadow-[0_8px_15px_rgba(88,204,2,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                      {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                    </motion.button>
                  </div>
                </form>
              )}
              
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(false);
                    setError('');
                  }}
                  className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Cancel and return to Login
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
