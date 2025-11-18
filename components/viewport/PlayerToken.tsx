
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useGame } from '../../contexts/GameContext';

interface PlayerTokenProps {
  cellSize: number;
}

export const PlayerToken = ({ cellSize }: PlayerTokenProps) => {
  const { playerPos, playerFacing } = useGame();

  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
      move: {
          transition: { type: "spring", stiffness: 250, damping: 20 }
      }
  };

  const bodyBobVariants: Variants = {
      idle: { y: 0 },
      walk: { 
          y: [0, -2, 0],
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
      }
  };

  const leftLegVariants: Variants = {
      idle: { y: 0 },
      walk: { 
          y: [-2, 0, -2],
          rotate: [-5, 5, -5],
          transition: { duration: 0.5, repeat: Infinity, ease: "linear" } 
      }
  };
  
  const rightLegVariants: Variants = {
      idle: { y: 0 },
      walk: { 
          y: [0, -2, 0],
          rotate: [5, -5, 5],
          transition: { duration: 0.5, repeat: Infinity, ease: "linear" } 
      }
  };

  const armSwingVariants: Variants = {
      idle: { rotate: 0 },
      walk: { 
          rotate: [-15, 15, -15], 
          transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } 
      }
  };

  return (
    <motion.div
      className="absolute z-30 flex items-center justify-center pointer-events-none"
      initial={false}
      animate={{
        x: playerPos.x * cellSize,
        y: playerPos.y * cellSize,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ width: cellSize, height: cellSize }}
    >
      <motion.div 
        className="relative w-full h-full"
        animate="walk" 
      >
        <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-2xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
           
           {/* Dynamic Shadow */}
           <motion.ellipse 
                cx="20" cy="38" rx="10" ry="3" fill="black" opacity="0.3" 
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
           />
           
           <g transform="translate(0, -2)">
             
             {/* --- BACK VIEW (UP) --- */}
             {playerFacing === 'UP' && (
                 <motion.g variants={bodyBobVariants}>
                    {/* Legs */}
                    <motion.path variants={leftLegVariants} d="M15 28 L15 38" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                    <motion.path variants={rightLegVariants} d="M25 28 L25 38" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Frock Coat Body */}
                    <path d="M10 18 L30 18 L32 36 L28 30 L20 36 L12 30 L8 36 Z" fill="#1a1614" />
                    <path d="M10 18 L12 10 L28 10 L30 18" fill="#1a1614" />
                    
                    {/* Arms */}
                    <motion.g variants={armSwingVariants} style={{originX: "12px", originY: "12px"}}>
                        <path d="M8 12 L6 24" stroke="#1a1614" strokeWidth="3.5" strokeLinecap="round" />
                    </motion.g>
                    <motion.g variants={armSwingVariants} style={{originX: "28px", originY: "12px"}}>
                        <path d="M32 12 L34 24" stroke="#1a1614" strokeWidth="3.5" strokeLinecap="round" />
                    </motion.g>

                    {/* Head & Hat */}
                    <circle cx="20" cy="10" r="6" fill="#d9c4a6" />
                    <rect x="14" y="8" width="12" height="2" fill="#5d4037" /> {/* Hairline */}
                    <rect x="13" y="4" width="14" height="6" fill="#101010" /> {/* Hat Crown */}
                    <rect x="10" y="9" width="20" height="1.5" fill="#101010" /> {/* Hat Brim */}
                 </motion.g>
             )}

             {/* --- FRONT VIEW (DOWN) --- */}
             {playerFacing === 'DOWN' && (
                 <motion.g variants={bodyBobVariants}>
                    {/* Legs */}
                    <motion.path variants={leftLegVariants} d="M16 28 L16 38" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                    <motion.path variants={rightLegVariants} d="M24 28 L24 38" stroke="#000" strokeWidth="4" strokeLinecap="round" />

                    {/* Torso */}
                    <path d="M11 28 C8 22 10 12 12 10 L28 10 C30 12 32 22 29 28 Z" fill="#1a1614" />
                    
                    {/* Waistcoat & Shirt */}
                    <path d="M18 10 L18 28 L22 28 L22 10" fill="#f5f5f5" />
                    <path d="M16 14 L20 22 L24 14" fill="#e0e0e0" opacity="0.5" />
                    <circle cx="20" cy="16" r="0.5" fill="gold" /> {/* Button */}
                    <circle cx="20" cy="20" r="0.5" fill="gold" />
                    <circle cx="20" cy="24" r="0.5" fill="gold" />
                    <path d="M16 20 Q20 25 24 20" stroke="gold" strokeWidth="0.5" fill="none" /> {/* Watch Chain */}

                    {/* Arms */}
                    <path d="M11 12 L9 22" stroke="#1a1614" strokeWidth="3" strokeLinecap="round" />
                    <path d="M29 12 L31 22" stroke="#1a1614" strokeWidth="3" strokeLinecap="round" />

                    {/* Head */}
                    <circle cx="20" cy="9" r="6" fill="#d9c4a6" />
                    {/* Beard */}
                    <path d="M15 11 Q20 18 25 11 L25 12 Q20 20 15 12 Z" fill="#3e2723" />
                    <path d="M17 13 L23 13" stroke="#3e2723" strokeWidth="1" /> {/* Moustache */}
                    
                    {/* Hat */}
                    <rect x="13" y="1" width="14" height="8" fill="#101010" />
                    <rect x="9" y="8" width="22" height="1.5" fill="#101010" />

                    {/* Monocle */}
                    <circle cx="22" cy="9" r="1.5" stroke="gold" strokeWidth="0.5" fill="rgba(255,255,255,0.3)" />
                 </motion.g>
             )}

             {/* --- SIDE VIEW (LEFT/RIGHT) --- */}
             {(playerFacing === 'LEFT' || playerFacing === 'RIGHT') && (
                 <g transform={playerFacing === 'LEFT' ? "scale(-1, 1) translate(-40, 0)" : ""}>
                     <motion.g variants={bodyBobVariants}>
                        {/* Legs (Scissors) */}
                        <motion.path 
                            variants={leftLegVariants} 
                            d="M18 28 L14 38" stroke="#000" strokeWidth="4" strokeLinecap="round" 
                        />
                        <motion.path 
                            variants={rightLegVariants} 
                            d="M22 28 L26 38" stroke="#000" strokeWidth="4" strokeLinecap="round" 
                        />

                        {/* Body Side */}
                        <path d="M14 26 L14 10 L26 10 L26 32 L14 26" fill="#1a1614" />
                        <path d="M26 14 Q28 20 26 28" fill="#1a1614" /> {/* Paunch */}

                        {/* Arm Swing */}
                        <motion.g variants={armSwingVariants} style={{ originX: "20px", originY: "12px" }}>
                             <path d="M20 12 L20 24" stroke="#1a1614" strokeWidth="4" strokeLinecap="round" />
                             <circle cx="20" cy="25" r="1.5" fill="#d9c4a6" /> {/* Hand */}
                             <line x1="20" y1="25" x2="20" y2="36" stroke="#5d4037" strokeWidth="1" /> {/* Cane */}
                        </motion.g>

                        {/* Head Side */}
                        <circle cx="22" cy="9" r="6" fill="#d9c4a6" />
                        <path d="M22 12 L20 12 L24 16 L26 12 Z" fill="#3e2723" /> {/* Beard Profile */}
                        
                        {/* Hat Side */}
                        <rect x="15" y="1" width="14" height="8" fill="#101010" />
                        <rect x="13" y="8" width="20" height="1.5" fill="#101010" />
                     </motion.g>
                 </g>
             )}

           </g>
        </svg>
      </motion.div>
    </motion.div>
  );
};
