import { useCallback } from 'react';
import { Card, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundManager';

const UPGRADES = [
    {
        type: 'material',
        icon: '🎨',
        name: 'Material',
        description: 'Better materials',
        effect: '+20% income',
        color: '#f472b6',
        gradientFrom: '#f472b655',
        gradientTo: '#ec489933',
    },
    {
        type: 'speed',
        icon: '🐢',
        name: 'Slow Block',
        description: 'Block moves slower',
        effect: 'Easier to stack',
        color: '#60a5fa',
        gradientFrom: '#60a5fa55',
        gradientTo: '#3b82f633',
    },
    {
        type: 'buildPower',
        icon: '⬆️',
        name: 'Build Power',
        description: 'More money per stack',
        effect: '+1 build power',
        color: '#fbbf24',
        gradientFrom: '#fbbf2455',
        gradientTo: '#f59e0b33',
    },
];

export default function UpgradePanel() {
    const { money, upgrades, getUpgradeCost, buyUpgrade, speedMultiplier, incomeMultiplier, buildPower } = useGameStore();

    const handleBuy = useCallback((type) => {
        const cost = getUpgradeCost(type);
        if (money >= cost) {
            buyUpgrade(type);
            soundManager.playUpgrade();
        }
    }, [money, getUpgradeCost, buyUpgrade]);

    const formatCost = (n) => {
        if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
        return `$${n}`;
    };

    const getCurrentStat = (type) => {
        if (type === 'material') return `×${incomeMultiplier.toFixed(1)} income`;
        if (type === 'speed') return `${Math.round((1 - speedMultiplier) * 100)}% slower`;
        if (type === 'buildPower') return `×${buildPower} power`;
    };

    return (
        <div
            className="shrink-0 px-3 py-2"
            style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            <div className="text-white/40 text-xs uppercase tracking-widest text-center mb-2">Upgrades</div>
            <div className="grid grid-cols-3 gap-2">
                {UPGRADES.map(upg => {
                    const cost = getUpgradeCost(upg.type);
                    const level = upgrades[upg.type];
                    const canAfford = money >= cost;

                    return (
                        <motion.div
                            key={upg.type}
                            className="upgrade-card rounded-2xl p-2 flex flex-col gap-1"
                            style={{
                                background: `linear-gradient(135deg, ${upg.gradientFrom}, ${upg.gradientTo})`,
                                border: `1px solid ${upg.color}33`,
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-base">{upg.icon}</span>
                                <Chip
                                    label={`Lv.${level}`}
                                    size="small"
                                    sx={{
                                        height: 16,
                                        fontSize: '0.6rem',
                                        background: `${upg.color}22`,
                                        color: upg.color,
                                        border: `1px solid ${upg.color}44`,
                                    }}
                                />
                            </div>
                            <div className="text-white font-semibold text-xs leading-tight">{upg.name}</div>
                            <div className="text-white/40 text-[10px]">{getCurrentStat(upg.type)}</div>
                            <Button
                                id={`upgrade-${upg.type}-btn`}
                                size="small"
                                variant="contained"
                                disabled={!canAfford}
                                onClick={() => handleBuy(upg.type)}
                                sx={{
                                    mt: 'auto',
                                    fontSize: '0.65rem',
                                    py: 0.3,
                                    px: 1,
                                    minWidth: 0,
                                    background: canAfford
                                        ? `linear-gradient(135deg, ${upg.color}, ${upg.color}aa)`
                                        : 'rgba(255,255,255,0.1)',
                                    color: canAfford ? '#000' : 'rgba(255,255,255,0.3)',
                                    fontWeight: 700,
                                    '&:disabled': {
                                        background: 'rgba(255,255,255,0.06)',
                                        color: 'rgba(255,255,255,0.2)',
                                    },
                                    '&:hover': {
                                        background: canAfford ? `${upg.color}` : 'rgba(255,255,255,0.1)',
                                    },
                                }}
                            >
                                {formatCost(cost)}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
