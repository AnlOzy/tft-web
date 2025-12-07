import type { Champion } from './types';
import { traits as allTraits } from './data';

export interface ActiveTrait {
    name: string;
    count: number;
    activeTierIdx: number;
    nextTier: number | undefined;
    tiers: number[];
}

export const calculateActiveTraits = (team: Champion[], extraTraits: string[] = []): ActiveTrait[] => {
    const counts: Record<string, number> = {};

    // Unique unit logic
    const uniqueChamps = Array.from(new Set(team.map(c => c.name)))
        .map(name => team.find(c => c.name === name)!);

    uniqueChamps.forEach(champ => {
        champ.traits.forEach(trait => {
            counts[trait] = (counts[trait] || 0) + 1;
        });
    });

    // Add extra traits (Emblems)
    extraTraits.forEach(trait => {
        counts[trait] = (counts[trait] || 0) + 1;
    });

    const traitData = Object.entries(counts).map(([traitName, count]) => {
        const traitDef = allTraits.find(t => t.name === traitName);
        if (!traitDef) return null;

        let activeTierIdx = -1;
        for (let i = traitDef.tiers.length - 1; i >= 0; i--) {
            if (count >= traitDef.tiers[i]) {
                activeTierIdx = i;
                break;
            }
        }

        const nextTier = traitDef.tiers.find(t => count < t);

        return {
            name: traitDef.name,
            tiers: traitDef.tiers,
            count,
            activeTierIdx,
            nextTier
        };
    }).filter((t): t is ActiveTrait => t !== null);

    return traitData.sort((a, b) => {
        if (a.activeTierIdx !== b.activeTierIdx) return b.activeTierIdx - a.activeTierIdx;
        return b.count - a.count;
    });
};
