
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';

export const InventoryPanel = () => {
  const { inventory, inspectItem } = useGame();
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className={`h-full flex flex-col p-4 ${
        isChronoscope ? 'text-slate-300' : 'text-[#2b2520]'
    }`}>
        {/* Controls */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-current opacity-70">
            <span className="text-xs font-bold uppercase tracking-widest">Possessions ({inventory.length})</span>
            <div className={`flex text-[10px] border rounded overflow-hidden ${
                isChronoscope ? 'border-slate-600' : 'border-[#5c4033]'
            }`}>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`px-2 py-1 ${viewMode === 'list' ? (isChronoscope ? 'bg-slate-700' : 'bg-[#5c4033] text-[#f3e5ab]') : ''}`}
                >
                    LIST
                </button>
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-2 py-1 ${viewMode === 'grid' ? (isChronoscope ? 'bg-slate-700' : 'bg-[#5c4033] text-[#f3e5ab]') : ''}`}
                >
                    GRID
                </button>
            </div>
        </div>

        {inventory.length === 0 ? (
            <div className="flex-1 flex items-center justify-center italic opacity-50 text-sm text-center">
                Your pockets contain only lint and ambition.
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-3 gap-2">
                        {inventory.map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => inspectItem(item)}
                                className={`aspect-square flex flex-col items-center justify-center p-2 cursor-pointer transition-all border relative group ${
                                    isChronoscope 
                                        ? 'bg-slate-800 border-slate-700 hover:border-amber-500 hover:bg-slate-700' 
                                        : 'bg-white border-[#5c4033]/20 hover:border-[#8b0000]'
                                }`}
                                title={item.name}
                            >
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-[9px] text-center leading-none opacity-80 line-clamp-2">{item.name}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {inventory.map((item, idx) => (
                            <div 
                                key={idx}
                                onClick={() => inspectItem(item)}
                                className={`flex items-start gap-3 p-2 border cursor-pointer transition-all hover:translate-x-1 ${
                                    isChronoscope 
                                        ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500' 
                                        : 'bg-white border-[#5c4033]/10 hover:border-[#8b0000]'
                                }`}
                            >
                                <div className="text-xl pt-0.5">{item.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-xs truncate">{item.name}</h3>
                                    <p className="text-[10px] opacity-60 uppercase tracking-wide">{item.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
