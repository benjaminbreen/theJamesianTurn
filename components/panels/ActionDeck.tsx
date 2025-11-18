
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useGame } from '../../contexts/GameContext';

export const ActionDeck = () => {
  const { theme } = useTheme();
  const { toggleInventory, playerStats } = useGame();
  const isChronoscope = theme === 'chronoscope';

  return (
    <div className={`w-full h-full flex flex-col p-2 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-20 relative ${
      isChronoscope 
        ? 'bg-slate-950 text-amber-400 font-mono border-t border-amber-500/30' 
        : 'bg-[#f3e5ab] text-[#2b2520] font-serif border-t-4 border-[#5c4033] double-border'
    }`}>
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex gap-3">
           <button 
             onClick={toggleInventory}
             className={`px-5 py-1.5 text-sm font-bold uppercase transition-all flex items-center gap-2 active:scale-95 ${
             isChronoscope 
               ? 'border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10' 
               : 'border border-[#5c4033] text-[#5c4033] hover:bg-[#5c4033] hover:text-[#f3e5ab] shadow-sm'
           }`}>
             <span className="text-lg">🎒</span> Inventory
           </button>
        </div>
        
        {/* Status Indicators */}
        <div className="flex gap-6 text-xs font-bold uppercase tracking-wider opacity-80">
            <div className="flex flex-col items-end">
                <span className="text-[10px] opacity-60">Erudition</span>
                <span className={isChronoscope ? 'text-cyan-400' : 'text-[#8b0000]'}>{playerStats.erudition}</span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] opacity-60">Reputation</span>
                <span className={isChronoscope ? 'text-amber-400' : 'text-[#8b0000]'}>{playerStats.reputation}</span>
            </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] opacity-60">Health</span>
                <span className={isChronoscope ? 'text-green-400' : 'text-green-700'}>Fine</span>
            </div>
        </div>
      </div>
    </div>
  );
};
