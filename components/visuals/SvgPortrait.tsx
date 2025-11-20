import React from 'react';
import { PortraitArchetype, PortraitEmotion } from '../../types';

interface Props {
  archetype: PortraitArchetype;
  emotion?: PortraitEmotion;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// --- Configuration Types ---
type Gender = 'm' | 'f' | 'n';
type SkinTone = 'pale' | 'tan' | 'dark' | 'olive' | 'metal';
type Clothes = 'suit' | 'dress' | 'uniform' | 'shirt' | 'trench' | 'vest' | 'velvet_coat';
type Hat = 'fedora' | 'cloche' | 'cop' | 'newsboy' | 'headband' | 'top_hat' | 'none';
type Accessory = 'cigar' | 'glasses' | 'pince_nez' | 'wire_glasses' | 'pearls' | 'scarf' | 'earrings' | 'sunflower' | 'none';
type HairStyle = 'short' | 'bob' | 'bald' | 'slick' | 'wavy' | 'finger_waves' | 'receding' | 'wilde_locks';
type Beard = 'none' | 'goatee' | 'full' | 'distinguished' | 'stubble';

interface PortraitConfig {
  gender: Gender;
  skin: SkinTone;
  hairColor: string;
  eyeColor: string;
  clothes: Clothes;
  hat: Hat;
  accessory: Accessory;
  hairStyle: HairStyle;
  beard: Beard;
  facialFeatures?: {
    noseShape?: 'straight' | 'prominent' | 'rounded';
    jawline?: 'strong' | 'refined' | 'soft';
    cheekbones?: 'high' | 'normal';
    lipFullness?: 'thin' | 'normal' | 'full';
  };
}

const CONFIGS: Record<PortraitArchetype, PortraitConfig> = {
  henry_james: {
    gender: 'm',
    skin: 'pale',
    hairColor: '#6b6b6b',
    eyeColor: '#4a5f7a',
    clothes: 'suit',
    hat: 'none',
    accessory: 'wire_glasses',
    hairStyle: 'receding',
    beard: 'distinguished',
    facialFeatures: {
      noseShape: 'prominent',
      jawline: 'refined',
      cheekbones: 'high',
      lipFullness: 'full'
    }
  },
  oscar_wilde: {
    gender: 'm',
    skin: 'pale',
    hairColor: '#3d2817',
    eyeColor: '#2e7d32',
    clothes: 'velvet_coat',
    hat: 'none',
    accessory: 'sunflower',
    hairStyle: 'wilde_locks',
    beard: 'none',
    facialFeatures: {
      noseShape: 'straight',
      jawline: 'soft',
      cheekbones: 'high',
      lipFullness: 'full'
    }
  },
  thomas_edison: {
    gender: 'm',
    skin: 'tan',
    hairColor: '#4a4a4a',
    eyeColor: '#3e2723',
    clothes: 'vest',
    hat: 'none',
    accessory: 'none',
    hairStyle: 'receding',
    beard: 'stubble',
    facialFeatures: {
      noseShape: 'rounded',
      jawline: 'strong',
      cheekbones: 'normal',
      lipFullness: 'thin'
    }
  },
  mobster_m: { gender: 'm', skin: 'olive', hairColor: '#1a1a1a', eyeColor: '#3e2723', clothes: 'suit', hat: 'fedora', accessory: 'cigar', hairStyle: 'slick', beard: 'stubble' },
  mobster_f: { gender: 'f', skin: 'pale', hairColor: '#0f0f0f', eyeColor: '#2e7d32', clothes: 'dress', hat: 'cloche', accessory: 'scarf', hairStyle: 'bob', beard: 'none' },
  flapper: { gender: 'f', skin: 'pale', hairColor: '#d4a017', eyeColor: '#4682b4', clothes: 'dress', hat: 'headband', accessory: 'pearls', hairStyle: 'finger_waves', beard: 'none' },
  cop: { gender: 'm', skin: 'tan', hairColor: '#3d2b1f', eyeColor: '#3e2723', clothes: 'uniform', hat: 'cop', accessory: 'none', hairStyle: 'short', beard: 'stubble' },
  worker: { gender: 'm', skin: 'dark', hairColor: '#0a0a0a', eyeColor: '#000000', clothes: 'vest', hat: 'newsboy', accessory: 'none', hairStyle: 'short', beard: 'stubble' },
  gentleman: { gender: 'm', skin: 'pale', hairColor: '#808080', eyeColor: '#556b2f', clothes: 'suit', hat: 'top_hat', accessory: 'pince_nez', hairStyle: 'slick', beard: 'goatee' },
  lady: { gender: 'f', skin: 'pale', hairColor: '#8b4513', eyeColor: '#4682b4', clothes: 'dress', hat: 'none', accessory: 'pearls', hairStyle: 'wavy', beard: 'none' },
  sailor: { gender: 'm', skin: 'tan', hairColor: '#8b4513', eyeColor: '#1e90ff', clothes: 'shirt', hat: 'none', accessory: 'none', hairStyle: 'short', beard: 'stubble' },
  pharmacist: { gender: 'm', skin: 'pale', hairColor: '#a9a9a9', eyeColor: '#708090', clothes: 'suit', hat: 'none', accessory: 'glasses', hairStyle: 'bald', beard: 'none' },
  machine: { gender: 'n', skin: 'metal', hairColor: '#000', eyeColor: '#ff0000', clothes: 'uniform', hat: 'none', accessory: 'none', hairStyle: 'bald', beard: 'none' }
};

const SKIN_COLORS: Record<SkinTone, { base: string; shadow: string; highlight: string; blush: string }> = {
  pale: { base: '#fcece3', shadow: '#e0c0a8', highlight: '#fff9f5', blush: '#f0a0a0' },
  tan: { base: '#e6b996', shadow: '#bd8e6c', highlight: '#f5d5bc', blush: '#d69076' },
  olive: { base: '#dccba0', shadow: '#ae9b72', highlight: '#efe6ce', blush: '#c4aa82' },
  dark: { base: '#8d5524', shadow: '#5e3615', highlight: '#af7441', blush: '#a36330' },
  metal: { base: '#9e9e9e', shadow: '#616161', highlight: '#e0e0e0', blush: '#757575' }
};

const SvgPortrait: React.FC<Props> = ({ archetype, emotion = 'neutral', className = "", size = 'md', onClick }) => {
  const config = CONFIGS[archetype];
  const skin = SKIN_COLORS[config.skin];

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-28 h-28',
    lg: 'w-64 h-64'
  };

  // --- Animation CSS ---
  const styles = `
    @keyframes blink {
      0%, 96%, 100% { transform: scaleY(1); }
      97% { transform: scaleY(0.1); }
    }
    @keyframes breathe {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-0.5px) scale(1.005); }
    }
    @keyframes subtleBreath {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-0.8px); }
    }
    @keyframes smokeFlow {
      0% { opacity: 0; transform: translate(0,0) scale(0.5) rotate(0deg); }
      30% { opacity: 0.6; }
      100% { opacity: 0; transform: translate(-8px,-25px) scale(2.5) rotate(20deg); }
    }
    @keyframes ember {
      0%, 100% { fill: #ff4500; fill-opacity: 0.6; }
      50% { fill: #ff8c00; fill-opacity: 1; }
    }
    @keyframes glassShine {
      0%, 90%, 100% { opacity: 0; }
      95% { opacity: 0.8; }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .eye-lids { animation: blink 5s infinite; transform-origin: center; }
    .torso-anim { animation: breathe 6s ease-in-out infinite; transform-origin: bottom center; }
    .head-breathe { animation: subtleBreath 6s ease-in-out infinite; }
    .smoke-particle { animation: smokeFlow 4s ease-out infinite; }
    .ember-glow { animation: ember 2s ease-in-out infinite; }
    .glass-shine { animation: glassShine 8s infinite; }
    .sparkle { animation: sparkle 3s ease-in-out infinite; }
  `;

  // --- Emotion Transforms ---
  const getBrowPath = (side: 'L' | 'R') => {
    const y = 38;
    const xStart = side === 'L' ? 28 : 58;
    const xEnd = side === 'L' ? 44 : 74;
    const cp1x = side === 'L' ? 36 : 66;
    let cp1y = 36;

    if (emotion === 'angry') cp1y = 42;
    if (emotion === 'suspicious' && side === 'L') cp1y = 40;
    if (emotion === 'suspicious' && side === 'R') cp1y = 35;
    if (emotion === 'afraid') cp1y = 30;
    if (emotion === 'happy') cp1y = 35;
    if (emotion === 'injured') cp1y = 40;

    return `M${xStart},${y} Q${cp1x},${cp1y} ${xEnd},${y}`;
  };

  const getMouthPath = () => {
    switch (emotion) {
      case 'happy': return "M38,78 Q50,85 62,78";
      case 'angry': return "M38,82 Q50,76 62,82";
      case 'afraid': return "M42,80 Q50,86 58,80 Q50,74 42,80";
      case 'suspicious': return "M38,80 L62,79";
      case 'dead': return "M38,80 L62,80";
      case 'injured': return "M38,82 Q50,78 62,84";
      default: return "M38,80 Q50,82 62,80";
    }
  };

  // --- Sub-Components ---

  const Defs = () => (
    <defs>
      <linearGradient id={`skinGrad-${archetype}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="20%" stopColor={skin.base} />
        <stop offset="100%" stopColor={skin.shadow} />
      </linearGradient>
      <linearGradient id={`noseHighlight-${archetype}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={skin.highlight} stopOpacity="0.8" />
        <stop offset="100%" stopColor={skin.base} stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`pearlGrad-${archetype}`} cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="100%" stopColor="#ccc" />
      </radialGradient>
      <radialGradient id={`hairShine-${archetype}`} cx="0.5" cy="0.2" r="0.5">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="100%" stopColor={config.hairColor} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`velvetSheen-${archetype}`} cx="0.3" cy="0.3" r="0.8">
        <stop offset="0%" stopColor="#8b008b" />
        <stop offset="50%" stopColor="#4b0082" />
        <stop offset="100%" stopColor="#2d0f3d" />
      </radialGradient>
      <linearGradient id={`goldThread-${archetype}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="50%" stopColor="#ffed4e" />
        <stop offset="100%" stopColor="#d4af37" />
      </linearGradient>
      <filter id={`fabricTexture-${archetype}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise"/>
        <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
        <feBlend mode="multiply" in="composite" in2="SourceGraphic"/>
      </filter>
      <filter id={`sequins-${archetype}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="2" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lightingColor="#D4AF37">
          <fePointLight x="50" y="-50" z="100" />
        </feSpecularLighting>
        <feComposite in2="SourceAlpha" operator="in" />
        <feComposite in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
      </filter>
      <filter id={`softGlow-${archetype}`}>
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  );

  const Hair = ({ back = false }) => {
    const fill = config.hairColor;

    if (back) {
      if (config.hairStyle === 'bob') return <path d="M20,30 C20,0 80,0 80,30 L85,70 L72,70 L72,50 L28,50 L28,70 L15,70 Z" fill={fill} />;
      if (config.hairStyle === 'finger_waves') return <path d="M15,40 C15,10 85,10 85,40 C88,60 80,75 70,75 C65,75 65,60 65,50 L35,50 C35,60 35,75 30,75 C20,75 12,60 15,40 Z" fill={fill} />;
      if (config.hairStyle === 'wavy') return <path d="M15,40 C15,0 85,0 85,40 L90,85 L75,85 L70,50 L30,50 L25,85 L10,85 Z" fill={fill} />;
      if (config.hairStyle === 'wilde_locks') {
        return (
          <g>
            <path d="M15,40 C15,5 85,5 85,40 L90,70 L80,70 C80,55 75,45 70,40 L30,40 C25,45 20,55 20,70 L10,70 Z" fill={fill} />
            <path d="M20,40 Q15,50 18,60 Q20,55 22,50" fill={fill} opacity="0.7" />
            <path d="M80,40 Q85,50 82,60 Q80,55 78,50" fill={fill} opacity="0.7" />
          </g>
        );
      }
      return null;
    }

    // Front Hair
    return (
      <g>
        {config.hairStyle === 'slick' && (
          <path d="M25,45 C22,20 78,20 75,45 C75,25 60,12 40,12 C25,12 25,30 25,45 Z" fill={fill}>
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M25,45 C22,20 78,20 75,45 C75,25 60,12 40,12 C25,12 25,30 25,45 Z;
                      M25,45 C22,20 78,20 75,45 C75,25 60,11.5 40,11.5 C25,11.5 25,30 25,45 Z;
                      M25,45 C22,20 78,20 75,45 C75,25 60,12 40,12 C25,12 25,30 25,45 Z"
            />
          </path>
        )}
        {config.hairStyle === 'short' && <path d="M25,45 C25,15 75,15 75,45 C75,25 60,10 40,10 C20,10 25,30 25,45 Z" fill={fill} />}
        {config.hairStyle === 'receding' && (
          <g>
            <path d="M28,50 C28,30 35,22 40,20 C45,18 50,18 55,18 C60,18 65,20 70,25 C73,28 72,40 72,50" fill={fill} />
            <path d="M30,45 C30,35 35,28 40,25" fill={fill} opacity="0.6" />
            <path d="M70,45 C70,35 65,28 60,25" fill={fill} opacity="0.6" />
            <ellipse cx="50" cy="25" rx="15" ry="8" fill={`url(#hairShine-${archetype})`} />
          </g>
        )}
        {config.hairStyle === 'wilde_locks' && (
          <g>
            <path d="M20,45 C20,18 80,18 80,45 C80,25 65,12 50,12 C35,12 20,25 20,45" fill={fill} />
            <path d="M22,42 Q18,50 20,58 C21,52 22,47 22,42" fill={fill} opacity="0.8" />
            <path d="M35,20 Q30,28 32,36 C33,30 34,25 35,20" fill={fill} opacity="0.6" />
            <path d="M65,20 Q70,28 68,36 C67,30 66,25 65,20" fill={fill} opacity="0.6" />
            <path d="M78,42 Q82,50 80,58 C79,52 78,47 78,42" fill={fill} opacity="0.8" />
            <ellipse cx="50" cy="22" rx="22" ry="12" fill={`url(#hairShine-${archetype})`} />
          </g>
        )}
        {config.hairStyle === 'finger_waves' && (
          <g>
            <path d="M20,45 C20,20 80,20 80,45 C80,25 60,12 50,12 C30,12 20,25 20,45" fill={fill} />
            <path d="M20,45 Q15,55 22,60 Q28,55 22,45" fill={fill} />
            <path d="M80,45 Q85,55 78,60 Q72,55 78,45" fill={fill} />
            <ellipse cx="50" cy="25" rx="20" ry="10" fill={`url(#hairShine-${archetype})`} />
          </g>
        )}
        {config.hairStyle === 'bob' && (
          <g>
            <path d="M22,40 C22,20 78,20 78,40 C78,25 50,15 50,15 C50,15 22,25 22,40" fill={fill} />
            <path d="M22,40 L22,60 C25,55 28,55 28,50" fill={fill} />
            <path d="M78,40 L78,60 C75,55 72,55 72,50" fill={fill} />
          </g>
        )}
        {config.hairStyle === 'bald' && <path d="M22,55 C22,40 24,35 25,35 L28,35 L28,55 Z" fill="#999" opacity="0.4" />}
      </g>
    );
  };

  const Beard = () => {
    if (config.beard === 'none') return null;
    const beardColor = config.hairColor;

    if (config.beard === 'distinguished') {
      // Henry James style full, well-groomed beard
      return (
        <g className="head-breathe">
          {/* Full beard with refined shape */}
          <path
            d="M30,65 C30,75 35,85 40,88 C45,90 55,90 60,88 C65,85 70,75 70,65 L70,55 L30,55 Z"
            fill={beardColor}
            opacity="0.9"
          />
          {/* Beard texture layers */}
          <path
            d="M32,65 C32,73 36,82 40,85 C44,87 56,87 60,85 C64,82 68,73 68,65"
            fill={beardColor}
            opacity="0.3"
          />
          {/* Mustache - full and distinguished */}
          <path
            d="M35,75 Q42,72 50,73 Q58,72 65,75 Q62,78 50,77 Q38,78 35,75"
            fill={beardColor}
          />
          {/* Silver/gray highlights for distinguished look */}
          <path
            d="M45,70 Q50,72 55,70"
            stroke="#b8b8b8"
            strokeWidth="0.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M40,75 C40,78 42,80 44,81"
            stroke="#d0d0d0"
            strokeWidth="0.3"
            fill="none"
            opacity="0.4"
          />
          {/* Chin definition */}
          <path
            d="M48,85 Q50,87 52,85"
            fill={beardColor}
            opacity="0.7"
          />
        </g>
      );
    }

    if (config.beard === 'stubble') {
      return (
        <g className="head-breathe">
          <path
            d="M30,65 C30,85 40,92 50,92 C60,92 70,85 70,65 L72,65 C72,88 60,95 50,95 C40,95 28,88 28,65 Z"
            fill="#000"
            opacity="0.12"
          />
        </g>
      );
    }

    if (config.beard === 'goatee') {
      return (
        <g className="head-breathe">
          <path d="M38,76 Q50,70 62,76 Q60,80 50,78 Q40,80 38,76" fill={beardColor} />
          <path d="M46,82 C46,88 54,88 54,82 L54,78 L46,78 Z" fill={beardColor} />
        </g>
      );
    }

    if (config.beard === 'full') {
      return (
        <g className="head-breathe">
          <path
            d="M28,60 C28,80 38,90 50,90 C62,90 72,80 72,60 L72,55 L28,55 Z"
            fill={beardColor}
          />
          <path d="M35,75 Q50,70 65,75 Q60,78 50,77 Q40,78 35,75" fill={beardColor} />
        </g>
      );
    }

    return null;
  };

  const Clothing = () => {
    return (
      <g className="torso-anim">
        {/* Base Shape */}
        {config.clothes === 'suit' && (
          <g>
            <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill="#1c1c1c" stroke="#000" strokeWidth="0.5" />
            <path d="M38,95 L50,110 L62,95 L50,90 Z" fill="#fff" />
            <path d="M47,95 L53,95 L51,110 L49,110 Z" fill="#600" />
            <path d="M30,95 L50,125 L35,130 Z" fill="#222" stroke="#111" strokeWidth="0.5" />
            <path d="M70,95 L50,125 L65,130 Z" fill="#222" stroke="#111" strokeWidth="0.5" />
            {/* Vest for refined look */}
            <path d="M40,95 L45,90 L55,90 L60,95 L60,115 L40,115 Z" fill="#2d2d2d" stroke="#444" strokeWidth="0.3" />
            {/* Gold watch chain for Henry James/gentleman */}
            {(archetype === 'henry_james' || archetype === 'gentleman') && (
              <g>
                <path d="M42,105 Q45,108 48,105" stroke={`url(#goldThread-${archetype})`} strokeWidth="1" fill="none" className="sparkle" />
                <circle cx="48" cy="105" r="1.5" fill={`url(#goldThread-${archetype})`} className="sparkle" />
              </g>
            )}
          </g>
        )}

        {config.clothes === 'velvet_coat' && (
          <g>
            <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill={`url(#velvetSheen-${archetype})`} stroke="#2d0f3d" strokeWidth="0.5" filter={`url(#fabricTexture-${archetype})`} />
            <path d="M38,95 L50,110 L62,95 L50,90 Z" fill="#f5f5dc" />
            {/* Lapels with rich texture */}
            <path d="M25,95 L45,125 L30,130 Z" fill="#4b0082" stroke="#2d0f3d" strokeWidth="0.5" />
            <path d="M75,95 L55,125 L70,130 Z" fill="#4b0082" stroke="#2d0f3d" strokeWidth="0.5" />
            {/* Ornate buttons */}
            <circle cx="50" cy="105" r="2" fill={`url(#goldThread-${archetype})`} />
            <circle cx="50" cy="113" r="2" fill={`url(#goldThread-${archetype})`} />
            <circle cx="50" cy="121" r="2" fill={`url(#goldThread-${archetype})`} />
          </g>
        )}

        {config.clothes === 'dress' && (
          <g>
            <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill="#4a0404" stroke="#000" strokeWidth="0.5" />
            <rect x="10" y="100" width="80" height="30" fill={`url(#sequins-${archetype})`} opacity="0.5" style={{ mixBlendMode: 'overlay' }} />
            <path d="M30,95 Q50,115 70,95" fill="none" stroke={config.skin === 'pale' ? '#e0e0e0' : '#d4af37'} strokeWidth="0.5" />
          </g>
        )}

        {config.clothes === 'uniform' && (
          <g>
            <path d="M40,95 L60,95 L60,110 L40,110 Z" fill="#1e293b" />
            <path d="M50,95 L50,130" stroke="#ffd700" strokeWidth="0.5" />
            <circle cx="44" cy="105" r="2" fill="#ffd700" />
            <circle cx="56" cy="105" r="2" fill="#ffd700" />
          </g>
        )}

        {config.clothes === 'vest' && (
          <g>
            <path d="M40,95 L60,95 L60,105 L40,105" fill="#fff" />
            <path d="M30,95 L50,130 L20,130" fill="#3e2723" />
            <path d="M70,95 L50,130 L80,130" fill="#3e2723" />
          </g>
        )}

        {config.clothes === 'shirt' && (
          <g>
            <path d="M10,100 Q50,90 90,100 L90,130 L10,130 Z" fill="#4682b4" stroke="#1e3a5f" strokeWidth="0.5" />
            <path d="M48,90 L52,90 L52,130 L48,130 Z" fill="#fff" opacity="0.3" />
          </g>
        )}
      </g>
    );
  };

  const Accessories = () => (
    <g className="torso-anim">
      {config.accessory === 'pearls' && (
        <g>
          <circle cx="38" cy="98" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="43" cy="102" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="48" cy="104" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="53" cy="104" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="58" cy="102" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="63" cy="98" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="40" cy="108" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="46" cy="112" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="50" cy="113" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="55" cy="112" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
          <circle cx="61" cy="108" r="2.5" fill={`url(#pearlGrad-${archetype})`} />
        </g>
      )}
      {config.accessory === 'scarf' && (
        <path d="M35,90 Q50,110 65,90 C75,90 80,100 75,120 C70,100 65,100 60,95" fill="none" stroke="#800020" strokeWidth="8" strokeLinecap="round" />
      )}
      {config.accessory === 'sunflower' && (
        <g transform="translate(15, 100)">
          {/* Sunflower for Oscar Wilde */}
          <circle cx="0" cy="0" r="5" fill="#8b4513" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * 6;
            const y = Math.sin(rad) * 6;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="3"
                ry="5"
                fill="#ffd700"
                transform={`rotate(${angle} ${x} ${y})`}
              />
            );
          })}
        </g>
      )}
    </g>
  );

  const Face = () => (
    <g className="head-breathe">
      {/* Head Shape */}
      <path
        d={
          config.gender === 'm'
            ? config.facialFeatures?.jawline === 'refined'
              ? "M28,35 C28,12 72,12 72,35 L72,55 C72,76 62,90 50,90 C38,90 28,76 28,55 Z"
              : config.facialFeatures?.jawline === 'strong'
              ? "M26,35 C26,10 74,10 74,35 L74,55 C74,78 62,92 50,92 C38,92 26,78 26,55 Z"
              : "M28,35 C28,10 72,10 72,35 L72,55 C72,78 60,92 50,92 C40,92 28,78 28,55 Z"
            : "M28,38 C28,15 72,15 72,38 L72,58 C72,78 50,90 50,90 C50,90 28,78 28,58 Z"
        }
        fill={`url(#skinGrad-${archetype})`}
      />

      {/* Ears */}
      <path d="M28,48 Q22,48 22,55 Q22,62 28,60" fill={skin.shadow} />
      <ellipse cx="25" cy="52" rx="1" ry="2" fill={skin.highlight} opacity="0.3" />
      <path d="M72,48 Q78,48 78,55 Q78,62 72,60" fill={skin.shadow} />
      <ellipse cx="75" cy="52" rx="1" ry="2" fill={skin.highlight} opacity="0.3" />

      {/* Cheekbones */}
      {config.facialFeatures?.cheekbones === 'high' && (
        <g>
          <ellipse cx="32" cy="58" rx="4" ry="2" fill={skin.highlight} opacity="0.4" />
          <ellipse cx="68" cy="58" rx="4" ry="2" fill={skin.highlight} opacity="0.4" />
        </g>
      )}

      {/* Blush */}
      <ellipse cx="36" cy="65" rx="6" ry="4" fill={skin.blush} opacity="0.4" style={{ filter: 'blur(2px)' }} />
      <ellipse cx="64" cy="65" rx="6" ry="4" fill={skin.blush} opacity="0.4" style={{ filter: 'blur(2px)' }} />

      {/* Nose */}
      <g transform="translate(0,2)">
        {config.facialFeatures?.noseShape === 'prominent' ? (
          <g>
            {/* Prominent, refined nose (Henry James) */}
            <path d="M48,42 Q46,58 44,68 L50,73 L56,68 Q54,58 52,42" fill={skin.shadow} opacity="0.5" />
            <path d="M49,45 Q48,58 48,66" stroke={`url(#noseHighlight-${archetype})`} strokeWidth="2.5" fill="none" />
            <path d="M44,68 Q48,72 52,68 L54,70 Q50,75 46,70 Z" fill={skin.shadow} opacity="0.3" />
            <ellipse cx="46" cy="70" rx="1.5" ry="2" fill={skin.shadow} opacity="0.6" />
            <ellipse cx="54" cy="70" rx="1.5" ry="2" fill={skin.shadow} opacity="0.6" />
          </g>
        ) : config.facialFeatures?.noseShape === 'rounded' ? (
          <g>
            <path d="M47,45 Q46,58 45,68 L50,72 L55,68 Q54,58 53,45" fill={skin.shadow} opacity="0.4" />
            <circle cx="50" cy="68" r="4" fill={skin.shadow} opacity="0.2" />
            <path d="M46,69 Q50,73 54,69" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d="M48,45 Q46,60 44,70 L50,74 L56,70 Q54,60 52,45" fill={skin.shadow} opacity="0.5" />
            <path d="M49,48 Q48,60 48,68" stroke={`url(#noseHighlight-${archetype})`} strokeWidth="2" fill="none" />
            <path d="M46,70 Q50,75 54,70" fill="none" stroke={skin.shadow} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Mouth */}
      <g transform="translate(0, 2)">
        <path
          d={getMouthPath()}
          fill="none"
          stroke="#8a5a44"
          strokeWidth={config.gender === 'f' ? 4 : 2}
          strokeLinecap="round"
        />
        {config.facialFeatures?.lipFullness === 'full' && (
          <path
            d={getMouthPath()}
            fill="none"
            stroke={config.gender === 'f' ? '#b71c1c' : '#d7a099'}
            strokeWidth={config.gender === 'f' ? 2 : 1.5}
            strokeLinecap="round"
          />
        )}
        {config.gender === 'f' && (
          <path
            d={getMouthPath()}
            fill="none"
            stroke="#b71c1c"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </g>

      <Beard />

      {/* Eyes */}
      <g transform="translate(0, 2)">
        {/* Whites */}
        <ellipse cx="36" cy="48" rx="6" ry="5" fill="#fff" />
        <ellipse cx="64" cy="48" rx="6" ry="5" fill="#fff" />

        {/* Iris/Pupil */}
        <g>
          <circle cx="36" cy="48" r="3.5" fill={config.eyeColor} />
          <circle cx="36" cy="48" r="1.8" fill="#000" />
          <circle cx="37.2" cy="46.8" r="1" fill="#fff" opacity="0.9" />
          <path d="M34,48 Q36,46 38,48" stroke={config.eyeColor} strokeWidth="0.3" fill="none" opacity="0.3" />

          <circle cx="64" cy="48" r="3.5" fill={config.eyeColor} />
          <circle cx="64" cy="48" r="1.8" fill="#000" />
          <circle cx="65.2" cy="46.8" r="1" fill="#fff" opacity="0.9" />
          <path d="M62,48 Q64,46 66,48" stroke={config.eyeColor} strokeWidth="0.3" fill="none" opacity="0.3" />
        </g>

        {/* Lash Line */}
        <path d="M29,48 Q36,41 43,48" fill="none" stroke="#222" strokeWidth={config.gender === 'f' ? 2 : 1.2} />
        <path d="M57,48 Q64,41 71,48" fill="none" stroke="#222" strokeWidth={config.gender === 'f' ? 2 : 1.2} />

        {/* Lower lash highlight for depth */}
        <path d="M30,50 Q36,52 42,50" fill="none" stroke="#222" strokeWidth="0.5" opacity="0.3" />
        <path d="M58,50 Q64,52 70,50" fill="none" stroke="#222" strokeWidth="0.5" opacity="0.3" />

        {/* Eyelids (Animation) */}
        {emotion !== 'dead' && (
          <g className="eye-lids">
            <path d="M28,46 Q36,40 44,46 L44,40 L28,40 Z" fill={skin.shadow} />
            <path d="M56,46 Q64,40 72,46 L72,40 L56,40 Z" fill={skin.shadow} />
          </g>
        )}
      </g>

      {/* Brows */}
      <g transform="translate(0, 3)">
        <path
          d={getBrowPath('L')}
          fill="none"
          stroke={config.hairColor}
          strokeWidth={config.gender === 'm' ? 2.5 : 1.5}
          strokeLinecap="round"
        />
        <path
          d={getBrowPath('R')}
          fill="none"
          stroke={config.hairColor}
          strokeWidth={config.gender === 'm' ? 2.5 : 1.5}
          strokeLinecap="round"
        />
      </g>

      {/* Face Accessories */}
      {config.accessory === 'wire_glasses' && (
        <g opacity="0.85" filter={`url(#softGlow-${archetype})`}>
          {/* Wire-rimmed glasses (Henry James style) */}
          <ellipse cx="36" cy="50" rx="9" ry="8" fill="rgba(255,255,255,0.05)" stroke="#8b7355" strokeWidth="0.8" />
          <ellipse cx="64" cy="50" rx="9" ry="8" fill="rgba(255,255,255,0.05)" stroke="#8b7355" strokeWidth="0.8" />
          <line x1="45" y1="50" x2="55" y2="50" stroke="#8b7355" strokeWidth="0.8" />
          <path d="M27,50 L22,48" stroke="#8b7355" strokeWidth="0.6" />
          <path d="M73,50 L78,48" stroke="#8b7355" strokeWidth="0.6" />
          <path d="M28,46 L35,44" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" className="glass-shine" />
          <path d="M58,46 L65,44" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" className="glass-shine" />
        </g>
      )}
      {config.accessory === 'pince_nez' && (
        <g opacity="0.8">
          <ellipse cx="36" cy="50" rx="8" ry="7" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="0.8" />
          <ellipse cx="64" cy="50" rx="8" ry="7" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="0.8" />
          <line x1="44" y1="50" x2="56" y2="50" stroke="#D4AF37" strokeWidth="0.8" />
        </g>
      )}
      {config.accessory === 'glasses' && (
        <g opacity="0.8">
          <circle cx="36" cy="50" r="9" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1" />
          <circle cx="64" cy="50" r="9" fill="rgba(255,255,255,0.1)" stroke="#D4AF37" strokeWidth="1" />
          <line x1="45" y1="50" x2="55" y2="50" stroke="#D4AF37" strokeWidth="1" />
          <path d="M30,46 L40,44" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </g>
      )}
      {config.accessory === 'cigar' && (
        <g transform="translate(0, 5)">
          <line x1="55" y1="82" x2="75" y2="75" stroke="#5d4037" strokeWidth="4" />
          <circle cx="75" cy="75" r="2" className="ember-glow" />
          <g className="smoke-particle" transform="translate(75, 75)">
            <circle cx="0" cy="0" r="3" fill="#ddd" opacity="0.4" />
            <circle cx="5" cy="-5" r="4" fill="#eee" opacity="0.3" />
          </g>
        </g>
      )}
    </g>
  );

  const HatLayer = () => (
    <g style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.4))' }}>
      {config.hat === 'fedora' && (
        <g transform="translate(0, -10)">
          <path d="M10,35 Q50,40 90,35 L92,45 L8,45 Z" fill="#1a1a1a" />
          <path d="M25,15 L75,15 L80,35 L20,35 Z" fill="#262626" />
          <rect x="22" y="30" width="56" height="6" fill="#000" />
        </g>
      )}
      {config.hat === 'top_hat' && (
        <g transform="translate(0, -18)">
          <rect x="35" y="5" width="30" height="20" rx="2" fill="#0a0a0a" stroke="#000" strokeWidth="0.5" />
          <ellipse cx="50" cy="5" rx="15" ry="3" fill="#1a1a1a" />
          <path d="M25,25 Q50,28 75,25 L78,30 L22,30 Z" fill="#0a0a0a" stroke="#000" strokeWidth="0.5" />
          <ellipse cx="50" cy="15" rx="12" ry="2" fill="#2a2a2a" opacity="0.5" />
        </g>
      )}
      {config.hat === 'headband' && (
        <g transform="translate(0, -2)">
          <path d="M26,35 Q50,45 74,35" fill="none" stroke="#D4AF37" strokeWidth="3" />
          <path d="M70,35 Q80,20 75,5 Q70,20 70,35" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
          <circle cx="70" cy="35" r="3" fill="#00bfff" stroke="#fff" strokeWidth="0.5" />
        </g>
      )}
      {config.hat === 'cloche' && (
        <g transform="translate(0, -5)">
          <path d="M20,20 C20,0 80,0 80,20 L82,45 C82,50 18,50 18,45 Z" fill="#4a3b2a" />
          <path d="M18,40 Q50,45 82,40" fill="none" stroke="#3e2723" strokeWidth="4" />
          <circle cx="75" cy="38" r="6" fill="#D4AF37" />
        </g>
      )}
      {config.hat === 'cop' && (
        <g transform="translate(0, -8)">
          <path d="M15,30 L85,30 L88,40 L12,40 Z" fill="#0f172a" />
          <path d="M20,30 C20,10 80,10 80,30 Z" fill="#1e293b" />
          <path d="M45,15 L55,15 L55,25 L45,25 Z" fill="#ffd700" />
        </g>
      )}
      {config.hat === 'newsboy' && (
        <g transform="translate(0, -5)">
          <path d="M15,25 C15,5 85,5 85,25 L90,32 L10,32 Z" fill="#3e2723" />
          <path d="M10,32 Q50,38 90,32" fill="none" stroke="#2d1e1a" strokeWidth="2" />
        </g>
      )}
    </g>
  );

  // Machine-specific rendering
  if (archetype === 'machine') {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden border-2 border-gold-600 bg-[#2a2a2a] ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-gold-400 transition-all' : ''} shadow-lg`}
      >
        <style>{styles}</style>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b0b0b0" />
              <stop offset="50%" stopColor="#707070" />
              <stop offset="100%" stopColor="#505050" />
            </linearGradient>
            <radialGradient id="redGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#ff0000" />
              <stop offset="100%" stopColor="#8b0000" />
            </radialGradient>
          </defs>
          <rect x="20" y="20" width="60" height="70" rx="5" fill="url(#metalGrad)" stroke="#333" strokeWidth="2" />
          <circle cx="50" cy="50" r="12" fill="url(#redGlow)" className="ember-glow" />
          <rect x="35" y="72" width="30" height="3" fill="#555" />
          <rect x="35" y="78" width="30" height="3" fill="#555" />
          <rect x="35" y="84" width="30" height="3" fill="#555" />
          <path d="M20,90 L30,110 L25,130 M80,90 L70,110 L75,130" stroke="#666" strokeWidth="3" fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden border-2 border-gold-600 bg-[#e5e5e5] ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-gold-400 transition-all' : ''} shadow-lg`}
    >
      <style>{styles}</style>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      <svg viewBox="0 0 100 130" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid slice">
        <Defs />
        <Hair back={true} />
        <Clothing />
        <Accessories />
        <Face />
        <Hair back={false} />
        <HatLayer />

        {/* Overlays */}
        {emotion === 'dead' && <rect width="100" height="130" fill="#000" opacity="0.5" />}
        {emotion === 'injured' && <circle cx="30" cy="40" r="8" fill="#500" opacity="0.3" style={{ filter: 'blur(2px)' }} />}

        {/* Rim Light */}
        <path d="M10,130 C5,50 20,10 50,10 C80,10 95,50 90,130" fill="none" stroke="#fff" strokeWidth="1" opacity="0.15" />
      </svg>
    </div>
  );
};

export default SvgPortrait;
