
import { ZoneId } from '../types';

export interface ZoneConfig {
  id: ZoneId;
  name: string;
  description: string;
  prompt: string; // Imagen prompt
  ambience: string; // Description for future audio
}

export const ZONES: Record<ZoneId, ZoneConfig> = {
  ESPLANADE: {
    id: 'ESPLANADE',
    name: 'The Esplanade des Invalides',
    description: 'A sprawling open space teeming with visitors, fluttering flags, and the distant outline of the Eiffel Tower.',
    prompt: 'Wide angle etching of the Esplanade des Invalides at the 1889 Paris World Fair, crowds in Victorian dress, Beaux-Arts architecture, detailed line work, sepia tone.',
    ambience: 'Wind, distant chatter, carriage wheels.',
  },
  MACHINES: {
    id: 'MACHINES',
    name: 'The Gallery of Machines',
    description: 'A cathedral of iron and glass. The hum of dynamos is deafening.',
    prompt: 'Interior view of the Galerie des Machines 1889, massive iron arches, steam engines, industrial atmosphere, architectural drawing style, volumetric lighting.',
    ambience: 'Heavy industrial hum, steam hisses, metallic clanking.',
  },
  TOWER: {
    id: 'TOWER',
    name: 'The Eiffel Tower (First Platform)',
    description: 'High above Paris. The city spreads out like a map below.',
    prompt: 'View from the Eiffel Tower balcony 1889, looking down at Paris, iron girders in foreground, dizzying perspective, intricate engineering details, engraving style.',
    ambience: 'High wind, creaking metal, distant city noise.',
  },
  SALON: {
    id: 'SALON',
    name: 'A Private Salon',
    description: 'An opulent room filled with smoke, velvet, and dangerous conversation.',
    prompt: 'Interior of a 19th century parisian literary salon, velvet curtains, gas lamps, smoke, intricate wallpaper, highly detailed etching style.',
    ambience: 'Clinking glasses, muffled laughter, ticking clock.',
  },
  STREET: {
    id: 'STREET',
    name: 'Boulevard Saint-Michel',
    description: 'The bustling Latin Quarter. Cafes spill onto the pavement.',
    prompt: 'Street level view of 1889 Paris Boulevard, cobblestones, cafes, gaslights, passersby in top hats, rainy evening, lithograph style.',
    ambience: 'Horse hooves on cobblestone, street vendors, rain.',
  }
};
