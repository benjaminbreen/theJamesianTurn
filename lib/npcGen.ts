
import { Entity, ZoneId, Position } from '../types';

const FIRST_NAMES_M = ["Arthur", "Walter", "Louis", "Jules", "Pierre", "Charles", "Victor", "Emile", "Henri", "Gaston"];
const FIRST_NAMES_F = ["Marie", "Jeanne", "Sarah", "Louise", "Marguerite", "Alice", "Berthe", "Eugenie", "Camille", "Madeleine"];
const LAST_NAMES = ["Dubois", "Leroy", "Moreau", "Simon", "Laurent", "Michel", "Garcia", "Thomas", "Martin", "Bernard", "Dumont"];

const PROFESSIONS = [
    "Journalist", "Engineer", "Painter", "Socialite", "Inventor", "Critic", "Tourist", "Diplomat", "Actress", "Flaneur"
];

const GOALS_BY_ZONE: Record<ZoneId, string[]> = {
    ESPLANADE: ["admiring the flags", "looking for a lost glove", "waiting for a lover", "sketching the tower"],
    MACHINES: ["inspecting the dynamo", "complaining about the noise", "marvelling at progress", "seeking an investment"],
    TOWER: ["feeling vertigo", "writing a postcard", "surveying the city", "drinking champagne"],
    SALON: ["gossiping", "drinking absinthe", "reciting poetry", "avoiding a creditor"],
    STREET: ["hailing a cab", "buying a newspaper", "rushing to the opera", "strolling aimlessly"]
};

export const generateNpc = (zone: ZoneId, pos: Position, idSuffix: number): Entity => {
    const isMale = Math.random() > 0.5;
    const first = isMale 
        ? FIRST_NAMES_M[Math.floor(Math.random() * FIRST_NAMES_M.length)]
        : FIRST_NAMES_F[Math.floor(Math.random() * FIRST_NAMES_F.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    
    const profession = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
    const currentGoal = GOALS_BY_ZONE[zone][Math.floor(Math.random() * GOALS_BY_ZONE[zone].length)];

    return {
        id: `npc-gen-${idSuffix}`,
        name: `${first} ${last}`,
        type: 'NPC',
        position: pos,
        facing: 'DOWN',
        description: `A ${profession.toLowerCase()} who appears to be ${currentGoal}.`,
        profession: profession,
        bio: `${first} is a ${profession} from ${Math.random() > 0.7 ? 'abroad' : 'Paris'}.`,
        goal: 'WANDER',
        memories: []
    };
};
