
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastLayer = () => {
    const { notifications } = useGame();
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    return (
        <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center pointer-events-none z-50 gap-2 px-4">
            <AnimatePresence>
                {notifications.slice(-3).map((note) => (
                    <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
                        className={`max-w-lg w-full p-4 shadow-lg backdrop-blur-sm border-l-4 pointer-events-auto transition-all ${
                            isChronoscope 
                                ? 'bg-slate-900/90 text-amber-100 border-amber-500' 
                                : 'bg-[#fffdf5]/95 text-[#2b2520] border-[#8b0000]'
                        } ${note.type === 'THOUGHT' ? 'italic' : ''}`}
                    >
                        <div className="flex items-start gap-3">
                             <div className={`mt-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                 note.type === 'ALERT' ? (isChronoscope ? 'bg-red-900 text-red-200' : 'bg-[#8b0000] text-white') :
                                 note.type === 'THOUGHT' ? (isChronoscope ? 'bg-purple-900 text-purple-200' : 'bg-[#4a4a4a] text-white') :
                                 note.type === 'ITEM' ? (isChronoscope ? 'bg-cyan-900 text-cyan-200' : 'bg-[#2f4f4f] text-white') :
                                 (isChronoscope ? 'bg-amber-900 text-amber-200' : 'bg-[#d4af37] text-white')
                             }`}>
                                 {note.type}
                             </div>
                             <div className={`text-sm leading-tight ${note.type === 'THOUGHT' ? 'font-serif opacity-90' : 'font-bold'}`}>
                                 {note.text}
                             </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
