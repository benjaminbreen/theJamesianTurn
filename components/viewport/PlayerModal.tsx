
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AsciiPortrait } from '../visuals/AsciiPortrait';
import { motion, AnimatePresence } from 'framer-motion';

export const PlayerModal = () => {
    const { isPlayerModalOpen, togglePlayerModal, playerStats, playerProfile, gameTime } = useGame();
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    if (!isPlayerModalOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={togglePlayerModal} // Close on click outside
            >
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`max-w-4xl w-full max-h-[90vh] flex shadow-2xl overflow-hidden ${
                        isChronoscope 
                        ? 'bg-slate-900 border border-amber-500 text-amber-100' 
                        : 'bg-[#fdf6e3] text-[#2b2520] border-4 double-border border-[#5c4033]'
                    }`}
                    onClick={(e) => e.stopPropagation()} // Prevent close on click inside
                >
                    {/* Left: Portrait & Basic Stats */}
                    <div className={`w-1/3 p-8 flex flex-col items-center justify-center border-r ${
                         isChronoscope ? 'border-amber-500/30 bg-slate-950' : 'border-[#5c4033]/20 bg-[#f7f3e8]'
                    }`}>
                        <div className={`w-40 h-40 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 shadow-lg ${
                            isChronoscope ? 'border-amber-500 bg-black' : 'border-[#d4af37] bg-white'
                        }`}>
                            <AsciiPortrait id="HENRY_JAMES" className="scale-150" />
                        </div>
                        
                        <h2 className="text-3xl font-bold font-serif mb-1">Henry James</h2>
                        <p className="text-sm uppercase tracking-widest opacity-60 mb-8">Man of Letters • Lvl {playerStats.level}</p>

                        <div className="w-full space-y-4">
                            <div>
                                <div className="flex justify-between text-sm uppercase font-bold mb-1">
                                    <span>Composure</span>
                                    <span>{playerStats.composure}/{playerStats.maxComposure}</span>
                                </div>
                                <div className="h-3 bg-black/10 w-full rounded-full overflow-hidden">
                                    <div className={`h-full ${isChronoscope ? 'bg-cyan-500' : 'bg-[#2f4f4f]'}`} style={{ width: `${(playerStats.composure / playerStats.maxComposure) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm uppercase font-bold mb-1">
                                    <span>Experience</span>
                                    <span>{playerStats.xp}</span>
                                </div>
                                <div className="h-3 bg-black/10 w-full rounded-full overflow-hidden">
                                    <div className={`h-full ${isChronoscope ? 'bg-purple-500' : 'bg-[#d4af37]'}`} style={{ width: `${Math.min(100, (playerStats.xp / 1000) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed Profile */}
                    <div className="flex-1 p-8 overflow-y-auto font-serif">
                        <div className="flex justify-between items-center mb-6 border-b border-current opacity-50 pb-2">
                            <h3 className="text-2xl font-bold uppercase tracking-widest">Personal Effects</h3>
                            <button onClick={togglePlayerModal} className="text-3xl hover:scale-110">×</button>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {/* Mental State */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider opacity-70">Current Mental State</h4>
                                <p className="text-xl italic leading-tight">{playerProfile.mentalState}</p>
                            </div>

                             {/* Status Effects */}
                             <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider opacity-70">Conditions</h4>
                                <div className="flex flex-wrap gap-2">
                                    {playerProfile.statusEffects.map((effect, i) => (
                                        <span key={i} className={`px-3 py-1.5 text-sm border rounded ${
                                            isChronoscope ? 'border-red-500 text-red-400' : 'border-[#8b0000] text-[#8b0000] bg-[#fff5f5]'
                                        }`}>
                                            {effect}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Attire */}
                            <div className="col-span-2 space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider opacity-70">Attire</h4>
                                <ul className="list-disc list-inside text-base space-y-1 opacity-90">
                                    {playerProfile.clothing.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Project */}
                            <div className="col-span-2 bg-black/5 p-4 border border-black/10">
                                <h4 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">Current Work in Progress</h4>
                                <p className="text-lg font-bold italic">"{playerProfile.currentProject}"</p>
                                <p className="text-sm mt-2 opacity-60">
                                    Drafting continues amidst the distractions of the fair. Progress is slow.
                                </p>
                            </div>

                            {/* Statistics */}
                            <div className="col-span-2 flex justify-between items-center pt-4 border-t border-current border-opacity-20">
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{playerStats.reputation}</div>
                                    <div className="text-xs uppercase tracking-widest opacity-60">Reputation</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{playerStats.erudition}</div>
                                    <div className="text-xs uppercase tracking-widest opacity-60">Erudition</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{gameTime.getFullYear() - 1843}</div>
                                    <div className="text-xs uppercase tracking-widest opacity-60">Age</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
