
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PERSONAS } from '../../lib/personas';
import { motion, AnimatePresence } from 'framer-motion';
import SvgPortrait from '../visuals/SvgPortrait';

export const DialogueOverlay = () => {
  const { dialogueState, sendDialogue, closeDialogue, rumors, startCombat } = useGame();
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';
  
  const [input, setInput] = useState('');
  const [tone, setTone] = useState(50); // 0 = Snide, 100 = Polite
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [dialogueState.history]);

  if (!dialogueState.isOpen || !dialogueState.npcId) return null;

  const npc = PERSONAS.find(p => p.id === dialogueState.npcId);

  console.log('DialogueOverlay - NPC:', npc);
  console.log('DialogueOverlay - NPC Portrait Archetype:', npc?.portraitArchetype);

  const handleSend = () => {
      if (!input.trim()) return;
      const toneStr = tone < 30 ? 'Snide' : tone > 70 ? 'Polite' : 'Neutral';
      sendDialogue(input, toneStr);
      setInput('');
  };

  const handleChallenge = () => {
      console.log('Challenge button clicked, NPC:', npc);
      if (npc) {
          startCombat(npc.id);
      }
  };

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute inset-4 z-50 flex flex-col shadow-2xl ${
                isChronoscope 
                ? 'bg-slate-900/95 border border-amber-500 text-amber-100' 
                : 'bg-[#fffdf5] border-4 double-border border-[#5c4033] text-[#2b2520]'
            }`}
        >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center border-b ${
                isChronoscope ? 'border-amber-500/30' : 'border-[#5c4033]/20'
            }`}>
                <div className="flex items-center gap-4">
                    {npc?.portraitArchetype ? (
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 border-gold-600">
                            <SvgPortrait archetype={npc.portraitArchetype} size="md" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 shrink-0 rounded-lg bg-gray-300 flex items-center justify-center text-xs">
                            No Portrait
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold">{npc?.name}</h2>
                        <p className="text-xs opacity-70">{npc?.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleChallenge}
                        disabled={!npc}
                        className={`px-3 py-1 text-xs font-bold uppercase border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isChronoscope
                            ? 'border-red-500 text-red-500 hover:bg-red-500/20'
                            : 'border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000] hover:text-white'
                        }`}
                    >
                        Challenge
                    </button>
                    <button onClick={closeDialogue} className="opacity-50 hover:opacity-100 text-xl">×</button>
                </div>
            </div>

            {/* Chat History */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {dialogueState.history.map((msg, i) => (
                    <div key={i} className={`flex ${msg.speaker === 'PLAYER' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded ${
                            msg.speaker === 'PLAYER'
                                ? (isChronoscope ? 'bg-cyan-900/30 text-cyan-100' : 'bg-[#eaddcf] text-[#2b2520]')
                                : (isChronoscope ? 'bg-amber-900/20 text-amber-100' : 'bg-white border border-[#5c4033]/10')
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className={`p-4 border-t ${isChronoscope ? 'border-amber-500/30' : 'border-[#5c4033]/20'}`}>
                {/* Tone Slider */}
                <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-wider">
                    <span>Snide</span>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={tone} 
                        onChange={(e) => setTone(parseInt(e.target.value))}
                        className="flex-1 h-1 bg-gray-500 rounded appearance-none cursor-pointer"
                    />
                    <span>Polite</span>
                </div>

                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Speak your mind..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className={`flex-1 p-2 outline-none ${
                            isChronoscope 
                                ? 'bg-slate-800 border border-slate-600 focus:border-amber-500' 
                                : 'bg-white border border-[#5c4033]/30 focus:border-[#5c4033]'
                        }`}
                    />
                    <button 
                        onClick={handleSend}
                        className={`px-6 py-2 font-bold uppercase ${
                            isChronoscope 
                                ? 'bg-amber-600 hover:bg-amber-500 text-slate-900' 
                                : 'bg-[#5c4033] text-[#fffdf5] hover:bg-[#3e2723]'
                        }`}
                    >
                        Speak
                    </button>
                </div>
                
                {/* Rumors (Quick Insert) */}
                {rumors.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                        {rumors.map(r => (
                            <button 
                                key={r.id}
                                onClick={() => setInput(`Did you hear? ${r.text}`)}
                                className={`whitespace-nowrap text-[10px] px-2 py-1 border rounded ${
                                    isChronoscope ? 'border-cyan-500/50 text-cyan-400' : 'border-[#8b0000]/30 text-[#8b0000]'
                                }`}
                            >
                                {r.source}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
