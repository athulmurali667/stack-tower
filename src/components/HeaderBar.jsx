import { useGameStore } from '../store/gameStore';
import SoundToggle from './SoundToggle';

export default function HeaderBar() {
    const { money, currentFloor, incomeMultiplier } = useGameStore();
    const idleIncome = Math.round(currentFloor * 2 * incomeMultiplier);

    const formatMoney = (n) => {
        if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
        if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
        return `$${Math.floor(n)}`;
    };

    return (
        <div
            className="flex items-center justify-between px-4 py-2 shrink-0"
            style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            {/* Money */}
            <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">💰</span>
                <div>
                    <div className="text-yellow-300 font-bold text-lg leading-tight">{formatMoney(money)}</div>
                    <div className="text-yellow-500/60 text-xs">+{formatMoney(idleIncome)}/sec</div>
                </div>
            </div>

            {/* Floor */}
            <div className="flex flex-col items-center">
                <div className="text-white/50 text-xs uppercase tracking-widest">Floor</div>
                <div className="game-title text-3xl font-black text-transparent bg-clip-text"
                    style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #60a5fa)' }}>
                    {currentFloor}
                    <span className="text-white/30 text-lg">/100</span>
                </div>
                {/* Progress bar */}
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${(currentFloor / 100) * 100}%`,
                            background: 'linear-gradient(90deg, #4ade80, #60a5fa)',
                        }}
                    />
                </div>
            </div>

            {/* Sound */}
            <SoundToggle />
        </div>
    );
}
