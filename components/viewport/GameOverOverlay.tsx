
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AsciiPortrait } from '../visuals/AsciiPortrait';

export const GameOverOverlay = () => {
    const { lifecycle, gameSummary, endGame } = useGame();
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    if (lifecycle !== 'ENDED' || !gameSummary) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 text-[#fdfbf7] font-serif p-8 overflow-y-auto"
        >
            <div className="max-w-4xl w-full flex flex-col gap-8 relative">
                {/* Header */}
                <div className="text-center border-b border-[#8b0000] pb-6">
                    <h1 className="text-5xl font-bold text-[#8b0000] mb-2">The Final Assessment</h1>
                    <p className="text-xl italic opacity-60">"One can never know too much, but one can certainly say too much."</p>
                </div>

                <div className="flex gap-8">
                    {/* Score Card */}
                    <div className="w-1/3 bg-[#1a1614] p-6 border border-[#5c4033] flex flex-col items-center">
                        <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-[#d4af37] bg-white flex items-center justify-center">
                             <AsciiPortrait id="HENRY_JAMES" className="scale-150 text-black" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#d4af37] mb-1 text-center">{gameSummary.titleAwarded}</h2>
                        <div className="w-full h-px bg-[#5c4033] my-4"></div>
                        
                        <div className="w-full space-y-4">
                            <div>
                                <div className="flex justify-between text-xs uppercase tracking-widest mb-1">Subtlety</div>
                                <div className="h-2 bg-[#2f4f4f] w-full"><div className="h-full bg-[#d4af37]" style={{ width: `${gameSummary.score.subtlety}%` }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs uppercase tracking-widest mb-1">Verbosity</div>
                                <div className="h-2 bg-[#2f4f4f] w-full"><div className="h-full bg-[#d4af37]" style={{ width: `${gameSummary.score.verbosity}%` }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs uppercase tracking-widest mb-1">Social Standing</div>
                                <div className="h-2 bg-[#2f4f4f] w-full"><div className="h-full bg-[#d4af37]" style={{ width: `${gameSummary.score.socialStanding}%` }}></div></div>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-6xl font-bold text-[#fdfbf7]">{gameSummary.score.total}</div>
                        <div className="text-xs uppercase tracking-widest opacity-50">Total Score</div>
                    </div>

                    {/* The Review */}
                    <div className="flex-1 bg-[#fdf6e3] text-[#2b2520] p-8 border-4 double-border border-[#8b0000] relative shadow-2xl transform rotate-1">
                        <div className="absolute -top-3 -left-3 bg-[#8b0000] text-white px-4 py-1 text-xs font-bold uppercase">The Review</div>
                        <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
                            {gameSummary.review}
                        </div>
                        <div className="mt-8 text-right font-bold text-[#8b0000] italic">
                            — The Observer, October 1889
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-[#8b0000] text-white font-bold uppercase tracking-widest hover:bg-[#5c0000] transition-all border border-[#d4af37]"
                    >
                        Attempt Another Turn
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
