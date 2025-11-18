
import React from 'react';
import { ASCII_ART, AsciiArtId } from '../../lib/ascii';
import { useTheme } from '../../contexts/ThemeContext';

interface AsciiPortraitProps {
  id: string | undefined;
  className?: string;
}

export const AsciiPortrait = ({ id, className = '' }: AsciiPortraitProps) => {
  const { theme } = useTheme();
  const isChronoscope = theme === 'chronoscope';
  
  // Resolve ID to valid ASCII key or default
  const artKey = (id && id in ASCII_ART) ? (id as AsciiArtId) : 'HENRY_JAMES';
  const lines = ASCII_ART[artKey] || ASCII_ART.GENERIC_MAN;

  return (
    <div className={`font-mono text-[10px] leading-[1.1] whitespace-pre select-none flex flex-col items-center justify-center mix-blend-multiply ${className}`}>
      {lines.map((line, i) => (
        <div 
            key={i} 
            className={`transition-all duration-500 ${isChronoscope ? 'hover:text-amber-300' : ''}`}
            style={{
                filter: isChronoscope ? 'none' : 'blur(0.3px)',
                textShadow: isChronoscope ? 'none' : '0 0 1px rgba(40, 30, 20, 0.5)',
                animation: isChronoscope 
                    ? `glitchText 3s infinite ${i * 0.1}s` 
                    : `inkBleed 5s infinite alternate ${i * 0.2}s`
            }}
        >
          {line}
        </div>
      ))}
      <style>{`
        @keyframes glitchText {
          0% { transform: skew(0deg); opacity: 1; }
          2% { transform: skew(10deg); opacity: 0.8; }
          4% { transform: skew(-10deg); opacity: 1; }
          5% { transform: skew(0deg); }
          100% { transform: skew(0deg); }
        }
        @keyframes inkBleed {
          0% { font-weight: 400; opacity: 0.9; }
          100% { font-weight: 600; opacity: 1; }
        }
      `}</style>
    </div>
  );
};
