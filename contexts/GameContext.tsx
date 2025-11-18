
import React, { createContext, useContext, useState, useEffect, PropsWithChildren, useRef } from 'react';
import { Position, Entity, TileData, Direction, InteractionType, LogEntry, ZoneId, DialogueState, Rumor, Persona, CombatPhase, PlayerStats, CombatMoveId, GameEvent, EventChoice, CinematicState, Item, ArtifactState, FactCheckState, PlayerProfile, GameLifecycle, GameSummary, Notification, NotificationType, Scenario, HoverInfo } from '../types';
import { generateZoneMap } from '../lib/mapGenerator';
import { ZONES } from '../lib/zones';
import { generateDialogueResponse, generateRumor, generateNarratorResponse, resolveCombatTurn, generateProceduralEvent, generateArtifactDescription, generateArtifactImage, generateIntro, generateFactCheck, generateEndGameReview, generateStrayThought } from '../lib/gemini';
import { PERSONAS, getPersonaById } from '../lib/personas';
import { generateNpc } from '../lib/npcGen';
import { searchWikipedia } from '../lib/wikipedia';
import { PROCEDURAL_ITEMS } from '../lib/items';
import { PLAYER_STARTING_STATS, calculateDamage, COMBAT_MOVES } from '../lib/combat';
import { generatePlayerProfile, generateStartingInventory } from '../lib/playerGen';
import { playSound, setAmbience, setMasterVolume } from '../lib/audio';
import { SCENARIOS } from '../lib/scenarios';

// Hook for simulation loop
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

interface GameContextType {
  lifecycle: GameLifecycle;
  startGame: () => void;
  endGame: () => void;
  gameSummary: GameSummary | null;

  currentScenario: Scenario | null;
  hoverInfo: HoverInfo;
  setHoverInfo: (info: HoverInfo) => void;

  playerPos: Position;
  playerFacing: Direction;
  mapData: TileData[][];
  entities: Entity[];
  gameLog: LogEntry[];
  notifications: Notification[];
  addNotification: (text: string, type: NotificationType) => void;
  gameTime: Date;
  
  movePlayer: (dir: Direction) => void;
  triggerInteraction: () => void;
  currentInteraction: InteractionType;
  interactionTarget: Entity | null;
  
  startEavesdrop: () => void;
  stopEavesdrop: () => void;
  isEavesdropping: boolean;
  
  currentZone: ZoneId;
  isLoadingZone: boolean;
  
  dialogueState: DialogueState;
  rumors: Rumor[];
  sendDialogue: (text: string, tone: string) => Promise<void>;
  closeDialogue: () => void;
  
  narratorHistory: {role: 'user' | 'model', text: string}[];
  sendNarratorMessage: (text: string) => Promise<void>;
  isNarratorTyping: boolean;

  combatPhase: CombatPhase;
  playerStats: PlayerStats;
  playerProfile: PlayerProfile;
  combatOpponent: Persona | null;
  startCombat: (npcId: string) => void;
  executeCombatMove: (moveId: CombatMoveId) => Promise<void>;
  endCombat: () => void;

  eventState: GameEvent | null;
  resolveEvent: (choice: EventChoice) => void;
  cinematicState: CinematicState;

  inventory: Item[];
  isInventoryOpen: boolean;
  toggleInventory: () => void;
  artifactState: ArtifactState;
  inspectItem: (item: Item) => void;
  generateInspectionImage: () => void;
  generateInspectionText: () => void;
  closeArtifactView: () => void;

  factCheckState: FactCheckState;
  checkVeracity: (eventText: string) => Promise<void>;

  isPlayerModalOpen: boolean;
  togglePlayerModal: () => void;
  
  saveGame: () => void;

  // Settings
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  volume: number;
  setVolume: (v: number) => void;
  textSpeed: 'SLOW' | 'FAST';
  setTextSpeed: (s: 'SLOW' | 'FAST') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const GRID_SIZE = 20; 

export const GameProvider = ({ children }: PropsWithChildren<{}>) => {
  const [lifecycle, setLifecycle] = useState<GameLifecycle>('SPLASH');
  const [gameSummary, setGameSummary] = useState<GameSummary | null>(null);

  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);

  const [currentZone, setCurrentZone] = useState<ZoneId>('ESPLANADE');
  const [playerPos, setPlayerPos] = useState<Position>({ x: 10, y: 10 }); 
  const [playerFacing, setPlayerFacing] = useState<Direction>('UP');
  const [mapData, setMapData] = useState<TileData[][]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [gameLog, setGameLog] = useState<LogEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [gameTime, setGameTime] = useState(new Date('1889-10-14T14:15:00'));
  
  const [currentInteraction, setCurrentInteraction] = useState<InteractionType>(null);
  const [interactionTarget, setInteractionTarget] = useState<Entity | null>(null);
  const [isEavesdropping, setIsEavesdropping] = useState(false);
  const [isLoadingZone, setIsLoadingZone] = useState(false);

  // Systems State
  const [dialogueState, setDialogueState] = useState<DialogueState>({ isOpen: false, npcId: null, history: [] });
  const [rumors, setRumors] = useState<Rumor[]>([]);
  const [narratorHistory, setNarratorHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isNarratorTyping, setIsNarratorTyping] = useState(false);
  
  const [combatPhase, setCombatPhase] = useState<CombatPhase>('IDLE');
  const [playerStats, setPlayerStats] = useState<PlayerStats>({ ...PLAYER_STARTING_STATS, level: 1, xp: 0 });
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(generatePlayerProfile());
  const [combatOpponent, setCombatOpponent] = useState<Persona | null>(null);
  
  const [eventState, setEventState] = useState<GameEvent | null>(null);
  const [cinematicState, setCinematicState] = useState<CinematicState>({ isPlaying: false, type: null, progress: 0 });

  const [inventory, setInventory] = useState<Item[]>(generateStartingInventory());
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [artifactState, setArtifactState] = useState<ArtifactState>({ isOpen: false, item: null, text: null, image: null, isLoading: false });

  const [factCheckState, setFactCheckState] = useState<FactCheckState>({ isOpen: false, isLoading: false, lastEvent: null, veracityScore: null, analysis: null, wikiData: null });
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [textSpeed, setTextSpeed] = useState<'SLOW' | 'FAST'>('FAST');

  // Rate Limit Ref for Thoughts
  const lastThoughtTime = useRef<number>(0);

  // Update audio engine when state changes
  const setVolume = (v: number) => {
      setVolumeState(v);
      setMasterVolume(v);
  };

  const toggleSettings = () => {
      setIsSettingsOpen(prev => !prev);
      playSound('UI_CLICK');
  };

  // --- Lifecycle Management ---
  
  // Initialization Check for Save Game
  useEffect(() => {
      const saved = localStorage.getItem('jamesian_save');
      if (saved) {
          try {
              const data = JSON.parse(saved);
              // Potential auto-load logic here
          } catch (e) {
              console.error("Save file corrupted");
          }
      }
  }, []);

  const startGame = () => {
      // 1. Select Scenario
      const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
      setCurrentScenario(randomScenario);
      setInventory(prev => [...prev, ...randomScenario.bonusItems]);
      
      setLifecycle('PLAYING');
      
      // 2. Load Start Zone
      loadZone(randomScenario.startZone, 'UP'); 
      
      // 3. Initial Narrative Logs
      addLog(`SCENARIO: ${randomScenario.title.toUpperCase()}`, 'SYSTEM');
      addLog(randomScenario.introText, 'NARRATOR');
      
      // 4. Objectives Log
      randomScenario.objectives.forEach(obj => {
          addLog(`Current Objective: ${obj.text}`, 'SYSTEM');
      });

      // 5. Generate Flavor Text
      generateIntro(ZONES[randomScenario.startZone].name).then(text => {
          setNarratorHistory([{role: 'model', text: text}]);
          // Only add if not redundant with scenario intro
          if (text.length > 20) addLog(text, 'NARRATOR');
      });
      
      playSound('TYPEWRITER');
      playSound('CHIME');
  };

  const saveGame = () => {
      const state = {
          currentZone, playerPos, playerStats, inventory, rumors, gameTime, gameLog, currentScenario
      };
      localStorage.setItem('jamesian_save', JSON.stringify(state));
      playSound('UI_CLICK');
      addLog("Progress archived to memory.", 'SYSTEM');
      addNotification("Game Saved Successfully", 'ALERT');
  };

  const endGame = async () => {
      setLifecycle('ENDED');
      playSound('CHIME');
      // Generate Summary
      const summary = await generateEndGameReview(gameLog, inventory, playerStats);
      setGameSummary(summary);
  };

  // --- Simulation Loop (NPC AI + Time + Thoughts) ---
  useInterval(() => {
      // PAUSE CHECK
      if (
          lifecycle !== 'PLAYING' || 
          dialogueState.isOpen || 
          combatPhase !== 'IDLE' || 
          eventState || 
          cinematicState.isPlaying || 
          isPlayerModalOpen ||
          isSettingsOpen ||
          // isInventoryOpen // Removed check here so time moves while in sidebar inventory
          artifactState.isOpen
      ) return;
      
      // Advance Time (1 minute per second)
      setGameTime(prev => new Date(prev.getTime() + 60000));

      // Random Stray Thoughts (Check timestamp cooldown of 60 seconds)
      const now = Date.now();
      if (now - lastThoughtTime.current > 60000 && Math.random() < 0.15) {
          lastThoughtTime.current = now;
          generateStrayThought(ZONES[currentZone].name, gameLog.slice(-2).map(l=>l.text).join(" ")).then(thought => {
             // Changed: Send to Narrator History instead of Toast
             setNarratorHistory(prev => [...prev, { 
                 role: 'model', 
                 text: `[Internal Monologue] ${thought}` 
             }]);
             // Optionally play a sound
             playSound('TYPEWRITER');
          });
      }

      setEntities(prev => {
          return prev.map(entity => {
              if (entity.type !== 'NPC') return entity;

              // 20% chance to move
              if (Math.random() > 0.2) return entity;

              const moves = [
                  {x: 0, y: -1, dir: 'UP'}, 
                  {x: 0, y: 1, dir: 'DOWN'}, 
                  {x: -1, y: 0, dir: 'LEFT'}, 
                  {x: 1, y: 0, dir: 'RIGHT'}
              ];
              const move = moves[Math.floor(Math.random() * moves.length)];
              const newX = entity.position.x + move.x;
              const newY = entity.position.y + move.y;

              // Collision Check
              if (newX > 0 && newX < GRID_SIZE - 1 && newY > 0 && newY < GRID_SIZE - 1) {
                  const tile = mapData[newY]?.[newX];
                  const isOccupied = prev.some(e => e.id !== entity.id && e.position.x === newX && e.position.y === newY);
                  const isPlayer = playerPos.x === newX && playerPos.y === newY;
                  
                  if (tile && tile.type === 'FLOOR' && !isOccupied && !isPlayer) {
                      return {
                          ...entity,
                          position: {x: newX, y: newY},
                          facing: move.dir as Direction
                      };
                  }
              }
              return entity;
          });
      });
  }, 1000);

  // --- Helper: Add Log ---
  const addLog = (text: string, source: LogEntry['source'] = 'SYSTEM') => {
    setGameLog(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: Date.now(),
      source,
      text
    }]);
  };

  const addNotification = (text: string, type: NotificationType) => {
      const id = Date.now().toString() + Math.random();
      setNotifications(prev => [...prev, { id, text, type, timestamp: Date.now() }]);
      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
      }, type === 'THOUGHT' ? 5000 : 8000);
  };

  // --- Core Gameplay Logic (Movement, Zone, Interaction) ---

  const updateVisibility = (map: TileData[][], px: number, py: number) => {
      const newMap = map.map(row => row.map(tile => ({ ...tile, visible: false })));
      const radius = 6;
      for (let y = Math.max(0, py - radius); y <= Math.min(GRID_SIZE - 1, py + radius); y++) {
          for (let x = Math.max(0, px - radius); x <= Math.min(GRID_SIZE - 1, px + radius); x++) {
              if (Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2)) <= radius) {
                  newMap[y][x].visible = true;
                  newMap[y][x].lit = true; 
              }
          }
      }
      return newMap;
  };

  const loadZone = async (zoneId: ZoneId, entryDir: Direction) => {
      setIsLoadingZone(true);
      setCurrentZone(zoneId);
      
      // Audio Ambience Switch
      setAmbience(zoneId);
      
      let newMap = generateZoneMap(zoneId);
      
      // Safe Spawn Logic
      const mid = Math.floor(GRID_SIZE / 2);
      let spawnX = mid;
      let spawnY = mid;
      if (entryDir === 'UP') spawnY = GRID_SIZE - 2;
      if (entryDir === 'DOWN') spawnY = 1;

      if (newMap[spawnY][spawnX].type !== 'FLOOR') {
           let found = false;
           let radius = 1;
           while (!found && radius < GRID_SIZE) {
                for (let y = Math.max(0, spawnY - radius); y <= Math.min(GRID_SIZE - 1, spawnY + radius); y++) {
                    for (let x = Math.max(0, spawnX - radius); x <= Math.min(GRID_SIZE - 1, spawnX + radius); x++) {
                        if (x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE && newMap[y][x].type === 'FLOOR') {
                            spawnX = x;
                            spawnY = y;
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                radius++;
           }
      }
      
      setPlayerPos({ x: spawnX, y: spawnY });
      newMap = updateVisibility(newMap, spawnX, spawnY);
      setMapData(newMap);

      // --- Spawn Entities (NPCs + Items) ---
      const zoneEntities: Entity[] = [];
      
      // 1. Hero/Key NPCs
      PERSONAS.forEach(p => {
          if (Math.random() > 0.7) { 
             let placed = false;
             while(!placed) {
                 const px = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
                 const py = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
                 if (newMap[py][px].type === 'FLOOR') {
                     zoneEntities.push({...p, position: {x: px, y: py}});
                     placed = true;
                 }
             }
          }
      });

      // 2. Procedural NPCs
      const numNpcs = Math.floor(Math.random() * 4) + 2;
      for(let i=0; i<numNpcs; i++) {
         let placed = false;
         while(!placed) {
             const px = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
             const py = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
             if (newMap[py][px].type === 'FLOOR' && !zoneEntities.find(e => e.position.x === px && e.position.y === py)) {
                 zoneEntities.push(generateNpc(zoneId, {x: px, y: py}, i));
                 placed = true;
             }
         }
      }

      // 3. Items
      if (Math.random() > 0.3) {
          const numItems = Math.floor(Math.random() * 3) + 1;
          for(let i=0; i<numItems; i++) {
              const itemTemplate = PROCEDURAL_ITEMS[Math.floor(Math.random() * PROCEDURAL_ITEMS.length)];
              let placed = false;
              while(!placed) {
                 const px = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
                 const py = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
                 if (newMap[py][px].type === 'FLOOR' && !zoneEntities.find(e => e.position.x === px && e.position.y === py)) {
                     zoneEntities.push({
                         id: `item-${Date.now()}-${i}`,
                         name: itemTemplate.name,
                         type: 'ITEM',
                         position: {x: px, y: py},
                         description: itemTemplate.description,
                         itemData: itemTemplate
                     });
                     placed = true;
                 }
              }
          }
      }

      setEntities(zoneEntities);
      setIsLoadingZone(false);
      addLog(`Entered: ${ZONES[zoneId].name}`, 'SYSTEM');
      addNotification(`Entered ${ZONES[zoneId].name}`, 'ALERT');
  };

  const scanSurroundings = (x: number, y: number, dir: Direction) => {
      // 1. Priority Check: UNDER FOOT (Entities at current position)
      const underFoot = entities.find(e => e.position.x === x && e.position.y === y);
      if (underFoot && underFoot.type === 'ITEM') {
          setInteractionTarget(underFoot);
          setCurrentInteraction('ACQUIRE');
          return;
      }

      // 2. Check FACING target
      let tx = x; 
      let ty = y;
      if (dir === 'UP') ty--;
      if (dir === 'DOWN') ty++;
      if (dir === 'LEFT') tx--;
      if (dir === 'RIGHT') tx++;

      // Check for Entities facing
      const facingEntity = entities.find(e => e.position.x === tx && e.position.y === ty);
      if (facingEntity) {
          setInteractionTarget(facingEntity);
          setCurrentInteraction(facingEntity.type === 'NPC' ? 'GREET' : facingEntity.type === 'ITEM' ? 'ACQUIRE' : 'INSPECT');
          playSound('UI_HOVER');
          return;
      }

      // Check for Obstacle Tiles facing
      const tile = mapData[ty]?.[tx];
      if (tile && tile.type === 'OBSTACLE') {
           let name = "Obstacle";
           if (tile.variant === 101) name = "Bookshelf";
           if (tile.variant === 201) name = "Gas Lamppost";
           if (tile.variant === 202) name = "Carriage";
           if (tile.variant === 301) name = "Oak Tree";
           if (tile.variant === 302) name = "Fountain";
           if (tile.variant === 401) name = "Steam Engine";
           if (tile.variant === 501) name = "Telescope";
           if (tile.variant === 102) name = "Persian Rug";

           // Create a transient target for interaction
           setInteractionTarget({
               id: `tile-${tx}-${ty}`,
               name: name,
               type: 'MACHINE',
               position: {x: tx, y: ty},
               description: "Press Space to inspect.",
               facing: 'DOWN' // dummy
           } as Entity);
           setCurrentInteraction('INSPECT');
           return;
      }

      setInteractionTarget(null);
      setCurrentInteraction(null);
  };

  const movePlayer = (dir: Direction) => {
    if (
        dialogueState.isOpen || 
        combatPhase !== 'IDLE' || 
        eventState || 
        cinematicState.isPlaying || 
        artifactState.isOpen || 
        isPlayerModalOpen ||
        isSettingsOpen
    ) return;

    setPlayerFacing(dir);
    const { x, y } = playerPos;
    let newX = x;
    let newY = y;

    if (dir === 'UP') newY--;
    if (dir === 'DOWN') newY++;
    if (dir === 'LEFT') newX--;
    if (dir === 'RIGHT') newX++;

    // Boundary Check
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
        scanSurroundings(x, y, dir);
        return;
    }

    // Check for NPC Collision
    const blockingEntity = entities.find(e => e.position.x === newX && e.position.y === newY && e.type === 'NPC');
    if (blockingEntity) {
         setInteractionTarget(blockingEntity);
         setCurrentInteraction('GREET');
         
         // Immediate Dialogue Trigger
         playSound('UI_CLICK');
         setDialogueState({ isOpen: true, npcId: blockingEntity.id, history: [{ speaker: 'NPC', text: "..." }] });
         const prompt = (blockingEntity as Partial<Persona>).voicePrompt || `You are ${blockingEntity.name}, a ${blockingEntity.profession || 'visitor'} in 1889 Paris.`;
         generateDialogueResponse({ ...blockingEntity, voicePrompt: prompt } as Persona, "Hello", "Neutral", "Greeting").then(res => {
               setDialogueState(prev => ({ ...prev, history: [{ speaker: 'NPC', text: res }] }));
               playSound('TYPEWRITER');
         });
         
         scanSurroundings(x, y, dir); 
         return;
    }

    const targetTile = mapData[newY][newX];

    // Exits
    if (targetTile.type === 'EXIT' && targetTile.zoneTarget) {
        playSound('STEP');
        if (targetTile.zoneTarget === 'TOWER' && currentZone === 'MACHINES') triggerElevator('ASCENT', targetTile.zoneTarget);
        else if (targetTile.zoneTarget === 'MACHINES' && currentZone === 'TOWER') triggerElevator('DESCENT', targetTile.zoneTarget);
        else loadZone(targetTile.zoneTarget, dir);
        return;
    }

    // Collisions (Walls, Void, Obstacles)
    if (targetTile.type === 'WALL' || targetTile.type === 'VOID' || targetTile.type === 'OBSTACLE') {
      playSound('BUMP');
      scanSurroundings(x, y, dir);
      return;
    }

    // Valid Move
    setPlayerPos({ x: newX, y: newY });
    playSound('STEP');
    const updatedMap = updateVisibility(mapData, newX, newY);
    if (targetTile.type === 'EVENT') {
        triggerProceduralEvent();
        updatedMap[newY][newX] = { ...targetTile, type: 'FLOOR' };
    }
    setMapData(updatedMap);
    scanSurroundings(newX, newY, dir);
  };

  // --- Interaction Triggers ---
  const triggerInteraction = () => {
      playSound('UI_CLICK');
      if (currentInteraction === 'ACQUIRE' && interactionTarget?.itemData) {
          setInventory(prev => [...prev, interactionTarget.itemData!]);
          setEntities(prev => prev.filter(e => e.id !== interactionTarget.id));
          addLog(`Picked up ${interactionTarget.name}`, 'SYSTEM');
          addNotification(`Acquired: ${interactionTarget.name}`, 'ITEM');
          setInteractionTarget(null);
          setCurrentInteraction(null);
      } else if (currentInteraction === 'GREET' && interactionTarget) {
          setDialogueState({ isOpen: true, npcId: interactionTarget.id, history: [{ speaker: 'NPC', text: "..." }] });
          const prompt = (interactionTarget as Partial<Persona>).voicePrompt || `You are ${interactionTarget.name}, a ${interactionTarget.profession || 'visitor'} in 1889 Paris.`;
          generateDialogueResponse({ ...interactionTarget, voicePrompt: prompt } as Persona, "Hello", "Neutral", "Greeting").then(res => {
               setDialogueState(prev => ({ ...prev, history: [{ speaker: 'NPC', text: res }] }));
               playSound('TYPEWRITER');
          });
      } else if (currentInteraction === 'INSPECT' && interactionTarget) {
          // Improved inspection logic for transient objects
          const desc = interactionTarget.description === "Press Space to inspect." 
             ? `A fine example of a ${interactionTarget.name}, typical of the exposition.` 
             : interactionTarget.description;
          
          addLog(`Inspecting ${interactionTarget.name}: ${desc}`, 'THOUGHT');
          addNotification(`Observed: ${interactionTarget.name}`, 'THOUGHT');
      }
  };

  // --- Subsystems ---
  const startEavesdrop = () => {
      setIsEavesdropping(true);
      setTimeout(async () => {
          if (!isEavesdropping) return;
          const rumorText = await generateRumor(ZONES[currentZone].name);
          setRumors(prev => [...prev, { id: Date.now().toString(), text: rumorText, source: 'Overheard', topic: [], value: 10 }]);
          addLog(`Overheard: "${rumorText}"`, 'THOUGHT');
          addNotification(`Overheard: "${rumorText}"`, 'RUMOR');
          setIsEavesdropping(false);
          playSound('TYPEWRITER');
      }, 3000);
  };

  const stopEavesdrop = () => setIsEavesdropping(false);

  const sendDialogue = async (text: string, tone: string) => {
      playSound('UI_CLICK');
      setDialogueState(prev => ({ ...prev, history: [...prev.history, { speaker: 'PLAYER', text }] }));
      if (dialogueState.npcId) {
          const entity = entities.find(e => e.id === dialogueState.npcId) || getPersonaById(dialogueState.npcId);
          if (entity) {
            const prompt = (entity as Partial<Persona>).voicePrompt || `You are ${entity.name}.`;
            const res = await generateDialogueResponse({...entity, voicePrompt: prompt} as Persona, text, tone, "Chat");
            setDialogueState(prev => ({ ...prev, history: [...prev.history, { speaker: 'NPC', text: res }] }));
            playSound('TYPEWRITER');
          }
      }
  };

  const closeDialogue = () => setDialogueState(prev => ({ ...prev, isOpen: false }));

  const sendNarratorMessage = async (text: string) => {
      playSound('UI_CLICK');
      setNarratorHistory(prev => [...prev, { role: 'user', text }]);
      setIsNarratorTyping(true);
      const res = await generateNarratorResponse(narratorHistory, text, `Zone: ${ZONES[currentZone].name}`);
      setNarratorHistory(prev => [...prev, { role: 'model', text: res }]);
      setIsNarratorTyping(false);
      playSound('TYPEWRITER');
  };

  const startCombat = (npcId: string) => {
      const npc = getPersonaById(npcId);
      if (npc) {
          setCombatOpponent(npc);
          setCombatPhase('PLAYER_CHOICE');
          setDialogueState(prev => ({ ...prev, isOpen: false }));
          addLog(`Initiated debate with ${npc.name}`, 'COMBAT');
          playSound('CHIME');
      }
  };

  const executeCombatMove = async (moveId: CombatMoveId) => {
      if (!combatOpponent) return;
      playSound('UI_CLICK');
      setCombatPhase('RESOLVING');
      const damage = calculateDamage(moveId, playerStats, combatOpponent.stats);
      setCombatOpponent(prev => prev ? ({ ...prev, stats: { ...prev.stats, composure: Math.max(0, prev.stats.composure - damage) } }) : null);
      const desc = await resolveCombatTurn('Henry James', combatOpponent.name, COMBAT_MOVES.find(m => m.id === moveId)!.name, ZONES[currentZone].name);
      addLog(desc, 'COMBAT');
      playSound('TYPEWRITER');
      
      if (combatOpponent.stats.composure - damage <= 0) { endCombat(true); return; }

      setTimeout(async () => {
          setPlayerStats(prev => ({ ...prev, composure: Math.max(0, prev.composure - 5) }));
          const aiDesc = await resolveCombatTurn(combatOpponent.name, 'Henry James', 'Retort', ZONES[currentZone].name);
          addLog(aiDesc, 'COMBAT');
          if (playerStats.composure - 5 <= 0) { endCombat(false); return; }
          setCombatPhase('PLAYER_CHOICE');
      }, 2000);
  };

  const endCombat = (victory?: boolean) => {
      setCombatPhase(victory === undefined ? 'IDLE' : (victory ? 'VICTORY' : 'DEFEAT'));
      if (victory) {
          setPlayerStats(prev => ({...prev, xp: prev.xp + 100}));
          playSound('CHIME');
      } else if (victory === false) {
          playSound('BUMP');
      }
      setTimeout(() => { setCombatPhase('IDLE'); setCombatOpponent(null); }, 3000);
  };

  const triggerProceduralEvent = async () => {
      playSound('CHIME');
      const event = await generateProceduralEvent(ZONES[currentZone].name, "Walking");
      if (event) setEventState(event);
  };

  const resolveEvent = (choice: EventChoice) => {
      playSound('UI_CLICK');
      // The event text log
      addLog(choice.text, 'EVENT');
      
      // Immediate Visual Outcome Notification (The Toast)
      let outcomeMsg = "You move on.";
      if (choice.outcomeType === 'GAIN_ITEM') {
          const newItem = {...PROCEDURAL_ITEMS[0], id: `r-${Date.now()}`};
          setInventory(prev => [...prev, newItem]);
          outcomeMsg = `Acquired: ${newItem.name}`;
      } else if (choice.outcomeType === 'GAIN_RUMOR') {
          const rumorText = choice.outcomeValue || "An interesting whisper...";
          setRumors(prev => [...prev, {id: Date.now().toString(), text: rumorText, source: 'Event', topic: [], value: 10}]);
          outcomeMsg = `Learned Rumor: "${rumorText.substring(0, 30)}..."`;
      } else if (choice.outcomeType === 'CHANGE_STAT') {
          setPlayerStats(prev => ({...prev, erudition: prev.erudition + 5}));
          outcomeMsg = "Your Erudition has increased.";
      } else if (choice.outcomeType === 'NOTHING') {
          outcomeMsg = "Nothing comes of it.";
      }

      // Trigger notification
      addNotification(outcomeMsg, 'ALERT');
      setEventState(null);
  };

  const triggerElevator = (type: 'ASCENT' | 'DESCENT', targetZone: ZoneId) => {
      playSound('STEAM');
      setCinematicState({ isPlaying: true, type: type === 'ASCENT' ? 'ELEVATOR_ASCENT' : 'ELEVATOR_DESCENT', progress: 0 });
      let progress = 0;
      const int = setInterval(() => {
          progress += 2;
          setCinematicState(prev => ({ ...prev, progress }));
          if (progress >= 100) {
              clearInterval(int);
              setCinematicState({ isPlaying: false, type: null, progress: 0 });
              loadZone(targetZone, type === 'ASCENT' ? 'DOWN' : 'UP');
          }
      }, 50);
  };

  const checkVeracity = async (eventText: string) => {
      playSound('UI_CLICK');
      setFactCheckState(prev => ({ ...prev, isOpen: true, isLoading: true, lastEvent: eventText }));
      const wikiData = await searchWikipedia(eventText.split(' ').slice(0, 5).join(' ')); // Simple keyword extraction
      const check = await generateFactCheck(eventText, wikiData || undefined);
      setFactCheckState({
          isOpen: true,
          isLoading: false,
          lastEvent: eventText,
          veracityScore: check.score,
          analysis: check.analysis,
          wikiData: wikiData
      });
  };

  const inspectItem = (item: Item) => {
      playSound('UI_CLICK');
      setArtifactState({ 
          isOpen: true, 
          item, 
          text: item.description, 
          image: null, 
          isLoading: false 
      });
  };

  const generateInspectionImage = async () => {
      if (!artifactState.item) return;
      setArtifactState(prev => ({ ...prev, isLoading: true }));
      const img = await generateArtifactImage(artifactState.item);
      setArtifactState(prev => ({ ...prev, image: img, isLoading: false }));
  };
  
  const generateInspectionText = async () => {
      if (!artifactState.item) return;
      setArtifactState(prev => ({ ...prev, isLoading: true }));
      const text = await generateArtifactDescription(artifactState.item);
      setArtifactState(prev => ({ ...prev, text, isLoading: false }));
  };

  const closeArtifactView = () => setArtifactState(prev => ({ ...prev, isOpen: false }));
  const toggleInventory = () => {
      setIsInventoryOpen(prev => !prev); // Toggles state to notify layout to switch tabs
      playSound('UI_CLICK');
  };
  const togglePlayerModal = () => {
      setIsPlayerModalOpen(prev => !prev);
      playSound('UI_CLICK');
  };

  return (
    <GameContext.Provider value={{
      lifecycle, startGame, endGame, gameSummary, saveGame,
      currentScenario, hoverInfo, setHoverInfo,
      playerPos, playerFacing, mapData, entities, gameLog, notifications, addNotification, gameTime,
      movePlayer, triggerInteraction, currentInteraction, interactionTarget,
      startEavesdrop, stopEavesdrop, isEavesdropping,
      currentZone, isLoadingZone,
      dialogueState, sendDialogue, closeDialogue, rumors,
      narratorHistory, sendNarratorMessage, isNarratorTyping,
      combatPhase, playerStats, playerProfile, combatOpponent, startCombat, executeCombatMove, endCombat,
      eventState, resolveEvent, cinematicState,
      inventory, isInventoryOpen, toggleInventory, artifactState, inspectItem, closeArtifactView, 
      generateInspectionImage, generateInspectionText,
      factCheckState, checkVeracity,
      isPlayerModalOpen, togglePlayerModal,
      isSettingsOpen, toggleSettings, volume, setVolume, textSpeed, setTextSpeed
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error('useGame must be used within a GameProvider');
  return context;
};
