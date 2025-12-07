import React, { useState } from 'react';
import ChampionList from './ChampionList';
import TeamDisplay from './TeamDisplay';
import TraitTracker from './TraitTracker';
import type { Champion } from '../types';
import { findBestTeamCompletion } from '../optimizer';

import { traits as allTraits } from '../data';

const TeamBuilder: React.FC = () => {
    const [lockedTeam, setLockedTeam] = useState<Champion[]>([]);
    const [teamSize, setTeamSize] = useState(8);
    const [fullTeam, setFullTeam] = useState<Champion[]>([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [emblems, setEmblems] = useState<string[]>([]);
    const [selectedEmblem, setSelectedEmblem] = useState<string>("");
    const [optimizationStrategy, setOptimizationStrategy] = useState<'variety' | 'primary_focus'>('variety');

    React.useEffect(() => {
        setFullTeam([...lockedTeam]);
    }, [lockedTeam]);

    const handleAddChampion = (champ: Champion) => {
        if (lockedTeam.length >= teamSize) {
            alert("Team is full!");
            return;
        }
        setLockedTeam([...lockedTeam, champ]);
    };

    const handleRemoveChampion = (index: number) => {
        if (index < lockedTeam.length) {
            const newTeam = [...lockedTeam];
            newTeam.splice(index, 1);
            setLockedTeam(newTeam);
            // Fix: Immediately sync fullTeam to prevent "Auto" flicker before useEffect runs
            setFullTeam(newTeam);
        } else {
            setFullTeam([...lockedTeam]);
        }
    };

    const handleLockAutoChamp = (index: number) => {
        const champToLock = fullTeam[index];
        if (champToLock) setLockedTeam([...lockedTeam, champToLock]);
    };

    const handleOptimize = async () => {
        setIsOptimizing(true);
        setTimeout(() => {
            const optimized = findBestTeamCompletion(lockedTeam, teamSize, emblems, optimizationStrategy);
            setFullTeam(optimized);
            setIsOptimizing(false);
        }, 100);
    };

    const handleAddEmblem = () => {
        if (selectedEmblem) {
            setEmblems([...emblems, selectedEmblem]);
            setSelectedEmblem("");
        }
    };

    const handleRemoveEmblem = (index: number) => {
        const newEmblems = [...emblems];
        newEmblems.splice(index, 1);
        setEmblems(newEmblems);
    }

    return (
        <div className="team-builder" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>


            <div className="builder-layout">
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                                value={selectedEmblem}
                                onChange={(e) => setSelectedEmblem(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'white', border: '1px solid var(--border-color)' }}
                            >
                                <option value="">Select Trait (+1)...</option>
                                {allTraits
                                    .filter(t => t.tiers.length > 1)
                                    .map(t => <option key={t.name} value={t.name}>{t.name}</option>)
                                }
                            </select>
                            <button onClick={handleAddEmblem} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>+ Add</button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                                value={optimizationStrategy}
                                onChange={(e) => setOptimizationStrategy(e.target.value as 'variety' | 'primary_focus')}
                                style={{
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    background: 'var(--bg-secondary)',
                                    color: 'white',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="variety">Most Traits Active</option>
                                <option value="primary_focus">Primary Trait Focus</option>
                            </select>

                            <button
                                onClick={handleOptimize}
                                disabled={isOptimizing || lockedTeam.length >= teamSize}
                                style={{
                                    background: 'var(--accent-secondary)',
                                    color: 'white',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    opacity: (isOptimizing || lockedTeam.length >= teamSize) ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {isOptimizing ? 'Thinking...' : '⚡ Auto-Complete'}
                            </button>
                        </div>
                    </div>

                    {emblems.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {emblems.map((emb, idx) => (
                                <div key={idx} style={{
                                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                    color: 'black',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span>+1 {emb}</span>
                                    <button onClick={() => handleRemoveEmblem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <TeamDisplay
                        team={fullTeam}
                        teamSize={teamSize}
                        onRemove={handleRemoveChampion}
                        onResize={setTeamSize}
                        lockedCount={lockedTeam.length}
                        onLock={handleLockAutoChamp}
                    />
                    <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Available Champions</h3>
                    <ChampionList onAdd={handleAddChampion} team={lockedTeam} />
                </div>

                <div>
                    <div className="trait-sidebar-container">
                        <TraitTracker team={fullTeam} extraTraits={emblems} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamBuilder;
