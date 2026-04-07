import { useState, useEffect, useRef } from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';
import Avatar from './avatar/Avatar';

interface Props {
    authToken: string | null;
    authUsername: string | null;
    profilePic: string | null;
    faceId?: string | null;
    bodyTypeId?: string | null;
    hairId?: string | null;
    skinColor?: string | null;
    hairColor?: string | null;
    onLogout: () => void;
    onNavigateHome?: () => void;
    onNavigateProfile?: () => void;
}

export default function Header({ authToken, authUsername, profilePic, faceId, bodyTypeId, hairId, skinColor, hairColor, onLogout, onNavigateHome, onNavigateProfile }: Props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <button
                    type="button"
                    onClick={() => onNavigateHome?.()}
                    className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
                    aria-label="Go to home"
                >
                    <img src="/logo.svg" alt="Alpha Decode" className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase">
                        Alpha <span className="text-brand-primary uppercase">Decode</span>
                    </h1>
                </button>

                {/* Stats */}
                {/* Center stats - Removed as per user request */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-8">
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Auth */}
                    {authToken ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(v => !v)}
                                aria-expanded={dropdownOpen}
                                aria-label="Account menu"
                                className="flex items-center gap-2 bg-slate-100 pl-1.5 pr-3 py-1.5 rounded-xl text-sm font-bold text-slate-700 select-none border border-slate-200 shadow-sm hover:bg-slate-200 transition-colors"
                            >
                                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                        {faceId ? (
                                            <Avatar faceId={faceId} bodyTypeId={bodyTypeId} hairId={hairId} skinColor={skinColor} hairColor={hairColor} faceOnly size="sm" />
                                        ) : profilePic ? (
                                            <img
                                                src={profilePic.startsWith('http') ? profilePic : `/avatars/${profilePic}`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-500 via-emerald-600 to-indigo-800 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                                {(authUsername || 'U').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="max-w-[9rem] truncate">{authUsername}</span>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                    <button
                                        onClick={() => { setDropdownOpen(false); onNavigateProfile?.(); }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        <User size={15} />
                                        View profile
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); onLogout(); }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut size={15} />
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};
