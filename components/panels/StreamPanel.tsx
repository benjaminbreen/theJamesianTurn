
import React, { useEffect, useRef } from 'react';
import { useGame } from '../../contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

export const StreamPanel = () => {
  const { gameLog } = useGame();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameLog]);

  return (
    <div className="p-6 space-y-6 font-serif">
        <AnimatePresence>
        {gameLog.map((entry) => (
          <motion.div 
            key={entry.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`p-4 shadow-sm border-l-4 ${
            entry.source === 'SYSTEM' 
                ? 'border-gray-300 text-gray-500 italic text-xs bg-white'
                : entry.source === 'COMBAT'
                ? 'border-victorian-red bg-red-50/30 text-[#2b2520] text-sm'
                : 'border-[#d4af37] bg-[#fffdf5] text-[#1a1614] text-base leading-relaxed'
          }`}>
            {entry.source !== 'SYSTEM' && (
                <span className="opacity-40 text-[10px] block mb-2 uppercase tracking-widest font-sans font-bold flex justify-between">
                    <span>{entry.source}</span>
                    <span>{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </span>
            )}
            {entry.text}
          </motion.div>
        ))}
        </AnimatePresence>
        <div ref={endRef} />
    </div>
  );
};
