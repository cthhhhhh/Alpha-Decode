import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Zap, Edit3, Check, X, Shield, AlertCircle, LogOut } from 'lucide-react';
import AchievementsSection from './AchievementsSection';
import Avatar from './avatar/Avatar';

interface Props {
    authUsername: string | null;
    authToken: string | null;
    faceId?: string | null;
    bodyTypeId?: string | null;
    hairId?: string | null;
    equippedOutfitId?: number | null;
    equippedPetId?: number | null;
    itemAssetMap?: Record<number, string>;
    onUsernameUpdate: (newUsername: string, newToken: string) => void;
    onLogout: () => void;
}

interface UserProfile {
    username: string;
    role: string;
    level: number;
    coins: number;
    maxUnlockedLessonIndex: number;
    streak: number;
}

const XP_PER_LEVEL = 50;
const TOTAL_LESSONS = 20;

const ProfilePage = ({ authUsername, authToken, faceId, bodyTypeId, hairId, equippedOutfitId, equippedPetId, itemAssetMap = {}, onUsernameUpdate, onLogout }: Props) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [fetchError, setFetchError] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [deleteError, setDeleteError] = useState('');

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

    const lessonsCompleted = profile.role === 'ADMIN' ? TOTAL_LESSONS : Math.min(profile.maxUnlockedLessonIndex, TOTAL_LESSONS);
    const xpProgress = profile.coins % XP_PER_LEVEL;
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

    const handleDeleteAccount = async () => {
        setDeletingAccount(true);
        setDeleteError('');
        try {
            const res = await fetch('/api/auth/me', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (res.ok) {
                // Logout the user
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                window.location.href = '/';
            } else {
                const msg = await res.text();
                setDeleteError(msg || 'Failed to delete account');
            }
        } catch {
            setDeleteError('Network error');
        } finally {
            setDeletingAccount(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border-2 border-slate-100 p-6"
            >
                {/* Avatar + name */}
                <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 shrink-0">
                        {faceId ? (
                            <Avatar
                                faceId={faceId}
                                bodyTypeId={bodyTypeId}
                                hairId={hairId}
                                outfitAssetId={equippedOutfitId ? itemAssetMap[equippedOutfitId] : null}
                                petAssetId={equippedPetId ? itemAssetMap[equippedPetId] : null}
                                size="md"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-4xl font-black shadow-lg select-none">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                        )}
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
                <div className="grid grid-cols-2 gap-3 mb-6">
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

                {/* Coins progress bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wide mb-2">
                        <span>Coins Progress</span>
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
                className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden"
            >
                <div 
                    onClick={() => { setShowPasswordForm(v => !v); setPasswordError(''); setPasswordSuccess(''); }}
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                             <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900">Security Settings</h3>
                            <p className="text-xs font-bold text-slate-400">Manage your password and account security</p>
                        </div>
                    </div>
                    <button className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 transition-all ${showPasswordForm ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'}`}>
                        {showPasswordForm ? 'Close' : 'Update'}
                    </button>
                </div>

                <AnimatePresence>
                    {showPasswordForm && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-slate-50 border-t-2 border-slate-100 overflow-hidden"
                        >
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter old password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-brand-primary transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Min 6 characters"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handlePasswordSave(); }}
                                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-brand-primary transition-colors"
                                        />
                                    </div>
                                </div>
                                
                                {passwordError && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-500 font-bold text-xs bg-red-50 p-3 rounded-xl border border-red-100">
                                        <AlertCircle size={14} />
                                        {passwordError}
                                    </motion.div>
                                )}
                                
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handlePasswordSave}
                                        disabled={savingPassword}
                                        className="flex-1 bg-brand-primary text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {savingPassword ? "Updating..." : "Save New Password"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {passwordSuccess && !showPasswordForm && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-6 mb-6 p-4 rounded-2xl bg-green-50 text-green-600 border border-green-100 flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                            <Check size={16} />
                        </div>
                        <p className="text-sm font-black">{passwordSuccess}</p>
                     </motion.div>
                )}

                <div className="px-6 pb-6">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 py-3 rounded-2xl font-black text-sm transition-all border-2 border-transparent hover:border-red-100"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
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

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-red-50 rounded-3xl border-2 border-red-100 p-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-red-900">Danger Zone</h3>
                        <p className="text-xs font-bold text-red-400">Permanently delete your account and all data</p>
                    </div>
                </div>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full bg-white text-red-500 border-2 border-red-100 py-3 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                    >
                        Delete My Account
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-red-100">
                            <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                Are you absolutely sure? This action <span className="text-red-600 underline">cannot be undone</span>. 
                                You will lose your streak, achievements, and all progress.
                            </p>
                        </div>
                        
                        {deleteError && (
                            <p className="text-xs text-red-500 font-bold">{deleteError}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount}
                                className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {deletingAccount ? "Deleting..." : "Yes, Delete Account"}
                            </button>
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setDeleteError(''); }}
                                disabled={deletingAccount}
                                className="flex-1 bg-slate-200 text-slate-600 py-3 rounded-2xl font-black text-sm hover:bg-slate-300 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ProfilePage;
