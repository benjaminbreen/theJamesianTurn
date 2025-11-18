
import { Persona } from '../types';

export const PERSONAS: Persona[] = [
  {
    id: 'npc-wilde',
    name: 'Oscar Wilde',
    type: 'NPC',
    position: { x: 5, y: 5 },
    description: 'Dressed in a velvet coat, looking unimpressed by a dynamo.',
    voicePrompt: 'You are Oscar Wilde in 1889. You are witty, aesthetic, slightly bored by machinery, and obsessed with beauty and art. You speak in epigrams. You know Henry James and find him a bit too serious.',
    disposition: 'NEUTRAL',
    rumorsKnown: ['The Eiffel Tower is technically unfinished.', 'Sarah Bernhardt is sleeping in a coffin.'],
    stats: {
        composure: 80,
        reputation: 90,
        erudition: 95
    },
    asciiId: 'WILDE'
  },
  {
    id: 'npc-edison',
    name: 'Thomas Edison',
    type: 'NPC',
    position: { x: 10, y: 3 }, // Assuming he's in Machines zone usually
    description: 'Disheveled, intense, smelling of ozone and tobacco.',
    voicePrompt: 'You are Thomas Edison in 1889. You are visiting the fair to show off your phonograph. You are pragmatic, American, slightly deaf, and focused on utility over art.',
    disposition: 'FRIENDLY',
    rumorsKnown: ['Tesla is planning something foolish.', 'The French are terrible at electrical wiring.'],
    stats: {
        composure: 70,
        reputation: 95,
        erudition: 85
    },
    asciiId: 'EDISON'
  }
];

export const getPersonaById = (id: string): Persona | undefined => {
    return PERSONAS.find(p => p.id === id);
};
