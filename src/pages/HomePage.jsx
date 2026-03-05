import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import { useGameStore } from '../store/gameStore';

const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
}));

export default function HomePage() {
    const navigate = useNavigate();
    const startGame = useGameStore(s => s.startGame);

    const handleStart = () => {
        startGame();
        navigate('/game');
    };

    return (
        <div className="sky-bg relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Stars */}
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 2 + star.delay, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}

            {/* Floating blocks decoration */}
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="absolute rounded-lg opacity-20"
                    style={{
                        width: 60 + i * 20,
                        height: 16,
                        background: `hsl(${140 + i * 40}, 80%, 60%)`,
                        left: `${20 + i * 25}%`,
                        top: `${30 + i * 15}%`,
                    }}
                    animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                />
            ))}

            {/* Main Content */}
            <motion.div
                className="flex flex-col items-center gap-8 z-10 text-center px-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Title */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="game-title text-6xl md:text-8xl font-black text-transparent bg-clip-text"
                        style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #60a5fa, #f472b6)' }}>
                        STACK
                    </h1>
                    <h1 className="game-title text-6xl md:text-8xl font-black text-transparent bg-clip-text"
                        style={{ backgroundImage: 'linear-gradient(135deg, #f472b6, #60a5fa, #4ade80)' }}>
                        TOWER
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    className="text-lg text-white/60 max-w-sm leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Stack blocks, build towers, earn coins. Reach floor 100 to win!
                </motion.p>

                {/* Floor badges */}
                <motion.div
                    className="flex gap-3 flex-wrap justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {['🏗️ Build', '💰 Earn', '⬆️ Upgrade', '🏆 Win'].map(label => (
                        <span key={label} className="px-3 py-1 rounded-full text-sm font-semibold text-white/70"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            {label}
                        </span>
                    ))}
                </motion.div>

                {/* Start Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        id="start-game-btn"
                        variant="contained"
                        size="large"
                        onClick={handleStart}
                        sx={{
                            fontSize: '1.3rem',
                            px: 6,
                            py: 2,
                            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                            color: '#0a1a0a',
                            fontWeight: 900,
                            letterSpacing: '0.05em',
                            boxShadow: '0 0 30px rgba(74, 222, 128, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #6ee7a0, #4ade80)',
                                boxShadow: '0 0 50px rgba(74, 222, 128, 0.7)',
                            },
                        }}
                    >
                        START GAME
                    </Button>
                </motion.div>

                {/* Info */}
                <motion.p
                    className="text-white/30 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    Click or press SPACE to stack blocks
                </motion.p>
            </motion.div>

            {/* Ground line */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)' }} />
        </div>
    );
}
