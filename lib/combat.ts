
import { CombatMove, PlayerStats } from '../types';

export const PLAYER_STARTING_STATS: PlayerStats = {
    composure: 100,
    maxComposure: 100,
    reputation: 10,
    erudition: 15,
    level: 1,
    xp: 0
};

export const COMBAT_MOVES: CombatMove[] = [
    {
        id: 'GLARE',
        name: 'Withering Glare',
        description: 'A look of silent judgment. Damages Composure.',
        cost: 0,
        type: 'OFFENSE'
    },
    {
        id: 'REFERENCE',
        name: 'Obscure Reference',
        description: 'A literary allusion only the elite understand. High Damage.',
        cost: 0,
        type: 'OFFENSE'
    },
    {
        id: 'COMPLIMENT',
        name: 'Backhanded Compliment',
        description: 'Praises their flaw. Restores your Composure slightly.',
        cost: 0,
        type: 'SUPPORT'
    }
];

export const calculateDamage = (moveId: string, attackerStats: any, defenderStats: any) => {
    let baseDamage = 10;
    
    switch (moveId) {
        case 'GLARE':
            baseDamage = 15 + (attackerStats.reputation / 2);
            break;
        case 'REFERENCE':
            baseDamage = 20 + (attackerStats.erudition);
            break;
        case 'COMPLIMENT':
            baseDamage = 10;
            break;
    }

    // Mitigation
    const damage = Math.max(0, baseDamage - (defenderStats.reputation / 3));
    return Math.floor(damage);
};
