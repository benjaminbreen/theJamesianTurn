
import React from 'react';
import { Direction } from '../../types';
import { motion, Variants } from 'framer-motion';

interface NpcSpriteProps {
    direction: Direction;
    seed: number; // To vary colors and style
}

export const NpcSprite = ({ direction, seed }: NpcSpriteProps) => {
    // Procedural Traits
    const coatColors = ['#263238', '#33691e', '#b71c1c', '#0d47a1', '#4e342e', '#37474f'];
    const coatColor = coatColors[seed % coatColors.length];
    const isFemale = seed % 2 === 0;
    const hatType = seed % 3; // 0: Top Hat/Bonnet, 1: Bowler/Ribbon, 2: Bare/Cap

    const variants: Variants = {
        idle: { y: 0 },
        walk: { 
            y: [0, -1, 0],
            transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            animate="walk"
            variants={variants}
            className="w-full h-full relative z-20"
        >
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                <ellipse cx="20" cy="37" rx="8" ry="2" fill="black" opacity="0.3" />

                <g transform="translate(0,0)">
                    {/* --- BACK VIEW --- */}
                    {direction === 'UP' && (
                        <>
                            {isFemale ? (
                                // Bustle Dress Back
                                <path d="M12 38 L14 20 L26 20 L28 38 L20 39 Z" fill={coatColor} />
                            ) : (
                                // Coat Tails Back
                                <g>
                                    <path d="M14 38 L14 20 L26 20 L26 38" fill="#101010" />
                                    <line x1="20" y1="20" x2="20" y2="36" stroke="#212121" strokeWidth="0.5" />
                                </g>
                            )}
                            
                            <path d="M12 20 C10 15 12 10 20 10 C28 10 30 15 28 20 Z" fill={isFemale ? coatColor : '#101010'} /> {/* Torso Back */}
                            
                            <circle cx="20" cy="10" r="5" fill="#f3e5ab" /> {/* Head */}
                            
                            {/* HATS Back */}
                            {isFemale ? (
                                <path d="M14 8 Q20 4 26 8 L26 12 L14 12 Z" fill={coatColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                            ) : (
                                hatType === 0 ? (
                                    <g>
                                        <rect x="15" y="3" width="10" height="7" fill="#101010" /> 
                                        <rect x="12" y="9" width="16" height="1" fill="#101010" />
                                    </g>
                                ) : (
                                    <path d="M14 10 Q20 5 26 10" fill="#3e2723" /> // Bowler
                                )
                            )}
                        </>
                    )}

                    {/* --- FRONT VIEW --- */}
                    {direction === 'DOWN' && (
                        <>
                             {isFemale ? (
                                <path d="M10 38 L14 20 L26 20 L30 38 Z" fill={coatColor} />
                            ) : (
                                <g>
                                    <rect x="15" y="22" width="4" height="16" fill="#263238" />
                                    <rect x="21" y="22" width="4" height="16" fill="#263238" />
                                </g>
                            )}

                            <path d="M12 22 C10 15 12 10 20 10 C28 10 30 15 28 22 Z" fill={isFemale ? coatColor : '#101010'} /> {/* Torso */}
                            
                            {!isFemale && <path d="M18 12 L20 22 L22 12" fill="#fff" opacity="0.8" />} {/* Shirt */}

                            <circle cx="20" cy="10" r="5" fill="#f3e5ab" />

                            {/* Face Features */}
                            <circle cx="18.5" cy="9" r="0.5" fill="#333" />
                            <circle cx="21.5" cy="9" r="0.5" fill="#333" />
                            {!isFemale && <path d="M18 11 Q20 12 22 11" stroke="#333" fill="none" strokeWidth="0.5" />}
                            
                            {/* HATS Front */}
                            {isFemale ? (
                                 <path d="M13 7 Q20 3 27 7 L27 10 L13 10 Z" fill={coatColor} /> 
                            ) : (
                                hatType === 0 ? (
                                    <g>
                                        <rect x="15" y="2" width="10" height="7" fill="#101010" />
                                        <rect x="12" y="8" width="16" height="1" fill="#101010" />
                                    </g>
                                ) : (
                                    <path d="M14 9 Q20 4 26 9" fill="#3e2723" /> // Bowler
                                )
                            )}
                        </>
                    )}

                    {/* --- SIDE VIEW --- */}
                    {(direction === 'LEFT' || direction === 'RIGHT') && (
                        <g transform={direction === 'LEFT' ? "scale(-1, 1) translate(-40, 0)" : ""}>
                             {isFemale ? (
                                <path d="M16 38 C12 30 12 20 18 18 L24 18 L28 38 Z" fill={coatColor} />
                            ) : (
                                <g>
                                   <path d="M18 22 L16 38" stroke="#263238" strokeWidth="4" />
                                   <path d="M22 22 L24 38" stroke="#263238" strokeWidth="4" />
                                </g>
                            )}
                            <path d="M16 22 Q16 26 24 24 L24 12 L16 12 Z" fill={isFemale ? coatColor : '#101010'} />
                            <circle cx="20" cy="10" r="5" fill="#f3e5ab" />
                            
                             {isFemale ? (
                                <path d="M14 6 Q22 6 24 10 L14 10 Z" fill={coatColor} />
                            ) : (
                                hatType === 0 ? (
                                    <g>
                                        <rect x="14" y="2" width="10" height="7" fill="#101010" />
                                        <rect x="12" y="8" width="16" height="1" fill="#101010" />
                                    </g>
                                ) : (
                                    <path d="M14 9 Q20 4 26 9" fill="#3e2723" /> 
                                )
                            )}
                        </g>
                    )}
                </g>
            </svg>
        </motion.div>
    );
};
