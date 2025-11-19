
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsOverlay = () => {
    const { isSettingsOpen, toggleSettings, volume, setVolume, textSpeed, setTextSpeed, llmCallCount, openDonationModal } = useGame();
    const { theme, toggleTheme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    const handleDonateClick = () => {
        toggleSettings(); // Close settings first
        openDonationModal(); // Open donation modal
    };

    if (!isSettingsOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={toggleSettings}
            >
                <motion.div 
                    initial={isChronoscope ? { scaleY: 0, opacity: 0 } : { rotateX: 90, opacity: 0 }}
                    animate={isChronoscope ? { scaleY: 1, opacity: 1 } : { rotateX: 0, opacity: 1 }}
                    exit={isChronoscope ? { scaleY: 0, opacity: 0 } : { rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.4, ease: isChronoscope ? "circOut" : "easeInOut" }}
                    className={`w-full max-w-md p-8 shadow-2xl relative overflow-hidden ${
                        isChronoscope 
                        ? 'bg-slate-900 border border-cyan-500 text-cyan-100' 
                        : 'bg-[#fdf6e3] text-[#2b2520] border-4 double-border border-[#5c4033]'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest">System Configuration</h2>
                        <div className={`h-px w-1/2 mx-auto mt-2 ${isChronoscope ? 'bg-cyan-500' : 'bg-[#5c4033]'}`}></div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-8 relative z-10">
                        
                        {/* Volume Control */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs uppercase font-bold tracking-wider opacity-70">
                                <span>Master Volume</span>
                                <span>{Math.round(volume * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="1" step="0.05" 
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                                    isChronoscope ? 'bg-slate-700 accent-cyan-500' : 'bg-[#d7ccc8] accent-[#8b0000]'
                                }`}
                            />
                        </div>

                        {/* Theme Toggle */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold uppercase tracking-wider">Visual Interface</span>
                            <button
                                onClick={toggleTheme}
                                className={`px-4 py-2 text-xs font-bold uppercase border transition-all ${
                                    isChronoscope
                                    ? 'border-cyan-500 text-cyan-500 hover:bg-cyan-500/20'
                                    : 'border-[#5c4033] text-[#5c4033] hover:bg-[#5c4033] hover:text-[#fdf6e3]'
                                }`}
                            >
                                {isChronoscope ? 'Switch to Gaslight' : 'Switch to Chronoscope'}
                            </button>
                        </div>

                        {/* Donate Button */}
                        <div className={`pt-4 border-t ${isChronoscope ? 'border-cyan-500/30' : 'border-[#5c4033]/20'}`}>
                            <div className="text-center">
                                <div className="mb-3">
                                    <span className={`text-xs uppercase tracking-wider ${isChronoscope ? 'text-amber-500' : 'text-[#8b0000]'}`}>
                                        AI Calls This Session: {llmCallCount}
                                    </span>
                                </div>
                                <button
                                    onClick={handleDonateClick}
                                    className={`px-6 py-2 text-sm font-bold uppercase border-2 transition-all w-full ${
                                        isChronoscope
                                        ? 'border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-900'
                                        : 'border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-[#fdf6e3]'
                                    }`}
                                >
                                    💝 Support This Project
                                </button>
                                <p className={`text-[10px] mt-2 opacity-60 ${isChronoscope ? 'font-mono' : 'font-serif italic'}`}>
                                    Help cover API and hosting costs
                                </p>
                            </div>
                        </div>

                         {/* Text Speed (Flavor Only mostly) */}
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-bold uppercase tracking-wider">Narrative Speed</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTextSpeed('SLOW')}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase border ${
                                        textSpeed === 'SLOW'
                                            ? (isChronoscope ? 'bg-cyan-500 text-slate-900' : 'bg-[#5c4033] text-[#fdf6e3]')
                                            : 'border-gray-500 opacity-50'
                                    }`}
                                >
                                    Slow
                                </button>
                                <button
                                    onClick={() => setTextSpeed('FAST')}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase border ${
                                        textSpeed === 'FAST'
                                            ? (isChronoscope ? 'bg-cyan-500 text-slate-900' : 'bg-[#5c4033] text-[#fdf6e3]')
                                            : 'border-gray-500 opacity-50'
                                    }`}
                                >
                                    Fast
                                </button>
                            </div>
                        </div>

                        {/* Controls Guide */}
                        <div className="pt-4 border-t border-current opacity-30">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Controls</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="opacity-70">Movement</span>
                                    <span className="font-mono font-bold">Arrow Keys / WASD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-70">Interact</span>
                                    <span className="font-mono font-bold">Space (Tap)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-70">Eavesdrop</span>
                                    <span className="font-mono font-bold">Space (Hold)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-70">Inventory</span>
                                    <span className="font-mono font-bold">I Key / Click Button</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center relative z-10">
                        <button 
                            onClick={toggleSettings}
                            className={`px-8 py-2 font-bold uppercase tracking-widest transition-transform hover:scale-105 ${
                                isChronoscope ? 'text-cyan-400 hover:text-white' : 'text-[#8b0000] hover:text-[#5c0000]'
                            }`}
                        >
                            Close
                        </button>
                    </div>

                    {/* Background Decor */}
                    {isChronoscope && (
                        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />
                    )}
                    {!isChronoscope && (
                        <div className="absolute inset-0 bg-[radial-gradient(#5c4033_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
                    )}

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
