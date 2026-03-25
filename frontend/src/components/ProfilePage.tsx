import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Flame, Zap, Edit3, Check, X } from 'lucide-react';
import AchievementsSection from './AchievementsSection';

interface Props {
    authUsername: string | null;
    authToken: string | null;
    onUsernameUpdate: (newUsername: string, newToken: string) => void;
}

interface UserProfile {
    username: string;
    role: string;
    level: number;
    xp: number;
    maxUnlockedLessonIndex: number;
    streak: number;
}

const XP_PER_LEVEL = 20;
const TOTAL_LESSONS = 20;

const ProfilePage = ({ authUsername, authToken, onUsernameUpdate }: Props) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [fetchError, setFetchError] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (!authToken) return;
        fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${authToken}` },
        })
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then((data: UserProfile) => setProfile(data))
            .catch(() => setFetchError(true));
    }, [authToken, authUsername]);

    if (fetchError) return (
        <div className="flex items-center justify-center py-20">
            <div className="text-lg font-black text-slate-400">Failed to load profile. Please refresh the page.</div>
        </div>
    );

    if (!profile) return (
        <div className="flex items-center justify-center py-20">
            <div className="text-2xl font-black text-slate-300 animate-pulse">Loading...</div>
        </div>
    );

    const lessonsCompleted = Math.min(profile.maxUnlockedLessonIndex, TOTAL_LESSONS);
    const xpProgress = profile.xp % XP_PER_LEVEL;
    const xpForNext = XP_PER_LEVEL;
    const progressPct = Math.min((xpProgress / xpForNext) * 100, 100);

    const handleEditSave = async () => {
        if (!newUsername.trim()) { setSaveError('Username cannot be empty'); return; }
        setSaving(true);
        setSaveError('');
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ username: newUsername.trim() }),
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(prev => prev ? { ...prev, username: data.username } : prev);
                onUsernameUpdate(data.username, data.token);
                setEditingName(false);
            } else {
                const msg = await res.text();
                setSaveError(msg || 'Failed to update username');
            }
        } catch {
            setSaveError('Network error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        setPasswordError('');
        setPasswordSuccess('');
        if (!currentPassword || !newPassword) { setPasswordError('Both fields are required'); return; }
        setSavingPassword(true);
        try {
            const res = await fetch('/api/auth/password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            if (res.ok) {
                setPasswordSuccess('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setShowPasswordForm(false);
            } else {
                const msg = await res.text();
                setPasswordError(msg || 'Failed to update password');
            }
        } catch {
            setPasswordError('Network error');
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6"
            >
                {/* Avatar + name */}
                <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-4xl font-black shadow-lg select-none">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        {editingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={newUsername}
                                    onChange={e => setNewUsername(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditingName(false); }}
                                    className="flex-1 border-2 border-brand-primary rounded-xl px-3 py-1.5 font-black text-lg outline-none"
                                    maxLength={30}
                                    autoFocus
                                />
                                <button onClick={handleEditSave} disabled={saving} className="text-green-500 hover:text-green-600">
                                    <Check size={20} />
                                </button>
                                <button onClick={() => { setEditingName(false); setSaveError(''); }} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-black text-slate-900 truncate">{profile.username}</h2>
                                <button
                                    onClick={() => { setNewUsername(profile.username); setEditingName(true); }}
                                    className="text-slate-300 hover:text-brand-primary transition-colors shrink-0"
                                >
                                    <Edit3 size={16} />
                                </button>
                            </div>
                        )}
                        {saveError && <p className="text-xs text-red-500 font-bold mt-1">{saveError}</p>}
                        <p className="text-sm font-bold text-slate-400 capitalize mt-0.5">{profile.role.toLowerCase()}</p>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-4 text-center">
                        <Star size={20} className="text-brand-yellow mx-auto mb-1" fill="currentColor" />
                        <p className="text-2xl font-black text-slate-900">{profile.xp}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Stars</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
                        <Flame size={20} className="text-orange-500 mx-auto mb-1" fill="currentColor" />
                        <p className="text-2xl font-black text-slate-900">{profile.streak}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Streak</p>
                    </div>
                    <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-2xl p-4 text-center">
                        <Zap size={20} className="text-brand-accent mx-auto mb-1" />
                        <p className="text-2xl font-black text-slate-900">LVL {profile.level}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Level</p>
                    </div>
                </div>

                {/* XP progress bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wide mb-2">
                        <span>XP Progress</span>
                        <span>{xpProgress}/{xpForNext} to next milestone</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-brand-primary rounded-full"
                        />
                    </div>
                </div>

                {/* Lessons progress */}
                <div>
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wide mb-3">
                        <span>Lesson Progress</span>
                        <span>{lessonsCompleted}/{TOTAL_LESSONS} completed</span>
                    </div>
                    <div className="flex gap-1.5">
                        {Array.from({ length: TOTAL_LESSONS }, (_, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-2.5 rounded-full transition-all ${i < lessonsCompleted ? 'bg-brand-primary' : 'bg-slate-100'}`}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Password Change */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-wide">Change Password</h3>
                    <button
                        onClick={() => { setShowPasswordForm(v => !v); setPasswordError(''); setPasswordSuccess(''); }}
                        className="text-xs font-bold text-brand-primary hover:underline"
                    >
                        {showPasswordForm ? 'Cancel' : 'Change'}
                    </button>
                </div>
                {passwordSuccess && !showPasswordForm && (
                    <p className="text-xs text-green-600 font-bold mt-2">{passwordSuccess}</p>
                )}
                {showPasswordForm && (
                    <div className="mt-4 space-y-3">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-brand-primary"
                        />
                        <input
                            type="password"
                            placeholder="New password (min 6 characters)"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handlePasswordSave(); }}
                            className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-brand-primary"
                        />
                        {passwordError && <p className="text-xs text-red-500 font-bold">{passwordError}</p>}
                        <div className="flex gap-2">
                            <button
                                onClick={handlePasswordSave}
                                disabled={savingPassword}
                                className="flex items-center gap-1.5 text-green-500 hover:text-green-600 font-bold text-sm"
                            >
                                <Check size={16} /> Save
                            </button>
                            <button
                                onClick={() => { setShowPasswordForm(false); setPasswordError(''); }}
                                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 font-bold text-sm"
                            >
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Achievements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6"
            >
                <AchievementsSection />
            </motion.div>
        </div>
    );
};

export default ProfilePage;
