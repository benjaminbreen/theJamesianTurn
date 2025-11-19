
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const DonationModal = () => {
    const { isDonationModalOpen, closeDonationModal, llmCallCount } = useGame();
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    if (!isDonationModalOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                onClick={closeDonationModal}
            >
                <motion.div
                    initial={isChronoscope ? { scaleY: 0, opacity: 0 } : { rotateX: 90, opacity: 0 }}
                    animate={isChronoscope ? { scaleY: 1, opacity: 1 } : { rotateX: 0, opacity: 1 }}
                    exit={isChronoscope ? { scaleY: 0, opacity: 0 } : { rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.4, ease: isChronoscope ? "circOut" : "easeInOut" }}
                    className={`w-full max-w-lg p-10 shadow-2xl relative overflow-hidden ${
                        isChronoscope
                        ? 'bg-slate-900 border-2 border-cyan-500 text-cyan-100'
                        : 'bg-[#fdf6e3] text-[#2b2520] border-4 double-border border-[#5c4033]'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="text-center mb-6 relative z-10">
                        <div className="text-4xl mb-4">📜</div>
                        <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Support This Experience</h2>
                        <div className={`h-px w-1/2 mx-auto ${isChronoscope ? 'bg-cyan-500' : 'bg-[#5c4033]'}`}></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 relative z-10">
                        <p className={`text-center ${isChronoscope ? 'font-mono text-sm' : 'font-serif text-base italic'}`}>
                            You have made <span className="font-bold text-amber-500">{llmCallCount}</span> AI-powered interactions in this session. The Jamesian Turn relies on API costs and hosting to function.
                        </p>

                        <p className={`text-center ${isChronoscope ? 'font-mono text-sm' : 'font-serif text-base italic'}`}>
                            If you're enjoying your time at the 1889 World's Fair and wish to support continued development, please consider subscribing to Res Obscura, my newsletter about history and the imagination.
                        </p>

                        {/* CTA Button */}
                        <div className="flex justify-center pt-4">
                            <a
                                href="https://resobscura.substack.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-8 py-3 text-sm font-bold uppercase border-2 transition-all inline-block ${
                                    isChronoscope
                                    ? 'border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-900'
                                    : 'border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-[#fdf6e3]'
                                }`}
                            >
                                Subscribe to Res Obscura
                            </a>
                        </div>

                        {/* Info */}
                        <p className={`text-center text-xs opacity-70 pt-4 ${isChronoscope ? 'font-mono' : 'font-serif'}`}>
                            Your subscription directly supports the API costs and hosting that make this narrative experience possible.
                        </p>
                    </div>

                    {/* Close Button */}
                    <div className="mt-8 text-center relative z-10">
                        <button
                            onClick={closeDonationModal}
                            className={`px-8 py-2 font-bold uppercase tracking-widest transition-transform hover:scale-105 ${
                                isChronoscope ? 'text-cyan-400 hover:text-white' : 'text-[#5c4033] hover:text-[#8b0000]'
                            }`}
                        >
                            Continue Playing
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
