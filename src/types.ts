
export interface Champion {
    name: string;
    traits: string[];
    cost: number;
    is_locked: boolean;
}

export interface Trait {
    name: string;
    tiers: number[]; // e.g. [3, 5, 7] means bonuses at 3, 5, 7 units
}
