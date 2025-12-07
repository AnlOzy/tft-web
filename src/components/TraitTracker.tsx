import React, { useMemo } from 'react';
import type { Champion } from '../types';
import { calculateActiveTraits } from '../utils';

interface TraitTrackerProps {
    team: Champion[];
    extraTraits?: string[];
}

const TraitTracker: React.FC<TraitTrackerProps> = ({ team, extraTraits = [] }) => {
    const activeTraits = useMemo(() => {
        return calculateActiveTraits(team, extraTraits)
            .filter(t => t.count > 1 || t.activeTierIdx >= 0) // Hide inactive single-unit traits
            .sort((a, b) => b.count - a.count);
    }, [team, extraTraits]);

    return (
        <div className="trait-tracker" style={{
            background: 'var(--bg-glass)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(10px)',
            height: 'fit-content'
        }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Synergies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activeTraits.length === 0 && (
                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No active traits
                    </div>
                )}

                {activeTraits.map((trait) => {
                    const isActive = trait.activeTierIdx >= 0;
                    return (
                        <div key={trait.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            opacity: isActive ? 1 : 0.5,
                            padding: '0.5rem',
                            background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            borderRadius: '8px'
                        }}>
                            <div
                                className="trait-icon"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    background: isActive ? 'var(--accent-secondary)' : '#333',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    boxShadow: isActive ? '0 0 10px var(--accent-secondary)' : 'none'
                                }}
                            >
                                {trait.count}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{trait.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {trait.tiers.map((t, i) => (
                                        <span key={t} style={{
                                            color: i <= trait.activeTierIdx ? '#fff' : '#666',
                                            fontWeight: i <= trait.activeTierIdx ? 'bold' : 'normal'
                                        }}>
                                            {t}{i < trait.tiers.length - 1 ? ' > ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TraitTracker;
