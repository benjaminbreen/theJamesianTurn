
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const InventoryOverlay = () => {
  const { isInventoryOpen, toggleInventory, inventory, inspectItem } = useGame();
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  if (!isInventoryOpen) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`absolute inset-x-8 bottom-24 top-24 z-50 p-6 flex flex-col ${
                isChronoscope 
                    ? 'bg-slate-900/95 border border-amber-500 text-amber-100 shadow-2xl' 
                    : 'bg-[#f3e5ab] border-4 double-border border-[#5c4033] text-[#2b2520] shadow-xl'
            }`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-2 border-current opacity-80">
                <h2 className="text-xl font-bold uppercase tracking-widest">Inventory</h2>
                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className={`flex text-xs border rounded overflow-hidden ${
                        isChronoscope ? 'border-amber-500/50' : 'border-[#5c4033]'
                    }`}>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 ${viewMode === 'list' ? (isChronoscope ? 'bg-amber-500 text-slate-900' : 'bg-[#5c4033] text-[#f3e5ab]') : ''}`}
                        >
                            LIST
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 ${viewMode === 'grid' ? (isChronoscope ? 'bg-amber-500 text-slate-900' : 'bg-[#5c4033] text-[#f3e5ab]') : ''}`}
                        >
                            GRID
                        </button>
                    </div>
                    <button onClick={toggleInventory} className="font-bold text-xl hover:scale-110 transition-transform">×</button>
                </div>
            </div>

            {inventory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center opacity-50 italic">
                    Your pockets are empty.
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-2">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-4 gap-4">
                            {inventory.map((item, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => inspectItem(item)}
                                    className={`aspect-square flex flex-col items-center justify-center p-4 cursor-pointer transition-all border ${
                                        isChronoscope 
                                            ? 'bg-slate-800 border-slate-600 hover:bg-amber-900/30 hover:border-amber-500' 
                                            : 'bg-[#fffdf5] border-[#5c4033]/30 hover:bg-white hover:border-[#5c4033]'
                                    }`}
                                >
                                    <div className="text-4xl mb-2">{item.icon}</div>
                                    <div className="text-xs text-center font-bold leading-tight">{item.name}</div>
                                    <div className="text-[10px] opacity-60 mt-1 uppercase">{item.type}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {inventory.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className={`flex items-center gap-4 p-3 border transition-all ${
                                        isChronoscope 
                                            ? 'bg-slate-800/50 border-slate-600 hover:bg-slate-800' 
                                            : 'bg-[#fffdf5] border-[#5c4033]/20 hover:bg-white'
                                    }`}
                                >
                                    <div className={`w-12 h-12 flex items-center justify-center text-2xl border ${
                                         isChronoscope ? 'bg-slate-900 border-slate-700' : 'bg-[#f3e5ab] border-[#5c4033]/10'
                                    }`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm">{item.name}</h3>
                                        <p className="text-xs opacity-70 line-clamp-1">{item.description}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => inspectItem(item)}
                                            className={`px-3 py-1 text-[10px] uppercase font-bold border ${
                                                isChronoscope ? 'border-cyan-500 text-cyan-500' : 'border-[#5c4033] text-[#5c4033]'
                                            }`}
                                        >
                                            Inspect
                                        </button>
                                        <button 
                                            className={`px-3 py-1 text-[10px] uppercase font-bold border opacity-50 hover:opacity-100 ${
                                                isChronoscope ? 'border-red-500 text-red-500' : 'border-[#8b0000] text-[#8b0000]'
                                            }`}
                                            onClick={() => alert("Items cannot be discarded in this zone.")}
                                        >
                                            Drop
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 text-xs opacity-50 text-center">
                {viewMode === 'grid' ? 'Click an item to inspect details.' : 'Manage your effects and curiosities.'}
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
