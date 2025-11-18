
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ArtifactViewer = () => {
  const { artifactState, closeArtifactView, generateInspectionImage, generateInspectionText } = useGame();
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';

  if (!artifactState.isOpen || !artifactState.item) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-12"
        >
            <div className={`w-full max-w-4xl h-full max-h-[600px] flex overflow-hidden shadow-2xl ${
                isChronoscope 
                    ? 'bg-slate-900 border border-cyan-500' 
                    : 'bg-[#2b2520] border-4 border-[#d4af37]'
            }`}>
                {/* Visual Side */}
                <div className="w-1/2 bg-black flex flex-col items-center justify-center relative p-4">
                    {artifactState.isLoading ? (
                         <div className={`animate-pulse flex flex-col items-center gap-4 ${isChronoscope ? 'text-cyan-500' : 'text-[#d4af37]'}`}>
                            <div className="text-4xl">⚡</div>
                            <div className="text-xs uppercase tracking-widest">Resolving Details...</div>
                        </div>
                    ) : artifactState.image ? (
                        <img 
                            src={artifactState.image} 
                            alt={artifactState.item.name}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className={`text-6xl opacity-20 ${isChronoscope ? 'text-cyan-500' : 'text-[#d4af37]'}`}>
                                {artifactState.item.icon}
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Visual data unavailable</p>
                            <button 
                                onClick={generateInspectionImage}
                                className={`px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all border ${
                                    isChronoscope 
                                        ? 'border-cyan-500 text-cyan-500 hover:bg-cyan-500/10' 
                                        : 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10'
                                }`}
                            >
                                Look Closer
                            </button>
                        </div>
                    )}
                    
                    {/* Overlay Vignette */}
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
                </div>

                {/* Text Side */}
                <div className={`w-1/2 p-8 flex flex-col ${
                    isChronoscope ? 'text-slate-100' : 'bg-[#fdf6e3] text-[#2b2520]'
                }`}>
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className={`text-3xl font-bold mb-2 ${isChronoscope ? 'font-mono' : 'font-serif'}`}>
                                {artifactState.item.name}
                            </h2>
                            <span className="text-xs uppercase tracking-widest opacity-50">
                                {artifactState.item.type}
                            </span>
                        </div>
                        <button onClick={closeArtifactView} className="text-2xl opacity-50 hover:opacity-100">×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                         <p className={`text-lg leading-relaxed mb-6 ${isChronoscope ? 'font-mono text-cyan-100' : 'font-serif italic'}`}>
                             "{artifactState.text}"
                         </p>

                         {/* Contextual Actions */}
                         {(artifactState.item.type === 'BOOK' || artifactState.item.type === 'ARTIFACT') && (
                             <div className="mt-4">
                                 <button 
                                    onClick={generateInspectionText}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                                        isChronoscope
                                            ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10'
                                            : 'border-[#5c4033]/30 text-[#5c4033] hover:bg-[#5c4033]/10'
                                    }`}
                                 >
                                     Read Excerpt / Analyze
                                 </button>
                             </div>
                         )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-current border-opacity-20 text-xs opacity-50">
                        Observation No. {Math.floor(Math.random() * 10000)}
                    </div>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
