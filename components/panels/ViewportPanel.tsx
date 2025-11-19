
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useGame } from '../../contexts/GameContext';
import { GridMap } from '../viewport/GridMap';
import { ZONES } from '../../lib/zones';
import { DialogueOverlay } from '../viewport/DialogueOverlay';
import { CombatOverlay } from '../viewport/CombatOverlay';
import { EventOverlay } from '../viewport/EventOverlay';
import { ArtifactViewer } from '../viewport/ArtifactViewer';
import { PlayerModal } from '../viewport/PlayerModal';
import { GameOverOverlay } from '../viewport/GameOverOverlay';
import { ToastLayer } from '../viewport/ToastLayer';
import { HoverInfo } from '../viewport/HoverInfo';
import { SettingsOverlay } from '../viewport/SettingsOverlay';
import { DonationModal } from '../viewport/DonationModal';
import { TouchControls } from '../mobile/TouchControls';

export const ViewportPanel = () => {
  const { theme } = useTheme();
  const {
      playerPos, movePlayer, triggerInteraction, currentInteraction, interactionTarget,
      isLoadingZone, currentZone, startEavesdrop, stopEavesdrop, isEavesdropping,
      combatPhase, cinematicState, artifactState, isPlayerModalOpen, isSettingsOpen,
      toggleInventory
  } = useGame();
  const isChronoscope = theme === 'chronoscope';
  const viewportRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Camera Controls State
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Eavesdrop Progress
  const [eavesdropProgress, setEavesdropProgress] = useState(0);
  const eavesdropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Resize for Camera Centering
  useEffect(() => {
    const updateDim = () => {
      if (viewportRef.current) {
        setDimensions({
          width: viewportRef.current.offsetWidth,
          height: viewportRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', updateDim);
    updateDim();
    return () => window.removeEventListener('resize', updateDim);
  }, []);

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't drag if we are clicking an overlay or interactive element
    if ((e.target as HTMLElement).closest('button')) return;

    // Disable drag on mobile (width < 1024px)
    if (viewportRef.current && viewportRef.current.offsetWidth < 1024) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragStartOffset.current = { ...panOffset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPanOffset({
        x: dragStartOffset.current.x + dx,
        y: dragStartOffset.current.y + dy
    });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // --- Map Controls ---
  const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.25));
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.25));
  const handleCenter = () => {
      setPanOffset({ x: 0, y: 0 });
      setZoom(1);
  };


  // --- Keyboard Inputs ---
  useEffect(() => {
    let spaceTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        if (e.target instanceof HTMLInputElement) return;
        e.preventDefault();
      }

      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case 'arrowup': case 'w': movePlayer('UP'); break;
        case 'arrowdown': case 's': movePlayer('DOWN'); break;
        case 'arrowleft': case 'a': movePlayer('LEFT'); break;
        case 'arrowright': case 'd': movePlayer('RIGHT'); break;
        case 'i': toggleInventory(); break;
        case ' ':
           if (!e.repeat) {
               // Start progress animation
               setEavesdropProgress(0);
               const startTime = Date.now();
               const duration = 500; // ms

               if (eavesdropIntervalRef.current) {
                   clearInterval(eavesdropIntervalRef.current);
               }

               eavesdropIntervalRef.current = setInterval(() => {
                   const elapsed = Date.now() - startTime;
                   const progress = Math.min((elapsed / duration) * 100, 100);
                   setEavesdropProgress(progress);
               }, 16); // ~60fps

               spaceTimer = setTimeout(() => {
                   startEavesdrop();
                   if (eavesdropIntervalRef.current) {
                       clearInterval(eavesdropIntervalRef.current);
                   }
                   setEavesdropProgress(100);
               }, duration);
           }
           break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === ' ') {
         clearTimeout(spaceTimer);
         if (eavesdropIntervalRef.current) {
             clearInterval(eavesdropIntervalRef.current);
         }
         setEavesdropProgress(0);

         if (isEavesdropping) {
             stopEavesdrop();
         } else {
             triggerInteraction();
         }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(spaceTimer);
      if (eavesdropIntervalRef.current) {
          clearInterval(eavesdropIntervalRef.current);
      }
    };
  }, [movePlayer, triggerInteraction, startEavesdrop, stopEavesdrop, isEavesdropping, toggleInventory]);

  const isCombat = combatPhase !== 'IDLE';
  const isCinematic = cinematicState.isPlaying;
  const isPaused = artifactState.isOpen || isCombat || isCinematic || isPlayerModalOpen || isSettingsOpen;

  // Calculate Transform with mobile responsiveness
  const CELL_SIZE = 40;
  const isMobile = dimensions.width < 1024; // lg breakpoint

  // Auto-zoom for mobile to fit more of the map on screen
  const mobileZoom = isMobile ? Math.max(0.6, Math.min(dimensions.width / 800, 1)) : 1;
  const effectiveZoom = isMobile ? mobileZoom : zoom;

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const playerOffsetX = -(playerPos.x * CELL_SIZE) - (CELL_SIZE / 2);
  const playerOffsetY = -(playerPos.y * CELL_SIZE) - (CELL_SIZE / 2);

  // On mobile, ignore pan offset (always centered on player)
  const totalX = isMobile ? centerX : centerX + panOffset.x;
  const totalY = isMobile ? centerY : centerY + panOffset.y;

  return (
    <div
        ref={viewportRef}
        className={`relative h-full w-full flex items-center justify-center overflow-hidden ${
            isMobile ? 'cursor-default' : 'cursor-move'
        } ${
            isChronoscope ? 'bg-slate-950' : 'bg-[#fdf6e3]'
        }`}
        style={{
            backgroundImage: isChronoscope
                ? 'none'
                : 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
    >
      
      {/* Cinematic Overlay (Elevator) */}
      {isCinematic && (
          <div className="absolute inset-0 z-[70] bg-black flex items-center justify-center flex-col pointer-events-auto">
              <div className="text-4xl font-bold text-white animate-pulse mb-4 font-heading">
                  {cinematicState.type === 'ELEVATOR_ASCENT' ? 'ASCENDING' : 'DESCENDING'}
              </div>
              <div className="w-64 h-2 bg-gray-700 rounded overflow-hidden relative">
                  <div 
                    className="h-full bg-white transition-all duration-100"
                    style={{ width: `${cinematicState.progress}%` }}
                  />
              </div>
              <div className="mt-4 text-xs text-gray-400 font-mono">
                  PNEUMATIC PRESSURE: {100 + Math.floor(Math.random() * 20)} PSI
              </div>
          </div>
      )}
      
      {/* Grid Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-0 ${
          isChronoscope 
          ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20' 
          : 'bg-[radial-gradient(#dcdcdc_1px,transparent_1px)] [background-size:20px_20px] opacity-20'
      }`} />

      {/* Vignettes */}
      {isChronoscope && (
        <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/20 rounded-sm shadow-[0_0_15px_rgba(251,191,36,0.1)] z-50" />
      )}
      {!isChronoscope && (
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(62,39,35,0.15)] z-50" />
      )}
      
      {/* Zone Title */}
      <div className={`absolute top-4 left-0 right-0 text-center z-40 ${isLoadingZone ? 'animate-pulse' : ''} pointer-events-none`}>
          <span className={`text-xs uppercase tracking-[0.3em] font-bold font-heading ${
              isChronoscope ? 'text-amber-500/70 bg-slate-950/50 px-4 py-1' : 'text-[#5c4033] bg-[#fdf6e3]/80 px-4 py-1 border-b border-[#5c4033]/20'
          }`}>
              {isLoadingZone ? 'GENERATING ENVIRONS...' : ZONES[currentZone].name}
          </span>
      </div>

      {/* The Game World - Camera Container */}
      <div
        className={`absolute z-10 origin-top-left will-change-transform ${isLoadingZone ? 'blur-sm' : 'blur-0'} ${isPaused ? 'blur-sm opacity-50' : ''}`}
        style={{
            transform: `translate3d(${totalX}px, ${totalY}px, 0) scale(${effectiveZoom}) translate3d(${playerOffsetX}px, ${playerOffsetY}px, 0)`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <GridMap />
      </div>

      {/* Map Controls - Hidden on mobile */}
      <div className="absolute bottom-24 right-4 z-40 flex-col gap-2 pointer-events-auto hidden lg:flex">
          <button 
            onClick={handleZoomIn}
            className={`w-8 h-8 flex items-center justify-center font-bold shadow-md transition-transform hover:scale-110 ${
                isChronoscope ? 'bg-slate-800 text-amber-400 border border-amber-500/50' : 'bg-white text-[#5c4033] border border-[#5c4033]'
            }`}
          >
              +
          </button>
          <button 
            onClick={handleZoomOut}
            className={`w-8 h-8 flex items-center justify-center font-bold shadow-md transition-transform hover:scale-110 ${
                isChronoscope ? 'bg-slate-800 text-amber-400 border border-amber-500/50' : 'bg-white text-[#5c4033] border border-[#5c4033]'
            }`}
          >
              -
          </button>
          <button 
            onClick={handleCenter}
            className={`w-8 h-8 flex items-center justify-center font-bold shadow-md transition-transform hover:scale-110 text-xs ${
                isChronoscope ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50' : 'bg-[#8b0000] text-white border border-[#8b0000]'
            }`}
            title="Center Camera"
          >
              ⌖
          </button>
      </div>

      <DialogueOverlay />
      <CombatOverlay />
      <EventOverlay />
      <ArtifactViewer />
      <PlayerModal />
      <GameOverOverlay />
      <SettingsOverlay />
      <DonationModal />
      <ToastLayer />
      <HoverInfo />

      {/* Interaction HUD */}
      <div className={`absolute bottom-8 left-0 right-0 flex justify-center z-40 transition-opacity duration-300 pointer-events-none ${currentInteraction && !isPaused ? 'opacity-100' : 'opacity-0'}`}>
         <div className="flex flex-col items-center gap-2">
            {/* Eavesdrop Progress Bar */}
            {eavesdropProgress > 0 && eavesdropProgress < 100 && (
               <div className={`w-48 h-1.5 rounded-full overflow-hidden ${
                  isChronoscope ? 'bg-slate-800/80' : 'bg-[#5c4033]/30'
               }`}>
                  <div
                     className={`h-full transition-all duration-75 ${
                        isChronoscope ? 'bg-cyan-400' : 'bg-[#8b0000]'
                     }`}
                     style={{ width: `${eavesdropProgress}%` }}
                  />
               </div>
            )}

            {/* Interaction Prompt */}
            <div className={`px-6 py-2 flex items-center gap-3 backdrop-blur-md ${
              isChronoscope
                ? 'bg-slate-900/80 border border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-[#fffdf5]/90 border-2 double-border border-[#5c4033] text-[#5c4033] shadow-lg'
            }`}>
               <div className={`font-bold uppercase text-sm tracking-wider ${isChronoscope ? 'animate-pulse' : ''}`}>
                  {isEavesdropping ? '[LISTENING...]' : '[SPACE]'}
               </div>
               <div className="h-4 w-px bg-current opacity-50"></div>
               <div className="flex flex-col">
                  <span className="font-bold uppercase text-xs tracking-widest">
                    {currentInteraction}
                  </span>
                  {interactionTarget && (
                    <span className="text-[10px] opacity-80 leading-none">
                       {interactionTarget.name}
                    </span>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Mobile Touch Controls */}
      <TouchControls />

    </div>
  );
};
