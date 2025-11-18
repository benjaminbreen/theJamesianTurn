
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';

interface SplashPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SplashPage = ({ isOpen, onClose }: SplashPageProps) => {
  const { startGame, lifecycle } = useGame();

  const handleStart = () => {
      startGame();
      onClose();
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-[#fdfbf7] text-[#2b2520] font-serif flex flex-col items-center justify-center p-8 text-center"
            >
                {/* Content Container */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-3xl relative"
                >
                    {/* Decorative Border */}
                    <div className="absolute -inset-8 border-4 border-double border-[#5c4033]/30 pointer-events-none"></div>

                    <h1 className="text-6xl md:text-8xl font-bold text-[#8b0000] mb-2 tracking-wider font-serif leading-none">
                        The<br/>Jamesian<br/>Turn
                    </h1>
                    
                    <div className="text-2xl italic mb-8 text-[#5c4033] font-serif mt-4">
                        Paris, 1889
                    </div>
                    
                    <div className="w-24 h-1 bg-[#8b0000] mx-auto mb-8"></div>

                    <div className="space-y-6 text-lg leading-relaxed mb-12 text-[#2b2520]/90 font-light">
                        <p>
                            An interactive roguelike RPG simulation of the <span className="font-bold">Exposition Universelle</span>.
                        </p>
                        <p>
                            Navigate the social and mechanical complexities of the 19th century as the Master himself.
                        </p>
                        <div className="pt-6 text-sm border-t border-[#5c4033]/20 mt-6 w-3/4 mx-auto">
                            <p className="mb-2 uppercase tracking-widest text-xs font-bold opacity-50">Designed By</p>
                            <p className="text-xl font-bold text-[#8b0000]">Benjamin Breen</p>
                            <p className="italic opacity-70">History Professor at UCSC</p>
                            
                            <div className="mt-6 flex items-center justify-center gap-2 opacity-40 text-[10px] uppercase tracking-widest">
                                <span>Built with Gemini 3</span>
                                <span>•</span>
                                <span>React 19</span>
                                <span>•</span>
                                <span>Vite</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleStart} 
                        className="px-12 py-4 bg-[#8b0000] text-[#fdfbf7] font-bold uppercase tracking-[0.2em] hover:bg-[#5c0000] transition-all transform hover:scale-105 shadow-xl border border-[#5c4033]"
                    >
                        {lifecycle === 'PLAYING' ? 'Resume' : 'Enter the Fair'}
                    </button>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};
