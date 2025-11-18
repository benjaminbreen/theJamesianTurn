
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const HoverInfo = () => {
    const { hoverInfo } = useGame();
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    if (!hoverInfo) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 10, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute bottom-4 left-4 z-50 p-3 min-w-[200px] max-w-[250px] backdrop-blur-md shadow-xl border-l-2 ${
                    isChronoscope 
                        ? 'bg-slate-900/80 border-cyan-500 text-cyan-100' 
                        : 'bg-[#fffdf5]/90 border-[#8b0000] text-[#2b2520]'
                }`}
            >
                <div className="flex items-center gap-2 mb-1">
                    {hoverInfo.icon && <span className="text-xl">{hoverInfo.icon}</span>}
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${
                        isChronoscope ? 'text-white' : 'text-[#8b0000]'
                    }`}>
                        {hoverInfo.title}
                    </h3>
                </div>
                
                <div className={`text-[10px] uppercase tracking-widest mb-2 opacity-60 ${
                    isChronoscope ? 'text-amber-500' : 'text-[#5c4033]'
                }`}>
                    {hoverInfo.type}
                </div>

                <p className={`text-xs leading-tight ${
                    isChronoscope ? 'font-mono' : 'font-serif italic'
                }`}>
                    {hoverInfo.description}
                </p>
            </motion.div>
        </AnimatePresence>
    );
};
