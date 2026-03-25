

interface Props {
    authToken: string | null;
    authUsername: string | null;
    profilePic: string | null;
}

export default function Header({ authToken, authUsername, profilePic }: Props) {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Alpha Decode" className="w-8 h-8" />
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        Alpha <span className="text-green-500">Decode</span>
                    </h1>
                </div>

                {/* Stats */}
                {/* Center stats - Removed as per user request */}
                <div className="hidden md:flex flex-1 items-center justify-center gap-8">
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Auth */}
                    {authToken ? (
                        <div className="flex items-center gap-2 bg-slate-100 pl-1.5 pr-4 py-1.5 rounded-xl text-sm font-bold text-slate-700 select-none border border-slate-200 shadow-sm">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                {profilePic ? (
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
                            <span>{authUsername}</span>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};
