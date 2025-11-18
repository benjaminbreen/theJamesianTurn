
import { ZoneId, Item } from '../types';
import { HJ_INVENTORY_POOL } from './items';

export interface Objective {
    id: string;
    text: string;
    isComplete: boolean;
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    introText: string;
    startZone: ZoneId;
    objectives: Objective[];
    bonusItems: Item[];
}

export const SCENARIOS: Scenario[] = [
    {
        id: 'missing_manuscript',
        title: 'The Lost Pages',
        description: 'You have misplaced a crucial chapter of "The Tragic Muse".',
        introText: "Disaster. The third chapter of your serialization for The Atlantic Monthly is gone. You last had it while arguing with a critic near the Eiffel Tower. You must retrace your steps before the post leaves for Boston.",
        startZone: 'TOWER',
        objectives: [
            { id: 'find_pages', text: 'Search the Tower for the manuscript', isComplete: false },
            { id: 'avoid_distraction', text: 'Do not engage with Oscar Wilde (he talks too much)', isComplete: false }
        ],
        bonusItems: []
    },
    {
        id: 'social_obligation',
        title: 'The Unavoidable Reception',
        description: 'You are expected at the American Legation, but you have no gift.',
        introText: "The Ambassador is a bore, but one must maintain appearances. You need to find a suitable, specifically French curiosity to present as a gift, then make your way to the Salons to deliver it.",
        startZone: 'STREET',
        objectives: [
            { id: 'find_gift', text: 'Acquire a rare Artifact or Curiosity', isComplete: false },
            { id: 'reach_salon', text: 'Travel to the Private Salon', isComplete: false }
        ],
        bonusItems: [HJ_INVENTORY_POOL.find(i => i.id === 'calling_cards')!]
    },
    {
        id: 'technological_anxiety',
        title: 'The Machine in the Garden',
        description: 'Your brother William wants a report on the dynamos. You dread it.',
        introText: "William has written asking for your 'impressions' of the Gallery of Machines. You find the place hellish, but you promised. You must go there, observe three distinct machines, and compose your thoughts.",
        startZone: 'ESPLANADE',
        objectives: [
            { id: 'enter_machines', text: 'Enter the Gallery of Machines', isComplete: false },
            { id: 'observe_machines', text: 'Inspect 3 Mechanical Obstacles', isComplete: false }
        ],
        bonusItems: [HJ_INVENTORY_POOL.find(i => i.id === 'pince_nez')!]
    },
    {
        id: 'critics_revenge',
        title: 'The Critic\'s Revenge',
        description: 'A scathing review has appeared in Le Figaro. You must clear your head.',
        introText: "They called your prose 'labored' and your themes 'bloodless'. The insolence! You need to find someone—anyone—of high reputation to validate your standing, or perhaps just win a debate to restore your confidence.",
        startZone: 'SALON',
        objectives: [
            { id: 'win_combat', text: 'Defeat an NPC in Social Combat', isComplete: false },
            { id: 'raise_reputation', text: 'Raise Reputation to 20', isComplete: false }
        ],
        bonusItems: []
    }
];
