import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useGameEngine, {
    BOOM_TIP_X_RATIO, BOOM_TIP_Y, CHAIN_LEN, CUBE_H, GRASS_H
} from '../hooks/useGameEngine';
import HeaderBar from '../components/HeaderBar';
import GameOverScreen from '../components/GameOverScreen';
import TowerCrane from '../components/TowerCrane';
import Tower from '../components/Tower';

// ── Outer page: measures container, gates render until dims are real ──────────
export default function GamePage() {
    const wrapperRef = useRef(null);
    const [dims, setDims] = useState(null);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) setDims({ w: width, h: height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div ref={wrapperRef}
            style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {dims && <GameInner canvasW={dims.w} canvasH={dims.h} />}
        </div>
    );
}

// ── Inner: game scene with live engine ───────────────────────────────────────
function GameInner({ canvasW, canvasH }) {
    const navigate = useNavigate();
    const { state, highScore, dropCube, restart } = useGameEngine(canvasW, canvasH);

    const isGameOver = state?.gameStatus === 'gameover';
    const score = state?.score ?? 0;
    const isNewRecord = isGameOver && score >= highScore && score > 0;

    const handleRestart = useCallback(() => restart(), [restart]);
    const handleMenu = useCallback(() => navigate('/'), [navigate]);

    // Keyboard
    useEffect(() => {
        const handler = (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !isGameOver) {
                e.preventDefault(); dropCube();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [dropCube, isGameOver]);

    if (!state) return null;

    const gameH = canvasH - 72;     // subtract header

    // Pendulum-derived cube position (only when attached)
    const angle = state.pendulumAngle ?? 0;
    const btx = canvasW * BOOM_TIP_X_RATIO;
    const cubeW = state.attachedCube?.width ?? state.fallingCube?.width ?? 120;
    const cubeColor = state.attachedCube?.color ?? state.fallingCube?.color ?? '#22c55e';

    return (
        <>
            <HeaderBar score={score} highScore={highScore} />

            <div
                onClick={() => !isGameOver && dropCube()}
                style={{
                    position: 'relative', flex: 1, width: '100%', overflow: 'hidden',
                    cursor: 'pointer', userSelect: 'none',
                    background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 42%, #bae6fd 75%, #e0f2fe 100%)',
                }}
            >
                {/* ── Clouds ── */}
                <Cloud x={canvasW * 0.30} y={18} w={110} delay={0} />
                <Cloud x={canvasW * 0.62} y={10} w={130} delay={1.5} />
                <Cloud x={canvasW * 0.44} y={55} w={80} delay={3} />
                <Cloud x={canvasW * 0.78} y={46} w={100} delay={0.8} />

                {/* ── Perfect flash ── */}
                <AnimatePresence>
                    {state.perfectFlash && (
                        <motion.div key="pf"
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            style={{
                                position: 'absolute', top: '30%', left: '50%',
                                transform: 'translateX(-50%)',
                                color: '#fef08a', fontWeight: 900, fontSize: '2rem',
                                fontFamily: "'Fredoka One', cursive",
                                textShadow: '0 3px 0 #ca8a04, 0 0 20px rgba(254,240,138,0.8)',
                                zIndex: 100, pointerEvents: 'none', whiteSpace: 'nowrap',
                            }}
                        >⭐ PERFECT!</motion.div>
                    )}
                </AnimatePresence>

                {/* ── Fixed Tower Crane (draws chain + attached cube inside SVG) ── */}
                <TowerCrane
                    canvasWidth={canvasW}
                    canvasHeight={gameH}
                    pendulumAngle={angle}
                    cubeColor={cubeColor}
                    cubeWidth={cubeW}
                    cubeHeight={CUBE_H}
                    isAttached={!!state.attachedCube}
                />

                {/* ── Falling cube (plain div, physics-driven) ── */}
                {state.fallingCube && (
                    <div style={{
                        position: 'absolute',
                        top: state.fallingCube.y,
                        left: state.fallingCube.x,
                        width: state.fallingCube.width,
                        height: CUBE_H,
                        background: state.fallingCube.color,
                        borderRadius: 8,
                        border: '3px solid rgba(0,0,0,0.22)',
                        boxShadow: '4px 6px 0 rgba(0,0,0,0.18), 0 2px 10px rgba(0,0,0,0.15)',
                        overflow: 'hidden', zIndex: 30, pointerEvents: 'none',
                    }}>
                        <div style={{
                            position: 'absolute', top: 8, left: 12, right: 12, height: 7,
                            background: 'rgba(255,255,255,0.45)', borderRadius: 4
                        }} />
                    </div>
                )}

                {/* ── Tower blocks ── */}
                <Tower blocks={state.tower} containerHeight={gameH} grassHeight={GRASS_H} />

                {/* ── Grass ── */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: GRASS_H,
                    background: 'linear-gradient(180deg, #86efac 0%, #22c55e 100%)',
                    borderTop: '4px solid #15803d', zIndex: 4, pointerEvents: 'none',
                }}>
                    {Array.from({ length: Math.ceil(canvasW / 52) }, (_, i) => (
                        <div key={i} style={{
                            position: 'absolute', bottom: 50, left: i * 52,
                            width: 46, height: 14, borderRadius: '50% 50% 0 0', background: '#4ade80'
                        }} />
                    ))}
                </div>

                {/* ── Tap hint ── */}
                {state.tower?.length === 1 && !state.fallingCube && (
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        style={{
                            position: 'absolute', bottom: 140, left: '58%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(255,255,255,0.85)', color: '#0c4a6e',
                            fontWeight: 700, fontSize: '0.9rem',
                            padding: '7px 20px', borderRadius: 999, border: '2px solid white',
                            whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 40,
                        }}
                    >
                        👆 Tap or SPACE to drop!
                    </motion.div>
                )}

                {/* ── Game Over ── */}
                <GameOverScreen
                    open={isGameOver} score={score} highScore={highScore}
                    isNewRecord={isNewRecord} onRestart={handleRestart} onMenu={handleMenu}
                />
            </div>
        </>
    );
}

function Cloud({ x, y, w = 100, delay = 0 }) {
    return (
        <motion.div
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 10 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{ position: 'absolute', top: y, left: x, pointerEvents: 'none', zIndex: 1 }}
        >
            <svg width={w} height={Math.round(w * 0.45)} viewBox={`0 0 ${w} ${Math.round(w * 0.45)}`}>
                <ellipse cx={w * 0.5} cy={w * 0.28} rx={w * 0.42} ry={w * 0.22} fill="white" opacity="0.9" />
                <ellipse cx={w * 0.28} cy={w * 0.35} rx={w * 0.22} ry={w * 0.18} fill="white" opacity="0.9" />
                <ellipse cx={w * 0.72} cy={w * 0.35} rx={w * 0.25} ry={w * 0.16} fill="white" opacity="0.9" />
                <ellipse cx={w * 0.5} cy={w * 0.4} rx={w * 0.46} ry={w * 0.14} fill="white" opacity="0.9" />
            </svg>
        </motion.div>
    );
}
