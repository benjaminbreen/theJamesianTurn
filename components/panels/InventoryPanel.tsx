
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
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-victorian-red/30">
            <span className="text-xs font-bold uppercase tracking-widest text-paper-900 font-sans">Possessions ({inventory.length})</span>
            <div className={`flex text-[10px] border rounded overflow-hidden font-sans ${
                isChronoscope ? 'border-slate-600' : 'border-victorian-red/40'
            }`}>
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-2 py-1 transition-colors ${viewMode === 'list' ? (isChronoscope ? 'bg-slate-700' : 'bg-victorian-red text-paper-50') : 'hover:bg-paper-200'}`}
                >
                    LIST
                </button>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2 py-1 transition-colors ${viewMode === 'grid' ? (isChronoscope ? 'bg-slate-700' : 'bg-victorian-red text-paper-50') : 'hover:bg-paper-200'}`}
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
                                        : 'bg-paper-100 border-victorian-red/20 hover:border-victorian-red hover:bg-white shadow-sm'
                                }`}
                                title={item.name}
                            >
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <div className="text-[9px] text-center leading-tight text-paper-900 font-semibold line-clamp-2">{item.name}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {inventory.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => inspectItem(item)}
                                className={`flex items-start gap-3 p-3 border cursor-pointer transition-all hover:translate-x-1 ${
                                    isChronoscope
                                        ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500'
                                        : 'bg-paper-100 border-victorian-red/20 hover:border-victorian-red hover:bg-white shadow-sm'
                                }`}
                            >
                                <div className="text-xl pt-0.5">{item.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-paper-900 truncate">{item.name}</h3>
                                    <p className="text-[10px] text-victorian-slate opacity-70 uppercase tracking-wide font-sans">{item.type}</p>
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
