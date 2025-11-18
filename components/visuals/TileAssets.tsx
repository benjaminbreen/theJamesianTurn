
import React from 'react';
import { ZoneId, TileTexture } from '../../types';

interface TileProps {
  zone: ZoneId;
  variant?: number;
  texture?: TileTexture;
}

// --- FLOORS ---

export const FloorTile = ({ zone, variant = 0, texture = 'NONE' }: TileProps) => {
  
  // Special Rug Variant for Salons (Variant 102)
  if (variant === 102) {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
             <defs>
                 <pattern id="rugPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                     <rect width="4" height="4" fill="#600010" />
                     <circle cx="2" cy="2" r="1" fill="#800020" />
                 </pattern>
             </defs>
             <rect width="40" height="40" fill="#8B4513" /> 
             {/* The Rug */}
             <rect x="4" y="4" width="32" height="32" fill="url(#rugPattern)" stroke="#d4af37" strokeWidth="1" />
             <rect x="6" y="6" width="28" height="28" fill="none" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="2 2" />
             <circle cx="20" cy="20" r="6" stroke="#d4af37" strokeWidth="0.5" fill="#4a0404" opacity="0.8" />
             {/* Tassels */}
             <path d="M4 4 L2 2 M36 4 L38 2 M4 36 L2 38 M36 36 L38 38" stroke="#d4af37" strokeWidth="1" />
        </svg>
      );
  }

  if (texture === 'GRASS') {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" fill="#3a5f0b" />
            <path d="M5 35 Q10 25 15 35" stroke="#4a7a15" strokeWidth="1.5" fill="none" />
            <path d="M25 10 Q30 0 35 10" stroke="#4a7a15" strokeWidth="1.5" fill="none" />
            <path d="M15 20 Q20 10 25 20" stroke="#4a7a15" strokeWidth="1.5" fill="none" />
            <circle cx="8" cy="8" r="1.5" fill="#558b2f" opacity="0.4" />
            <circle cx="32" cy="32" r="2" fill="#558b2f" opacity="0.3" />
            {/* Small Flowers */}
            {variant % 3 === 0 && <circle cx="28" cy="12" r="1.5" fill="#fff" opacity="0.6" />}
        </svg>
      );
  }

  if (texture === 'COBBLE') {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" fill="#4e342e" />
            <g fill="#5d4037" stroke="#3e2723" strokeWidth="0.5">
                <rect x="1" y="1" width="12" height="10" rx="2" />
                <rect x="14" y="0" width="14" height="12" rx="2" />
                <rect x="29" y="1" width="10" height="10" rx="2" />
                
                <rect x="0" y="12" width="10" height="14" rx="2" />
                <rect x="11" y="13" width="18" height="12" rx="3" />
                <rect x="30" y="12" width="10" height="14" rx="2" />

                <rect x="1" y="27" width="14" height="12" rx="2" />
                <rect x="16" y="26" width="12" height="13" rx="2" />
                <rect x="29" y="27" width="11" height="12" rx="2" />
            </g>
        </svg>
      );
  }

  if (texture === 'PAVEMENT') {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
             <rect width="40" height="40" fill="#9e9e9e" />
             <rect x="2" y="2" width="36" height="36" fill="#bdbdbd" stroke="#757575" strokeWidth="0.5" />
             {/* Cracks */}
             {variant % 4 === 0 && <path d="M5 5 L10 10 M35 35 L30 30" stroke="#757575" strokeWidth="0.5" />}
        </svg>
      );
  }

  if (texture === 'METAL' || zone === 'MACHINES') {
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
            <pattern id="grate" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="#263238" />
                <path d="M0 0 L10 10 M10 0 L0 10" stroke="#37474f" strokeWidth="0.5" opacity="0.2" />
            </pattern>
        </defs>
        <rect width="40" height="40" fill="#546e7a" /> 
        <rect width="40" height="40" fill="url(#grate)" />
        <rect x="2" y="2" width="36" height="36" stroke="#455a64" strokeWidth="2" fill="none" />
        {/* Rivets */}
        <circle cx="4" cy="4" r="1.5" fill="#263238" />
        <circle cx="36" cy="4" r="1.5" fill="#263238" />
        <circle cx="4" cy="36" r="1.5" fill="#263238" />
        <circle cx="36" cy="36" r="1.5" fill="#263238" />
      </svg>
    );
  }

  if (texture === 'PARQUET' || zone === 'SALON') {
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full">
         <rect width="40" height="40" fill="#5D4037" /> 
         {/* Herringbone Pattern */}
         <g stroke="#3E2723" strokeWidth="0.5" fill="#8D6E63">
             <path d="M0 0 L20 20 L0 40" fill="none" />
             <path d="M20 0 L40 20 L20 40" fill="none" />
             <path d="M0 10 L10 20 L0 30" fill="none" />
             <path d="M40 10 L30 20 L40 30" fill="none" />
             <path d="M20 10 L30 20 L20 30" fill="none" />
             <path d="M20 10 L10 20 L20 30" fill="none" />
         </g>
         <rect width="40" height="40" fill="#3E2723" opacity="0.1" />
      </svg>
    );
  }

  // Default Dirt/Floor
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
       <rect width="40" height="40" fill="#bcaaa4" /> 
       <path d="M10 10 Q20 5 30 10 T40 20" stroke="#8d6e63" strokeWidth="0.5" opacity="0.5" fill="none"/>
       <circle cx="15" cy="25" r="1" fill="#5d4037" opacity="0.3" />
       <circle cx="35" cy="15" r="2" fill="#5d4037" opacity="0.2" />
    </svg>
  );
};

// --- WALLS ---

export const WallTile = ({ zone }: TileProps) => {
  if (zone === 'MACHINES') {
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full">
         <rect width="40" height="40" fill="#263238" />
         {/* Iron Truss */}
         <path d="M0 0 L40 40 M40 0 L0 40" stroke="#37474f" strokeWidth="4" />
         <rect x="5" y="5" width="30" height="30" fill="none" stroke="#455a64" strokeWidth="2" />
         <circle cx="20" cy="20" r="5" fill="#102027" stroke="#455a64" strokeWidth="2" />
      </svg>
    );
  }

  if (zone === 'SALON') {
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" fill="#4e342e" />
            {/* Wallpaper Pattern */}
            <rect x="0" y="0" width="40" height="32" fill="#3e2723" />
            <path d="M10 5 Q20 15 30 5 M10 15 Q20 25 30 15" stroke="#5d4037" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Wainscoting */}
            <rect x="0" y="32" width="40" height="8" fill="#3e2723" stroke="#210e09" strokeWidth="1" />
            <line x1="10" y1="32" x2="10" y2="40" stroke="#210e09" strokeWidth="1" />
            <line x1="30" y1="32" x2="30" y2="40" stroke="#210e09" strokeWidth="1" />
        </svg>
      );
  }

  // Brick/Stone Facade for Streets
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
        <rect width="40" height="40" fill="#795548" />
        <path d="M0 10 H40 M0 20 H40 M0 30 H40" stroke="#4e342e" strokeWidth="1" />
        <path d="M10 0 V10 M30 0 V10 M20 10 V20 M10 20 V30 M30 20 V30 M20 30 V40" stroke="#4e342e" strokeWidth="1" />
        {/* Window */}
        <rect x="12" y="12" width="16" height="16" fill="#212121" stroke="#3e2723" strokeWidth="2" />
        <line x1="20" y1="12" x2="20" y2="28" stroke="#3e2723" strokeWidth="1" />
        <line x1="12" y1="20" x2="28" y2="20" stroke="#3e2723" strokeWidth="1" />
    </svg>
  );
};

// --- OBSTACLES ---

export const ObstacleTile = ({ zone, variant = 0 }: TileProps) => {
    
    // 101: Bookshelf
    if (variant === 101) {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                <rect x="2" y="2" width="36" height="36" fill="#3e2723" rx="1" />
                {/* Shelves */}
                <line x1="4" y1="12" x2="36" y2="12" stroke="#1a1614" strokeWidth="2" />
                <line x1="4" y1="22" x2="36" y2="22" stroke="#1a1614" strokeWidth="2" />
                <line x1="4" y1="32" x2="36" y2="32" stroke="#1a1614" strokeWidth="2" />
                
                {/* Books Randomness */}
                <g>
                    <rect x="5" y="4" width="3" height="8" fill="#b71c1c" />
                    <rect x="8" y="5" width="3" height="7" fill="#1b5e20" />
                    <rect x="11" y="4" width="4" height="8" fill="#0d47a1" />
                    <rect x="16" y="6" width="8" height="2" fill="#f57f17" /> {/* Lying down */}
                    <rect x="25" y="4" width="3" height="8" fill="#4a148c" />
                    <rect x="30" y="4" width="5" height="8" fill="#3e2723" />
                </g>
                 <g transform="translate(0, 10)">
                    <rect x="6" y="4" width="4" height="8" fill="#004d40" />
                    <rect x="11" y="4" width="3" height="8" fill="#b71c1c" />
                    <rect x="15" y="4" width="15" height="8" fill="none" /> 
                    <rect x="31" y="4" width="4" height="8" fill="#f57f17" />
                </g>
            </svg>
        );
    }

    // 201: Lamppost
    if (variant === 201) {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg">
                 <circle cx="20" cy="20" r="3" fill="#1a1614" />
                 <path d="M20 20 L20 40" stroke="#1a1614" strokeWidth="2" />
                 {/* The Lamp Head */}
                 <path d="M14 14 L26 14 L23 23 L17 23 Z" fill="#fffde7" stroke="#1a1614" strokeWidth="1" />
                 <circle cx="20" cy="18" r="4" fill="#fff59d" opacity="0.6" className="animate-pulse" />
                 {/* Crossbars */}
                 <line x1="12" y1="18" x2="28" y2="18" stroke="#1a1614" strokeWidth="1" />
            </svg>
        );
    }

    // 202: Carriage (Top Down)
    if (variant === 202) {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-xl">
                {/* Wheels */}
                <rect x="2" y="8" width="4" height="24" fill="#3E2723" rx="1" />
                <rect x="34" y="8" width="4" height="24" fill="#3E2723" rx="1" />
                <line x1="4" y1="20" x2="36" y2="20" stroke="#210e09" strokeWidth="2" />
                {/* Cabin */}
                <rect x="8" y="5" width="24" height="30" rx="4" fill="#210e09" />
                <rect x="10" y="8" width="20" height="24" rx="2" fill="#3e2723" />
                {/* Roof */}
                <rect x="12" y="10" width="16" height="20" fill="#1a1614" opacity="0.8" />
                {/* Hitch */}
                <path d="M20 5 L20 0" stroke="#3E2723" strokeWidth="3" />
            </svg>
        );
    }

    // 301: Tree (Top Down)
    if (variant === 301) {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                <circle cx="22" cy="22" r="16" fill="#1b5e20" opacity="0.6" />
                <circle cx="18" cy="18" r="14" fill="#2e7d32" opacity="0.8" />
                <circle cx="20" cy="20" r="12" fill="#388e3c" />
                {/* Leaves Texture */}
                <path d="M15 15 Q20 10 25 15 T35 25" stroke="#66bb6a" strokeWidth="1" fill="none" opacity="0.5" />
                <circle cx="20" cy="20" r="2" fill="#1a1614" opacity="0.3" /> {/* Trunk Hint */}
            </svg>
        );
    }

    // 302: Fountain (Animated)
    if (variant === 302) {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg">
                <circle cx="20" cy="20" r="18" fill="#e0f7fa" stroke="#b2ebf2" strokeWidth="2" />
                <circle cx="20" cy="20" r="14" fill="#80deea" />
                <circle cx="20" cy="20" r="8" fill="#4dd0e1" />
                <circle cx="20" cy="20" r="3" fill="white" />
                {/* Water Jets */}
                <g className="animate-spin origin-center" style={{animationDuration: '3s'}}>
                    <circle cx="20" cy="12" r="2" fill="white" opacity="0.7" />
                    <circle cx="28" cy="20" r="2" fill="white" opacity="0.7" />
                    <circle cx="20" cy="28" r="2" fill="white" opacity="0.7" />
                    <circle cx="12" cy="20" r="2" fill="white" opacity="0.7" />
                </g>
            </svg>
        );
    }

    // 401: Steam Engine (Animated)
    if (variant === 401) {
        return (
             <svg viewBox="0 0 40 40" className="w-full h-full">
                <rect x="4" y="8" width="32" height="24" fill="#263238" rx="2" stroke="#102027" strokeWidth="2" />
                {/* Boiler Bands */}
                <line x1="12" y1="8" x2="12" y2="32" stroke="#d4af37" strokeWidth="1" />
                <line x1="28" y1="8" x2="28" y2="32" stroke="#d4af37" strokeWidth="1" />
                
                {/* Piston */}
                <rect x="8" y="4" width="8" height="12" fill="#b0bec5" className="animate-[bounce_0.5s_infinite]" />
                
                {/* Flywheel */}
                <g transform="translate(30, 20)">
                    <g className="animate-spin" style={{animationDuration: '1s'}}>
                        <circle cx="0" cy="0" r="8" stroke="#102027" strokeWidth="2" fill="none" />
                        <line x1="0" y1="-8" x2="0" y2="8" stroke="#102027" strokeWidth="1" />
                        <line x1="-8" y1="0" x2="8" y2="0" stroke="#102027" strokeWidth="1" />
                    </g>
                </g>
                
                {/* Gears */}
                <circle cx="16" cy="20" r="4" fill="#546e7a" stroke="#37474f" strokeWidth="1" strokeDasharray="2 1" className="animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}/>
            </svg>
        );
    }
    
    // 501: Telescope
    if (variant === 501) {
        return (
            <svg viewBox="0 0 40 40" className="w-full h-full">
                 <path d="M12 38 L20 24 L28 38" stroke="#5d4037" strokeWidth="2" fill="none" />
                 <path d="M18 24 L22 24" stroke="#5d4037" strokeWidth="2" />
                 {/* Tube */}
                 <rect x="14" y="8" width="12" height="24" fill="#d4af37" transform="rotate(-45 20 20)" stroke="#8d6e63" strokeWidth="1" />
                 <circle cx="28" cy="12" r="2" fill="#87ceeb" opacity="0.5" />
            </svg>
        );
    }

    // Default Obstacle (Crate)
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
             <rect x="5" y="5" width="30" height="30" fill="#6d4c41" stroke="#3e2723" strokeWidth="2" />
             <line x1="5" y1="5" x2="35" y2="35" stroke="#3e2723" strokeWidth="1" />
             <line x1="35" y1="5" x2="5" y2="35" stroke="#3e2723" strokeWidth="1" />
             <rect x="8" y="8" width="24" height="24" fill="none" stroke="#5d4037" strokeWidth="2" />
        </svg>
    );
}

// --- EXIT ---

export const ExitTile = ({ zone }: TileProps) => {
    return (
        <svg viewBox="0 0 40 40" className="w-full h-full">
            <rect width="40" height="40" fill="#000" fillOpacity="0.2" />
            <circle cx="20" cy="20" r="16" stroke="#b71c1c" strokeWidth="2" fill="none" strokeDasharray="4 2" className="animate-pulse" />
            <path d="M20 12 L20 28 M16 24 L20 28 L24 24" stroke="#b71c1c" strokeWidth="3" fill="none" strokeLinecap="round" />
            <text x="20" y="36" textAnchor="middle" fontSize="8" fill="#b71c1c" fontWeight="bold" fontFamily="serif">EXIT</text>
        </svg>
    );
}

// --- ATMOSPHERE OVERLAY ---
export const AtmosphereOverlay = ({ zone }: { zone: ZoneId }) => {
    if (zone === 'MACHINES') {
        return (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 mix-blend-screen">
                <style>{`
                    @keyframes steamRise {
                        0% { transform: translateY(120%) scale(0.5); opacity: 0; }
                        20% { opacity: 0.4; }
                        80% { opacity: 0.2; }
                        100% { transform: translateY(-20%) scale(2); opacity: 0; }
                    }
                `}</style>
                {[...Array(6)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white rounded-full blur-2xl"
                        style={{
                            width: '80px', height: '80px',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `steamRise ${5 + Math.random() * 5}s infinite linear ${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>
        );
    }

    if (zone === 'SALON') {
        return (
             <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 mix-blend-overlay">
                <style>{`
                    @keyframes smokeDrift {
                        0% { transform: translateX(-20px) translateY(0) rotate(0deg); opacity: 0; }
                        50% { opacity: 0.3; }
                        100% { transform: translateX(20px) translateY(-40px) rotate(20deg); opacity: 0; }
                    }
                `}</style>
                {[...Array(4)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-32 h-32 bg-gray-300 blur-3xl rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `smokeDrift ${8 + Math.random() * 8}s infinite linear ${Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>
        );
    }

    return null;
}
