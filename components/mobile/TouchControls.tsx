
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Direction } from '../../types';

export const TouchControls = () => {
    const { movePlayer, triggerInteraction } = useGame();
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    const handleMove = (direction: Direction) => {
        movePlayer(direction);
    };

    const buttonClass = `w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all active:scale-95 shadow-lg ${
        isChronoscope
            ? 'bg-slate-800 text-cyan-400 border-2 border-cyan-500/50 active:bg-cyan-500/20'
            : 'bg-white text-[#5c4033] border-2 border-[#5c4033] active:bg-[#5c4033]/10'
    }`;

    const actionButtonClass = `px-6 py-3 flex items-center justify-center text-sm font-bold uppercase transition-all active:scale-95 shadow-lg ${
        isChronoscope
            ? 'bg-slate-800 text-amber-400 border-2 border-amber-500/50 active:bg-amber-500/20'
            : 'bg-[#8b0000] text-white border-2 border-[#8b0000] active:bg-[#8b0000]/80'
    }`;

    return (
        <div className="lg:hidden fixed bottom-24 left-0 right-0 z-40 flex flex-col items-center gap-4 pb-4 pointer-events-none">
            {/* Action Button */}
            <div className="pointer-events-auto">
                <button
                    onClick={triggerInteraction}
                    className={actionButtonClass}
                >
                    <span className="mr-2">⌨</span>
                    Interact
                </button>
            </div>

            {/* D-Pad Controls */}
            <div className="pointer-events-auto">
                <div className="relative w-48 h-48">
                    {/* Up */}
                    <button
                        onClick={() => handleMove('UP')}
                        className={`${buttonClass} absolute top-0 left-1/2 -translate-x-1/2 rounded-t-lg`}
                    >
                        ▲
                    </button>

                    {/* Down */}
                    <button
                        onClick={() => handleMove('DOWN')}
                        className={`${buttonClass} absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-lg`}
                    >
                        ▼
                    </button>

                    {/* Left */}
                    <button
                        onClick={() => handleMove('LEFT')}
                        className={`${buttonClass} absolute left-0 top-1/2 -translate-y-1/2 rounded-l-lg`}
                    >
                        ◀
                    </button>

                    {/* Right */}
                    <button
                        onClick={() => handleMove('RIGHT')}
                        className={`${buttonClass} absolute right-0 top-1/2 -translate-y-1/2 rounded-r-lg`}
                    >
                        ▶
                    </button>

                    {/* Center indicator */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center ${
                        isChronoscope ? 'bg-slate-900/50 border border-cyan-500/30' : 'bg-[#5c4033]/10 border border-[#5c4033]/30'
                    }`}>
                        <span className="text-xs opacity-50">🎮</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
