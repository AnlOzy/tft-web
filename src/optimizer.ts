import type { Champion } from './types';
import { calculateActiveTraits } from './utils';
import { champions as allChampions } from './data';

// Heuristic score for a team configuration
const scoreTeam = (
    team: Champion[],
    extraTraits: string[]
): number => {
    const traits = calculateActiveTraits(team, extraTraits);
    let score = 0;

    for (const t of traits) {
        if (t.activeTierIdx >= 0) {
            // IGNORE: "Unique" type traits and "Darkin"
            if (t.tiers.length === 1 || t.name === "Darkin") {
                continue;
            }

            // BASE SCORE
            // Standard weighting: Deep traits are valuable, Variety is valuable.
            score += 10000;

            // DEPTH BONUS (Tier level)
            score += (t.activeTierIdx + 1) * 2000;
        }

        // Partial progress bonus (tie-breaker)
        // Helps pick units that put us closer to next tier
        if (t.nextTier) {
            score += (t.count / t.nextTier) * 500;
        }
    }

    return score;
};

const getPrimaryTrait = (team: Champion[]): string | null => {
    if (team.length === 0) return null;

    // Count frequency of the FIRST trait of each champion (Primary)
    const counts: Record<string, number> = {};
    for (const c of team) {
        const first = c.traits[0];
        if (first) counts[first] = (counts[first] || 0) + 1;
    }

    // Find the most frequent primary trait
    let maxTrait: string | null = null;
    let maxCount = -1;

    for (const [trait, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            maxTrait = trait;
        }
    }
    return maxTrait;
};

export const findBestTeamCompletion = (
    currentTeam: Champion[],
    teamSize: number,
    extraTraits: string[] = [],
    strategy: 'variety' | 'primary_focus' = 'variety'
): Champion[] => {
    let builtTeam = [...currentTeam];
    const slotsNeeded = teamSize - builtTeam.length;

    if (slotsNeeded <= 0) return builtTeam;

    // Identify target strategy
    const primaryTrait = (strategy === 'primary_focus') ? getPrimaryTrait(currentTeam) : null;

    for (let step = 0; step < slotsNeeded; step++) {
        let bestCandidate: Champion | null = null;
        let bestScore = -Infinity;

        // 1. Determine eligible candidates
        let candidates = allChampions.filter(c => !builtTeam.some(bc => bc.name === c.name));

        // 2. STRICT FILTER: If in Primary Focus mode, filter for that trait FIRST
        if (primaryTrait) {
            const forcedCandidates = candidates.filter(c => c.traits.includes(primaryTrait));

            // If we have available units corresponding to the primary trait, WE MUST PICK THEM.
            // This satisfies "use every champion possible of most selected primary trait".
            if (forcedCandidates.length > 0) {
                candidates = forcedCandidates;
            }
            // If forcedCandidates is empty, we fall back to the full 'candidates' list 
            // and simply optimize for the best remaining synergy (Backfill).
        }

        // 3. Score the candidates
        for (const champ of candidates) {
            const trialTeam = [...builtTeam, champ];

            // We use the standard scorer now because the 'strategy' is enforcing via the candidate list.
            const score = scoreTeam(trialTeam, extraTraits);

            if (score > bestScore) {
                bestScore = score;
                bestCandidate = champ;
            }
        }

        if (bestCandidate) {
            builtTeam.push(bestCandidate);
        }
    }

    return builtTeam;
};
