import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const confettiColors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];
const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[i % confettiColors.length],
    delay: Math.random() * 0.5,
}));

export default function WinDialog() {
    const { won, resetGame } = useGameStore();

    return (
        <Dialog
            open={won}
            onClose={resetGame}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                component: motion.div,
                initial: { scale: 0.5, opacity: 0, y: 50 },
                animate: { scale: 1, opacity: 1, y: 0 },
                transition: { type: 'spring', stiffness: 200, damping: 18 },
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pt: 4, fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)' }}>
                <div style={{ fontSize: '3rem', lineHeight: 1, marginBottom: '8px' }}>🎉</div>
                CONGRATULATIONS!
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
                <motion.div
                    className="game-title"
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #4ade80, #60a5fa, #f472b6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '12px',
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    100 FLOORS!
                </motion.div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.6 }}>
                    You built an incredible tower reaching 100 floors!<br />
                    The tower resets — can you do it again?
                </p>

                {/* Confetti dots */}
                <div style={{ position: 'relative', height: 60, overflow: 'hidden', marginTop: 16 }}>
                    {confetti.map(c => (
                        <motion.div
                            key={c.id}
                            style={{
                                position: 'absolute',
                                left: `${c.x}%`,
                                top: 0,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: c.color,
                            }}
                            animate={{ y: [0, 50], opacity: [1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: c.delay, ease: 'easeIn' }}
                        />
                    ))}
                </div>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 4, flexDirection: 'column', gap: 1 }}>
                <Button
                    id="win-play-again-btn"
                    variant="contained"
                    onClick={resetGame}
                    sx={{
                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                        color: '#000',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        px: 6,
                        py: 1.5,
                        '&:hover': { background: 'linear-gradient(135deg, #6ee7a0, #4ade80)' },
                    }}
                >
                    Play Again! 🏗️
                </Button>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: 0 }}>
                    Upgrades reset — start fresh!
                </p>
            </DialogActions>
        </Dialog>
    );
}
