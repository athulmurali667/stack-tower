import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundManager';
import HeaderBar from '../components/HeaderBar';
import TowerCanvas from '../components/TowerCanvas';
import UpgradePanel from '../components/UpgradePanel';
import MilestoneDialog from '../components/MilestoneDialog';
import WinDialog from '../components/WinDialog';

export default function GamePage() {
    const navigate = useNavigate();
    const {
        gameStarted,
        currentFloor,
        addIdleIncome,
        milestone,
        won,
        soundEnabled,
    } = useGameStore();

    const idleRef = useRef(null);

    useEffect(() => {
        if (!gameStarted) {
            navigate('/');
        }
    }, [gameStarted, navigate]);

    // Keep soundManager in sync
    useEffect(() => {
        soundManager.setEnabled(soundEnabled);
    }, [soundEnabled]);

    // Idle income ticker
    useEffect(() => {
        idleRef.current = setInterval(() => {
            addIdleIncome();
        }, 1000);
        return () => clearInterval(idleRef.current);
    }, [addIdleIncome]);

    // Play milestone sound
    const prevMilestone = useRef(null);
    useEffect(() => {
        if (milestone && milestone !== prevMilestone.current) {
            soundManager.playMilestone();
            prevMilestone.current = milestone;
        }
    }, [milestone]);

    // Play win sound
    const prevWon = useRef(false);
    useEffect(() => {
        if (won && !prevWon.current) {
            soundManager.playWin();
            prevWon.current = true;
        }
        if (!won) prevWon.current = false;
    }, [won]);

    return (
        <div className="sky-bg w-full h-screen flex flex-col overflow-hidden" style={{ maxHeight: '100vh' }}>
            {/* Header */}
            <HeaderBar />

            {/* Game Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Tower Canvas - main area */}
                <div className="flex-1 relative overflow-hidden">
                    <TowerCanvas />
                </div>
            </div>

            {/* Upgrade Panel at bottom */}
            <UpgradePanel />

            {/* Dialogs */}
            <MilestoneDialog />
            <WinDialog />
        </div>
    );
}
