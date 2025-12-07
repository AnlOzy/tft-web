import React from 'react';
import type { Champion } from '../types';

interface TeamDisplayProps {
    team: Champion[];
    teamSize: number;
    onRemove: (index: number) => void;
    onResize: (size: number) => void;
    lockedCount: number; // New: how many are user-selected
    onLock: (index: number) => void; // New: click auto champ to lock it
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, teamSize, onRemove, onResize, lockedCount, onLock }) => {
    const slots = Array(teamSize).fill(null);

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

    const getCostColor = (cost: number) => {
        switch (cost) {
            case 1: return 'var(--rarity-1)';
            case 2: return 'var(--rarity-2)';
            case 3: return 'var(--rarity-3)';
            case 4: return 'var(--rarity-4)';
            case 5: return 'var(--rarity-5)';
            case 7: return 'var(--rarity-7)'; // Diamond
            default: return '#333';
        }
    };

    return (
        <div className="team-display" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ color: 'var(--accent-primary)' }}>Your Team ({team.length}/{teamSize})</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label>Team Size:</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={teamSize}
                        onChange={(e) => onResize(Number(e.target.value))}
                        style={{
                            padding: '0.4rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'white',
                            width: '60px'
                        }}
                    />
                </div>
            </div>

            <div className="team-grid">
                {slots.map((_, idx) => {
                    const champ = team[idx];
                    const isLocked = idx < lockedCount; // First N are manual/locked

                    if (!champ) {
                        return (
                            <div key={`empty-${idx}`} style={{
                                height: '120px',
                                border: '2px dashed var(--border-color)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)',
                                opacity: 0.5
                            }}>
                                Empty Slot
                            </div>
                        );
                    }

                    return (
                        <div
                            key={`${champ.name}-${idx}`}
                            onClick={() => isLocked ? onRemove(idx) : onLock(idx)}
                            style={{
                                background: getCostColor(champ.cost),
                                border: `2px solid ${getCostBorder(champ.cost)}`,
                                borderRadius: '8px',
                                padding: '0.5rem',
                                position: 'relative',
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                opacity: isLocked ? 1 : 0.7,
                                outline: !isLocked ? '2px dashed var(--accent-secondary)' : 'none',
                                outlineOffset: '2px',
                                cursor: 'pointer' // Always pointer now
                            }}
                        >
                            {!isLocked && (
                                <div style={{
                                    position: 'absolute', top: '-10px', background: 'var(--accent-secondary)',
                                    fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'
                                }}>
                                    AUTO
                                </div>
                            )}

                            <div style={{ fontWeight: 'bold', color: champ.cost === 7 ? 'black' : 'white' }}>{champ.name}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, color: champ.cost === 7 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)' }}>${champ.cost}</div>
                            {champ.is_locked && (
                                <div style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    fontSize: '1rem',
                                    opacity: 0.9,
                                    zIndex: 5
                                }}>
                                    🔒
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamDisplay;
