
import { PlayerProfile, Item } from '../types';
import { HJ_INVENTORY_POOL, MANDATORY_ITEMS } from './items';

const MENTAL_STATES = [
    "Melancholy Observance",
    "Aesthetic Overload",
    "Social Anxiety",
    "Creative Fervor",
    "Digestive Unease",
    "Wistful Nostalgia",
    "Critical Detachment"
];

const CLOTHING_SETS = [
    ["Frock Coat (Black)", "Silk Top Hat", "Dove-Grey Gloves", "Starched Collar"],
    ["Traveler's Tweed Suit", "Bowler Hat", "Walking Boots", "Silk Cravat"],
    ["Evening Dress", "Opera Cloak", "White Kid Gloves", "Patent Leather Shoes"],
    ["Velvet Smoking Jacket (Ill-advised)", "Loose Trousers", "Slippers"]
];

const PROJECTS_1889 = [
    "Serializing 'The Tragic Muse' for The Atlantic Monthly",
    "Translating Daudet's 'Port-Tarascon'",
    "Drafting a play for the London stage (Doomed)",
    "Essay: 'The Art of Fiction' (Revisions)",
    "Notes on 'The Lesson of the Master'"
];

const STATUS_EFFECTS = [
    "Jet Lagged",
    "Over-Caffeinated",
    "Existential Dread",
    "Inspired",
    "Winded"
];

export const generatePlayerProfile = (): PlayerProfile => {
    const clothing = CLOTHING_SETS[Math.floor(Math.random() * CLOTHING_SETS.length)];
    const mental = MENTAL_STATES[Math.floor(Math.random() * MENTAL_STATES.length)];
    const project = PROJECTS_1889[Math.floor(Math.random() * PROJECTS_1889.length)];
    
    // Pick 1-2 random status effects
    const effects = [];
    const numEffects = Math.floor(Math.random() * 2) + 1;
    for(let i=0; i<numEffects; i++) {
        effects.push(STATUS_EFFECTS[Math.floor(Math.random() * STATUS_EFFECTS.length)]);
    }

    return {
        mentalState: mental,
        currentProject: project,
        clothing: clothing,
        statusEffects: [...new Set(effects)] // Remove duplicates
    };
};

export const generateStartingInventory = (): Item[] => {
    // 1. Start with mandatory items
    const inventory = [...MANDATORY_ITEMS];

    // 2. Pick 3 random items from the dedicated pool
    const shuffled = [...HJ_INVENTORY_POOL].sort(() => 0.5 - Math.random());
    const randomPicks = shuffled.slice(0, 3);
    
    return [...inventory, ...randomPicks];
};
