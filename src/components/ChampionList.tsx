import React, { useState } from 'react';
import type { Champion } from '../types';
import { champions } from '../data';

interface ChampionListProps {
    onAdd: (champ: Champion) => void;
    team: Champion[];
}

const ChampionList: React.FC<ChampionListProps> = ({ onAdd }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'cost' | 'name'>('cost');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const filteredChamps = champions.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'cost') {
            return sortOrder === 'asc' ? a.cost - b.cost : b.cost - a.cost;
        } else {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
    });

    const getCostColor = (cost: number) => {
        switch (cost) {
            case 1: return 'var(--rarity-1)';
            case 2: return 'var(--rarity-2)';
            case 3: return 'var(--rarity-3)';
            case 4: return 'var(--rarity-4)';
            case 5: return 'var(--rarity-5)';
            case 7: return 'var(--rarity-7)';
            default: return '#333';
        }
    };

    const getCostBorder = (cost: number) => {
        switch (cost) {
            case 1: return '#444';
            case 2: return '#2a9e48';
            case 3: return '#2ba4d1';
            case 4: return '#a82ec2';
            case 5: return '#d69e1e';
            case 7: return '#b9f2ff';
            default: return '#333';
        }
    }

    return (
        <div className="champion-list" style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search champions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '0.8rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none'
                    }}
                />

                {/* Sort Controls */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'cost' | 'name')}
                    style={{
                        padding: '0.5rem',
                        background: 'var(--bg-secondary)',
                        color: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px'
                    }}
                >
                    <option value="cost">Sort: Cost</option>
                    <option value="name">Sort: Name</option>
                </select>

                <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--bg-secondary)',
                        color: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}
                >
                    {sortOrder === 'asc' ? '⬆' : '⬇'}
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.8rem',
                maxHeight: '600px',
                overflowY: 'auto',
                paddingRight: '0.5rem'
            }}>
                {filteredChamps.map((champ) => {
                    const borderColor = getCostBorder(champ.cost);
                    // Use darker diamond color for text if cost is 7 because bg is light
                    const textColor = champ.cost === 7 ? '#000' : 'white';

                    return (
                        <div
                            key={champ.name}
                            onClick={() => onAdd(champ)}
                            style={{
                                background: getCostColor(champ.cost),
                                border: `2px solid ${borderColor}`,
                                borderRadius: '8px',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'transform 0.1s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.2rem',
                                color: textColor // Better contrast for diamond
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem' }}>{champ.name}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>${champ.cost}</div>
                            <div style={{ fontSize: '0.7rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                                {champ.traits.map(t => (
                                    <span key={t} style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '4px', color: 'white' }}>{t}</span>
                                ))}
                            </div>
                            {champ.is_locked && (
                                <div style={{ position: 'absolute', top: 2, right: 2 }}>🔒</div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ChampionList;
