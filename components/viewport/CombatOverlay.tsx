
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { COMBAT_MOVES } from '../../lib/combat';

export const CombatOverlay = () => {
  const { combatPhase, playerStats, combatOpponent, executeCombatMove, endCombat } = useGame();
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';

  if (combatPhase === 'IDLE' || !combatOpponent) return null;

  const isTurn = combatPhase === 'PLAYER_CHOICE';

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            <div className={`w-full max-w-2xl p-8 flex flex-col gap-8 relative ${
                isChronoscope 
                    ? 'bg-slate-900/90 border-2 border-red-500/50 text-amber-100 shadow-[0_0_50px_rgba(239,68,68,0.2)]' 
                    : 'bg-[#fffdf5] border-4 border-double border-[#8b0000] text-[#2b2520] p-12'
            }`}>
                
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className={`text-2xl font-bold uppercase tracking-widest ${
                        isChronoscope ? 'text-red-500' : 'text-[#8b0000]'
                    }`}>
                        War of Wits
                    </h1>
                </div>

                {/* Battle Stage */}
                <div className="flex justify-between items-center w-full">
                    {/* Player Stats */}
                    <div className="text-center w-1/3">
                        <h2 className="font-bold text-lg mb-2">Henry James</h2>
                        <div className={`h-4 w-full ${isChronoscope ? 'bg-slate-800' : 'bg-gray-300'} relative`}>
                             <div 
                                className={`h-full transition-all duration-500 ${isChronoscope ? 'bg-amber-500' : 'bg-blue-800'}`}
                                style={{ width: `${(playerStats.composure / playerStats.maxComposure) * 100}%` }}
                             />
                        </div>
                        <span className="text-xs mt-1 block">Composure: {playerStats.composure}</span>
                    </div>

                    <div className="text-2xl font-bold opacity-50">VS</div>

                    {/* Opponent Stats */}
                    <div className="text-center w-1/3">
                        <h2 className="font-bold text-lg mb-2">{combatOpponent.name}</h2>
                        <div className={`h-4 w-full ${isChronoscope ? 'bg-slate-800' : 'bg-gray-300'} relative`}>
                             <div 
                                className={`h-full transition-all duration-500 ${isChronoscope ? 'bg-red-500' : 'bg-[#8b0000]'}`}
                                style={{ width: `${(combatOpponent.stats.composure / 100) * 100}%` }} // Assuming 100 max for NPC
                             />
                        </div>
                        <span className="text-xs mt-1 block">Composure: {combatOpponent.stats.composure}</span>
                    </div>
                </div>

                {/* Action Area */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    {COMBAT_MOVES.map(move => (
                        <button
                            key={move.id}
                            disabled={!isTurn}
                            onClick={() => executeCombatMove(move.id)}
                            className={`p-4 border text-left transition-all relative overflow-hidden group ${
                                isChronoscope 
                                    ? 'border-amber-500/30 hover:bg-amber-500/10 disabled:opacity-30 disabled:hover:bg-transparent' 
                                    : 'border-[#5c4033] hover:bg-[#5c4033] hover:text-[#fffdf5] disabled:opacity-50'
                            }`}
                        >
                            <div className="font-bold text-sm mb-1">{move.name}</div>
                            <div className="text-[10px] opacity-70">{move.description}</div>
                            {isTurn && isChronoscope && (
                                <div className="absolute inset-0 bg-amber-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Phase Indicator */}
                <div className="text-center text-xs opacity-50 mt-4 uppercase">
                    {combatPhase === 'PLAYER_CHOICE' ? 'Your Turn' : 'Opponent Thinking...'}
                </div>

                {/* Victory/Defeat Overlays */}
                {combatPhase === 'VICTORY' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
                        <div className="text-4xl font-bold text-green-500 uppercase">Victory</div>
                    </div>
                )}
                 {combatPhase === 'DEFEAT' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
                        <div className="text-4xl font-bold text-red-500 uppercase">Humiliation</div>
                    </div>
                )}

                {/* Exit (Debug/Fallback) */}
                <button onClick={() => endCombat()} className="absolute top-2 right-2 text-xs opacity-30 hover:opacity-100">
                    Flee
                </button>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
