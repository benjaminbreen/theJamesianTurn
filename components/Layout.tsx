
import React, { useState, useEffect } from 'react';
import { ViewportPanel } from './panels/ViewportPanel';
import { ActionDeck } from './panels/ActionDeck';
import { SidebarTabs } from './panels/SidebarTabs';
import { StreamPanel } from './panels/StreamPanel';
import { NarratorChat } from './panels/InspectorPanel';
import { EducationPanel } from './panels/EducationPanel';
import { InventoryPanel } from './panels/InventoryPanel';
import { useGame } from '../contexts/GameContext';
import { AsciiPortrait } from './visuals/AsciiPortrait';
import { SplashPage } from './visuals/SplashPage';
import { ZONES } from '../lib/zones';

export const Layout = () => {
  const { gameTime, currentZone, togglePlayerModal, saveGame, endGame, lifecycle, toggleSettings, isInventoryOpen } = useGame();
  const [showSplash, setShowSplash] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftTab, setLeftTab] = useState('journal');

  // Auto-show splash on first load
  useEffect(() => {
      if (lifecycle === 'SPLASH') setShowSplash(true);
      else setShowSplash(false);
  }, [lifecycle]);

  // Switch tab when inventory is toggled from bottom bar
  useEffect(() => {
      if (isInventoryOpen) {
          setLeftTab('inventory');
      }
  }, [isInventoryOpen]);

  const timeString = gameTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateString = gameTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const handleEndGame = () => {
      if (window.confirm("Are you sure you wish to depart the Exposition? Your progress will be tallied.")) {
          endGame();
      }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#f7f3e8] text-[#2b2520] font-serif overflow-hidden">
      <SplashPage isOpen={showSplash} onClose={() => setShowSplash(false)} />

      {/* TOP NAVIGATION BAR */}
      <header className="h-16 shrink-0 bg-[#fdfbf7] border-b-4 border-double border-[#5c4033]/20 flex items-center justify-between px-4 md:px-8 relative z-30 shadow-sm">
         
         {/* LEFT: Logotype */}
         <div className="flex items-center">
            <button 
                onClick={() => setShowSplash(true)}
                className="text-left group"
            >
                <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-[#8b0000] group-hover:opacity-80 transition-opacity font-heading">
                    THE JAMESIAN TURN
                </h1>
                <div className="h-0.5 w-0 group-hover:w-full bg-[#8b0000] transition-all duration-500"></div>
            </button>
         </div>

         {/* CENTER: Dynamic Location & Time (Hidden on very small screens) */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center cursor-help group">
            <div className="text-[10px] font-sans uppercase tracking-[0.2em] opacity-60 mb-1 group-hover:text-[#8b0000] transition-colors">
                {dateString} • {timeString}
            </div>
            <div className="text-lg font-bold text-[#5c4033] border-b border-transparent group-hover:border-[#5c4033]/30 transition-all font-heading">
                {ZONES[currentZone].name}
            </div>
         </div>

         {/* RIGHT: Menu Actions */}
         <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-2">
                <button 
                    onClick={toggleSettings}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#5c4033]/10 border border-transparent hover:border-[#5c4033]/20 transition-all active:scale-95 text-[#5c4033]"
                >
                    Settings
                </button>
                <button 
                    onClick={saveGame}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#5c4033]/10 border border-transparent hover:border-[#5c4033]/20 transition-all active:scale-95 active:bg-[#5c4033]/20 text-[#5c4033]"
                >
                    Save
                </button>
                <button 
                    onClick={handleEndGame}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#8b0000] hover:bg-[#8b0000]/10 border border-transparent hover:border-[#8b0000]/20 transition-all active:scale-95"
                >
                    Depart
                </button>
            </div>

            {/* Mobile Hamburger */}
            <button 
                className="md:hidden p-2 space-y-1.5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                <div className="w-6 h-0.5 bg-[#5c4033]"></div>
                <div className="w-6 h-0.5 bg-[#5c4033]"></div>
                <div className="w-6 h-0.5 bg-[#5c4033]"></div>
            </button>
         </div>

         {/* Mobile Dropdown */}
         {mobileMenuOpen && (
             <div className="absolute top-full right-0 w-48 bg-[#fdfbf7] border border-[#5c4033]/20 shadow-xl py-2 md:hidden flex flex-col z-50">
                 <div className="px-4 py-2 text-xs uppercase tracking-widest opacity-50 border-b border-[#5c4033]/10 mb-2">
                     {timeString}
                 </div>
                 <button onClick={toggleSettings} className="px-4 py-3 text-left hover:bg-[#5c4033]/10 text-sm font-bold">Settings</button>
                 <button onClick={saveGame} className="px-4 py-3 text-left hover:bg-[#5c4033]/10 text-sm font-bold">Save Game</button>
                 <button onClick={handleEndGame} className="px-4 py-3 text-left hover:bg-[#8b0000]/10 text-sm font-bold text-[#8b0000]">Depart</button>
             </div>
         )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-80 shrink-0 z-10 shadow-xl flex flex-col border-r border-[#5c4033]/20 hidden lg:flex bg-[#fdfbf7]">
            {/* Portrait Area (Fixed Top-Left) */}
            <div 
                onClick={togglePlayerModal}
                className="h-64 bg-[#fdfbf7] border-b border-[#5c4033]/20 flex flex-col items-center justify-center p-4 relative overflow-hidden group cursor-pointer hover:bg-[#fffdf5] transition-colors"
            >
                <div className="absolute inset-0 bg-[radial-gradient(#cfb53b_1px,transparent_1px)] [background-size:10px_10px] opacity-10"></div>
                <div className="relative w-32 h-32 mb-3 rounded-full bg-white border-4 border-[#d4af37] shadow-md flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 duration-500">
                    <AsciiPortrait id="HENRY_JAMES" className="scale-150 text-[#1a1614]" />
                </div>
                <h2 className="text-2xl font-bold text-[#8b0000] font-heading">Henry James</h2>
                <p className="text-xs font-sans uppercase tracking-widest opacity-60">Man of Letters</p>
                <div className="absolute top-2 right-2 text-[#5c4033] opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase font-bold">
                    View Profile ↗
                </div>
            </div>

            {/* Left Tabs */}
            <div className="flex-1 min-h-0">
                <SidebarTabs 
                    side="left" 
                    activeTabId={leftTab}
                    tabs={[
                        { id: 'journal', label: 'Journal', content: <StreamPanel /> },
                        { id: 'inventory', label: 'Inventory', content: <InventoryPanel /> },
                    ]} 
                />
            </div>
        </aside>

        {/* CENTER VIEWPORT */}
        <section className="flex-1 relative bg-[#e6e2d3] overflow-hidden shadow-inner flex flex-col">
           <div className="flex-1 relative">
             <ViewportPanel />
           </div>
           <div className="h-14 shrink-0">
             <ActionDeck />
           </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 shrink-0 z-10 shadow-xl border-l border-[#5c4033]/20 hidden lg:flex bg-[#fdfbf7]">
            <SidebarTabs side="right" tabs={[
                { id: 'narrator', label: 'Narrator', content: <NarratorChat /> },
                { id: 'education', label: 'Context', content: <EducationPanel /> },
            ]} />
        </aside>
      </main>
    </div>
  );
};
