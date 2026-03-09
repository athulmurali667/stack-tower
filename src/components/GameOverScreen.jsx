import { Dialog, DialogContent, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function GameOverScreen({ open, score, highScore, isNewRecord, onRestart, onMenu }) {
    return (
        <Dialog
            open={open}
            PaperProps={{
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    overflow: 'visible',
                },
            }}
            BackdropProps={{
                style: { background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' },
            }}
        >
            <DialogContent style={{ padding: 0, overflow: 'visible' }}>
                <motion.div
                    initial={{ scale: 0.7, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    style={{
                        background: 'linear-gradient(160deg, #1e3a5f 0%, #0f2744 100%)',
                        borderRadius: 24,
                        border: '3px solid rgba(125,211,252,0.35)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                        padding: '32px 40px',
                        textAlign: 'center',
                        minWidth: 280,
                    }}
                >
                    {/* Title */}
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#f43f5e', fontFamily: "'Fredoka One', cursive", lineHeight: 1, marginBottom: 4 }}>
                        GAME OVER
                    </div>
                    <div style={{ fontSize: '1.3rem', marginBottom: 24 }}>🏗️</div>

                    {/* New record badge */}
                    {isNewRecord && (
                        <motion.div
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            style={{
                                background: 'linear-gradient(90deg, #f59e0b, #eab308)',
                                borderRadius: 999,
                                padding: '4px 16px',
                                display: 'inline-block',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                color: '#000',
                                letterSpacing: '0.08em',
                                marginBottom: 16,
                            }}
                        >
                            🏆 NEW HIGH SCORE!
                        </motion.div>
                    )}

                    {/* Score */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</div>
                        <div style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 900, fontFamily: "'Fredoka One', cursive", lineHeight: 1 }}>
                            {score}
                        </div>
                    </div>

                    {/* High score */}
                    <div style={{
                        background: 'rgba(255,255,255,0.07)',
                        borderRadius: 12,
                        padding: '10px 20px',
                        marginBottom: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                    }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>🏆 Best</span>
                        <span style={{ color: '#fde047', fontSize: '1.4rem', fontWeight: 900 }}>{highScore}</span>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button
                            onClick={onRestart}
                            style={{
                                background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                                border: 'none',
                                borderBottom: '4px solid #15803d',
                                borderRadius: 14,
                                color: '#fff',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                fontFamily: "'Fredoka One', cursive",
                                padding: '12px 0',
                                cursor: 'pointer',
                                letterSpacing: '0.04em',
                                transition: 'transform 0.1s',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
                            onMouseUp={e => e.currentTarget.style.transform = ''}
                        >
                            ▶ PLAY AGAIN
                        </button>
                        <button
                            onClick={onMenu}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '2px solid rgba(255,255,255,0.15)',
                                borderRadius: 14,
                                color: '#94a3b8',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                padding: '10px 0',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            ← Main Menu
                        </button>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
