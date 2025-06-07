import { Loader2, Sparkles } from 'lucide-react';

import React from 'react';

const LoadingComponent = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950/90 via-purple-950/70 to-slate-900/90 backdrop-blur-sm">
            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/70 border border-purple-500/20 shadow-2xl shadow-purple-900/30">
                {/* Glowing animated gradient ring */}
                <span className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-purple-700 blur-2xl opacity-60 animate-pulse z-0" />
                <Sparkles className="relative z-10 w-8 h-8 text-cyan-300 mb-2 animate-pulse" />
                <Loader2 className="relative z-10 w-12 h-12 text-cyan-300 animate-spin" strokeWidth={3} />
                <div className="relative z-10 mt-6 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    Loading AI Course Generator...
                </div>
            </div>
        </div>
    );
};

export default LoadingComponent;
