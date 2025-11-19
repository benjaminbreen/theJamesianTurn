
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
import { MobileSidebar } from './mobile/MobileSidebar';

export const Layout = () => {
  const { gameTime, currentZone, togglePlayerModal, saveGame, endGame, lifecycle, toggleSettings, isInventoryOpen, playerStats, openDonationModal } = useGame();
  const [showSplash, setShowSplash] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftTab, setLeftTab] = useState('journal');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<'journal' | 'inventory' | 'narrator' | 'context' | null>(null);

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

         {/* CENTER: Dynamic Location & Time */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-help group">
            <div className="text-[9px] md:text-[11px] font-sans uppercase tracking-[0.15em] md:tracking-[0.25em] opacity-70 mb-1 md:mb-1.5 group-hover:text-[#8b0000] transition-colors flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-[#fdfbf7]/50 rounded border border-[#5c4033]/10">
                <span className="text-xs md:text-sm">🕐</span>
                <span className="hidden sm:inline">{dateString} • </span>{timeString}
            </div>
            <div className="text-sm md:text-xl font-bold text-[#5c4033] border-b-2 border-transparent group-hover:border-[#8b0000]/40 transition-all font-heading px-2">
                {ZONES[currentZone].name}
            </div>
         </div>

         {/* RIGHT: Menu Actions */}
         <div className="flex items-center gap-4">
            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-2">
                <button
                    onClick={openDonationModal}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#1a1614] hover:from-[#f4d03f] hover:to-[#d4af37] border-2 border-[#d4af37] transition-all active:scale-95 shadow-md hover:shadow-lg"
                    title="Support this project with a paid subscription"
                >
                    💝 Subscribe
                </button>
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
             <div className="absolute top-full right-0 w-56 bg-[#fdfbf7] border border-[#5c4033]/20 shadow-xl py-2 md:hidden flex flex-col z-50">
                 <div className="px-4 py-2 text-xs uppercase tracking-widest opacity-50 border-b border-[#5c4033]/10 mb-2">
                     {timeString}
                 </div>
                 <button
                     onClick={() => { openDonationModal(); setMobileMenuOpen(false); }}
                     className="mx-3 my-2 px-4 py-3 text-center bg-gradient-to-r from-[#d4af37] to-[#f4d03f] text-[#1a1614] font-bold text-sm border-2 border-[#d4af37] shadow-md hover:shadow-lg"
                 >
                     💝 Subscribe to Support
                 </button>
                 <button onClick={() => { togglePlayerModal(); setMobileMenuOpen(false); }} className="px-4 py-3 text-left hover:bg-[#5c4033]/10 text-sm font-bold">👤 Profile</button>
                 <button onClick={() => { toggleSettings(); setMobileMenuOpen(false); }} className="px-4 py-3 text-left hover:bg-[#5c4033]/10 text-sm font-bold">Settings</button>
                 <button onClick={() => { saveGame(); setMobileMenuOpen(false); }} className="px-4 py-3 text-left hover:bg-[#5c4033]/10 text-sm font-bold">Save Game</button>
                 <button onClick={() => { handleEndGame(); setMobileMenuOpen(false); }} className="px-4 py-3 text-left hover:bg-[#8b0000]/10 text-sm font-bold text-[#8b0000]">Depart</button>
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
                <p className="text-xs font-sans uppercase tracking-widest opacity-60 mb-2">Man of Letters</p>

                {/* Quick Stats Display */}
                <div className="flex gap-3 text-[10px] font-sans uppercase tracking-wide mt-1">
                    <div className="flex items-center gap-1 text-green-700" title="Health">
                        <span>💚</span>
                        <span>Fine</span>
                    </div>
                    <div className="flex items-center gap-1 text-victorian-red" title="Reputation">
                        <span>⭐</span>
                        <span>{playerStats.reputation}</span>
                    </div>
                    <div className="flex items-center gap-1 text-victorian-gold" title="Erudition">
                        <span>📚</span>
                        <span>{playerStats.erudition}</span>
                    </div>
                </div>

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
           {/* Action Deck - Hidden on mobile, shown on desktop */}
           <div className="h-14 shrink-0 hidden lg:block">
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

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#fdfbf7] border-t-2 border-[#5c4033]/20 flex items-center justify-around z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setMobileSidebarOpen('journal')}
          className="flex flex-col items-center justify-center flex-1 h-full text-[#5c4033] active:bg-[#5c4033]/10"
        >
          <span className="text-xl mb-1">📖</span>
          <span className="text-[10px] font-bold uppercase">Journal</span>
        </button>
        <button
          onClick={() => setMobileSidebarOpen('inventory')}
          className="flex flex-col items-center justify-center flex-1 h-full text-[#5c4033] active:bg-[#5c4033]/10"
        >
          <span className="text-xl mb-1">🎒</span>
          <span className="text-[10px] font-bold uppercase">Inventory</span>
        </button>
        <button
          onClick={() => setMobileSidebarOpen('narrator')}
          className="flex flex-col items-center justify-center flex-1 h-full text-[#5c4033] active:bg-[#5c4033]/10"
        >
          <span className="text-xl mb-1">💬</span>
          <span className="text-[10px] font-bold uppercase">Narrator</span>
        </button>
        <button
          onClick={() => setMobileSidebarOpen('context')}
          className="flex flex-col items-center justify-center flex-1 h-full text-[#5c4033] active:bg-[#5c4033]/10"
        >
          <span className="text-xl mb-1">📚</span>
          <span className="text-[10px] font-bold uppercase">Context</span>
        </button>
      </div>

      {/* Mobile Sidebars */}
      <MobileSidebar
        isOpen={mobileSidebarOpen === 'journal'}
        onClose={() => setMobileSidebarOpen(null)}
        title="Journal"
      >
        <StreamPanel />
      </MobileSidebar>

      <MobileSidebar
        isOpen={mobileSidebarOpen === 'inventory'}
        onClose={() => setMobileSidebarOpen(null)}
        title="Inventory"
      >
        <InventoryPanel />
      </MobileSidebar>

      <MobileSidebar
        isOpen={mobileSidebarOpen === 'narrator'}
        onClose={() => setMobileSidebarOpen(null)}
        title="Narrator"
      >
        <NarratorChat />
      </MobileSidebar>

      <MobileSidebar
        isOpen={mobileSidebarOpen === 'context'}
        onClose={() => setMobileSidebarOpen(null)}
        title="Context"
      >
        <EducationPanel />
      </MobileSidebar>

    </div>
  );
};
