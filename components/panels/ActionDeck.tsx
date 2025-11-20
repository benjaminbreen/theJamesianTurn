
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
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border-2 ${
                isChronoscope
                    ? 'bg-slate-800 border-cyan-500/50'
                    : 'bg-[#e8d7b5] border-[#8b6914] shadow-sm'
            }`}>
                <span className="text-base">📚</span>
                <div className="flex flex-col items-start">
                    <span className="text-[9px] opacity-60 leading-none">Erudition</span>
                    <span className={`text-sm font-bold ${isChronoscope ? 'text-cyan-400' : 'text-[#8b6914]'}`}>{playerStats.erudition}</span>
                </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border-2 ${
                isChronoscope
                    ? 'bg-slate-800 border-amber-500/50'
                    : 'bg-[#f5deb3] border-[#8b0000] shadow-sm'
            }`}>
                <span className="text-base">⭐</span>
                <div className="flex flex-col items-start">
                    <span className="text-[9px] opacity-60 leading-none">Reputation</span>
                    <span className={`text-sm font-bold ${isChronoscope ? 'text-amber-400' : 'text-[#8b0000]'}`}>{playerStats.reputation}</span>
                </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border-2 ${
                isChronoscope
                    ? 'bg-slate-800 border-green-500/50'
                    : 'bg-[#e8f5e8] border-[#2f4f2f] shadow-sm'
            }`}>
                <span className="text-base">💚</span>
                <div className="flex flex-col items-start">
                    <span className="text-[9px] opacity-60 leading-none">Health</span>
                    <span className={`text-sm font-bold ${
                        playerStats.composure > playerStats.maxComposure * 0.75
                            ? (isChronoscope ? 'text-green-400' : 'text-[#2f4f2f]')
                            : playerStats.composure > playerStats.maxComposure * 0.5
                            ? (isChronoscope ? 'text-yellow-400' : 'text-[#8b6914]')
                            : playerStats.composure > playerStats.maxComposure * 0.25
                            ? (isChronoscope ? 'text-orange-400' : 'text-[#b8860b]')
                            : (isChronoscope ? 'text-red-400' : 'text-[#8b0000]')
                    }`}>
                        {playerStats.composure > playerStats.maxComposure * 0.75
                            ? 'Fine'
                            : playerStats.composure > playerStats.maxComposure * 0.5
                            ? 'Frayed'
                            : playerStats.composure > playerStats.maxComposure * 0.25
                            ? 'Wounded'
                            : 'Critical'}
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
