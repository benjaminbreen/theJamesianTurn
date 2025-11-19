
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Position = {
  x: number;
  y: number;
};

export type TileType = 'FLOOR' | 'WALL' | 'DOOR' | 'EVENT' | 'VOID' | 'EXIT' | 'OBSTACLE';
export type TileTexture = 'PARQUET' | 'COBBLE' | 'PAVEMENT' | 'GRASS' | 'METAL' | 'DIRT' | 'NONE';

export type ZoneId = 'ESPLANADE' | 'MACHINES' | 'TOWER' | 'SALON' | 'STREET';

export type TileData = {
  x: number;
  y: number;
  type: TileType;
  texture?: TileTexture;
  variant?: number; // Added to control specific asset selection
  visible: boolean;
  lit: boolean;
  zoneTarget?: ZoneId;
};

export type EntityType = 'NPC' | 'ITEM' | 'MACHINE';

// New Item Types
export type ItemType = 'BOOK' | 'ARTIFACT' | 'GADGET' | 'CURIOSITY';

export type Item = {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ItemType;
};

// NPC Brain Types
export type NpcGoal = 'WANDER' | 'SOCIALIZE' | 'INSPECT_MACHINE' | 'REST' | 'LEAVE';

export type NpcMemory = {
    timestamp: number;
    description: string;
};

export type Entity = {
  id: string;
  name: string;
  type: EntityType;
  position: Position;
  facing?: Direction; // Added for sprite animation
  description: string;
  avatar?: string;
  asciiId?: string;
  itemData?: Item; 
  
  // NPC Specifics
  profession?: string;
  goal?: NpcGoal;
  bio?: string;
  memories?: NpcMemory[];
  targetPos?: Position | null;
};

// Social Physics Types
export type Rumor = {
  id: string;
  text: string;
  topic: string[];
  value: number;
  source: string;
};

export type Persona = Entity & {
  voicePrompt: string;
  disposition: 'FRIENDLY' | 'NEUTRAL' | 'HOSTILE';
  rumorsKnown: string[];
  stats: {
      composure: number; 
      reputation: number; 
      erudition: number; 
  };
};

export type DialogueState = {
  isOpen: boolean;
  npcId: string | null;
  history: { speaker: 'PLAYER' | 'NPC'; text: string }[];
};

export type InteractionType = 'OBSERVE' | 'GREET' | 'ACQUIRE' | 'INSPECT' | 'EAVESDROP' | 'TRAVEL' | null;

export type LogEntry = {
  id: string;
  timestamp: number;
  source: 'SYSTEM' | 'NARRATOR' | 'DIALOGUE' | 'THOUGHT' | 'COMBAT' | 'EVENT' | 'FACT';
  text: string;
  metadata?: any;
};

// Toast Notification System
export type NotificationType = 'RUMOR' | 'THOUGHT' | 'ITEM' | 'ALERT';

export type Notification = {
    id: string;
    text: string;
    type: NotificationType;
    timestamp: number;
};

// Combat Types
export type CombatPhase = 'IDLE' | 'PLAYER_CHOICE' | 'RESOLVING' | 'VICTORY' | 'DEFEAT';

export type CombatMoveId = 'GLARE' | 'REFERENCE' | 'COMPLIMENT';

export type CombatMove = {
    id: CombatMoveId;
    name: string;
    description: string;
    cost: number; 
    type: 'OFFENSE' | 'DEFENSE' | 'SUPPORT';
};

export type PlayerStats = {
    composure: number;
    maxComposure: number;
    reputation: number;
    erudition: number;
    level: number; // Added Level
    xp: number;    // Added XP
};

// Deep Player Profile
export type PlayerProfile = {
    mentalState: string;
    currentProject: string;
    clothing: string[];
    statusEffects: string[];
};

// Event System Types
export type EventChoice = {
  id: string;
  text: string;
  outcomeType: 'GAIN_ITEM' | 'GAIN_RUMOR' | 'CHANGE_STAT' | 'NOTHING';
  outcomeValue?: string; 
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
};

export type CinematicState = {
    isPlaying: boolean;
    type: 'ELEVATOR_ASCENT' | 'ELEVATOR_DESCENT' | null;
    progress: number;
};

// Inspection System
export type ArtifactState = {
    isOpen: boolean;
    item: Item | null;
    text: string | null;
    image: string | null;
    isLoading: boolean;
};

// Educational / Fact Check Types
export type WikipediaResult = {
    title: string;
    extract: string;
    url: string;
};

export type FactCheckState = {
    isOpen: boolean;
    isLoading: boolean;
    lastEvent: string | null;
    veracityScore: number | null; // 0-100
    analysis: string | null;
    wikiData: WikipediaResult | null;
};

// --- Scenario & Objectives ---
export type Objective = {
    id: string;
    text: string;
    isComplete: boolean;
};

export type Scenario = {
    id: string;
    title: string;
    description: string;
    introText: string;
    startZone: ZoneId;
    objectives: Objective[];
    bonusItems: Item[];
};

// --- Hover System ---
export type HoverInfo = {
    title: string;
    type: string;
    description: string;
    icon?: string;
    stats?: string;
} | null;

// --- End Game Types ---
export type GameLifecycle = 'SPLASH' | 'PLAYING' | 'ENDED';

export type GameSummary = {
    review: string;
    score: {
        subtlety: number;
        verbosity: number;
        socialStanding: number;
        total: number;
    };
    titleAwarded: string; // e.g. "The Master" or "The Bore"
};
