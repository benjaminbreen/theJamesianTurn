
import { Item } from '../types';

// Mandatory Items that HJ always carries
export const MANDATORY_ITEMS: Item[] = [
    { 
        id: 'letter_william', 
        name: 'Letter from William', 
        description: 'A dense missive from your brother, dated October 4th. He speaks of his new professorship at Harvard and chides you gently for your "perpetual European exile." The handwriting is abominable.', 
        icon: '✉️', 
        type: 'BOOK' 
    },
    { 
        id: 'commonplace_book', 
        name: 'Commonplace Book', 
        description: 'A small leather-bound volume for jotting down names, overheard phrases, and architectural details. It contains the germ of an idea for a story about a man who misses his own life.', 
        icon: '📓', 
        type: 'BOOK' 
    }
];

// Pool of plausible items for 1889
export const HJ_INVENTORY_POOL: Item[] = [
    { 
        id: 'pince_nez', 
        name: 'Tortoiseshell Pince-Nez', 
        description: 'Your reading glasses, suspended on a black silk cord. They pinch the nose uncomfortably but are necessary for discerning the finer details of the Impressionist exhibits.', 
        icon: '👓', 
        type: 'GADGET' 
    },
    { 
        id: 'calling_cards', 
        name: 'Calling Cards', 
        description: 'A silver case containing cards engraved "Henry James, 34 De Vere Gardens". Essential for leaving with the concierge when visiting the Faubourg Saint-Germain.', 
        icon: '📇', 
        type: 'CURIOSITY' 
    },
    { 
        id: 'gloves', 
        name: 'Dove-Grey Kid Gloves', 
        description: 'Immaculate leather gloves. A gentleman does not touch the bannisters of the Eiffel Tower with his bare hands.', 
        icon: '🧤', 
        type: 'ARTIFACT' 
    },
    { 
        id: 'digestive_pills', 
        name: 'Bismuth Lozenges', 
        description: 'For the inevitable dyspepsia brought on by rich French sauces and the anxiety of crowds.', 
        icon: '💊', 
        type: 'GADGET' 
    },
    { 
        id: 'matchbox', 
        name: 'Vesta Case', 
        description: 'A small silver container for friction matches. It has a rough striking surface on the bottom.', 
        icon: '🔥', 
        type: 'GADGET' 
    },
    { 
        id: 'handkerchief', 
        name: 'Irish Linen Handkerchief', 
        description: 'Monogrammed. Useful for dabbing one\'s brow in the heat of the Gallery of Machines.', 
        icon: '⬜', 
        type: 'ARTIFACT' 
    },
    { 
        id: 'baedeker', 
        name: 'Baedeker\'s Paris (1889)', 
        description: 'The red-bound bible of the tourist. You pretend to despise it, yet you consult it frequently for restaurant recommendations.', 
        icon: '📕', 
        type: 'BOOK' 
    },
    { 
        id: 'opera_glasses', 
        name: 'Mother-of-Pearl Opera Glasses', 
        description: 'Intended for the theatre, but surprisingly useful for observing social interactions from a safe distance across the Esplanade.', 
        icon: '🔭', 
        type: 'GADGET' 
    },
    { 
        id: 'invitation_embassy', 
        name: 'Embassy Invitation', 
        description: 'A stiff card inviting you to a reception at the American Legation. You have not yet decided whether to attend.', 
        icon: '📨', 
        type: 'CURIOSITY' 
    },
    { 
        id: 'fountain_pen', 
        name: 'Gold-Nibbed Stylograph', 
        description: 'Modern, reliable, and prone to leaking ink into your waistcoat pocket if not handled with extreme care.', 
        icon: '🖋️', 
        type: 'GADGET' 
    }
];

// Procedural items found in the world
export const PROCEDURAL_ITEMS: Item[] = [
    { id: 'ticket_stub', name: 'Exposition Ticket Stub', description: 'A crumpled piece of blue paper.', icon: '🎫', type: 'CURIOSITY' },
    { id: 'lost_fan', name: 'Lace Fan', description: 'Dropped by a lady in a hurry.', icon: '🪭', type: 'ARTIFACT' },
    { id: 'newspaper', name: 'Le Figaro', description: 'Today\'s edition. The headlines scream about the Eiffel Tower.', icon: '📰', type: 'BOOK' },
    { id: 'postcard_tower', name: 'Souvenir Postcard', description: 'A lithograph of the tower, sold for 10 centimes.', icon: '🖼️', type: 'CURIOSITY' }
];

export const generateStartingInventory = (): Item[] => {
    // 1. Start with mandatory items
    const inventory = [...MANDATORY_ITEMS];

    // 2. Pick 3 random items from the pool to reach 5 total
    const shuffledPool = [...HJ_INVENTORY_POOL].sort(() => 0.5 - Math.random());
    const randomPicks = shuffledPool.slice(0, 3);

    return [...inventory, ...randomPicks];
};
