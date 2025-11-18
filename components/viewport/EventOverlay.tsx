
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const EventOverlay = () => {
  const { eventState, resolveEvent } = useGame();
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';

  if (!eventState) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
        >
            <div className={`max-w-lg w-full p-10 flex flex-col gap-8 relative shadow-2xl ${
                isChronoscope 
                    ? 'bg-slate-900 border border-amber-500 text-amber-100' 
                    : 'bg-[#fffdf5] border-4 double-border border-[#5c4033] text-[#2b2520]'
            }`}>
                <div className={`text-xs font-bold uppercase tracking-[0.2em] opacity-60 text-center border-b border-current pb-2 ${
                    isChronoscope ? 'text-cyan-400' : 'text-[#8b0000]'
                }`}>
                    A Moment of Note
                </div>

                <h2 className="text-3xl font-bold font-serif text-center">{eventState.title}</h2>
                
                <p className={`text-lg leading-relaxed text-center ${
                    isChronoscope ? 'font-mono text-sm' : 'font-serif italic'
                }`}>
                    {eventState.description}
                </p>

                <div className="flex flex-col gap-4 mt-4">
                    {eventState.choices.map(choice => (
                        <button
                            key={choice.id}
                            onClick={() => resolveEvent(choice)}
                            className={`p-5 text-center transition-all border hover:scale-[1.02] active:scale-[0.98] ${
                                isChronoscope 
                                    ? 'border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500' 
                                    : 'border-[#5c4033]/30 hover:bg-[#5c4033] hover:text-[#fffdf5] shadow-sm hover:shadow-md'
                            }`}
                        >
                            <span className="font-bold text-sm uppercase tracking-wider">{choice.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
