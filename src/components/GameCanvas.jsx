import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameEngine from '../hooks/useGameEngine';
import Crane from './Crane';
import Cube from './Cube';
import Tower from './Tower';

const GRASS_H = 60;
const CRANE_SCALE = 0.72;

// Animated cloud
function Cloud({ x, y, w = 100, delay = 0 }) {
    return (
        <motion.div
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 10 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay }}
            style={{ position: 'absolute', top: y, left: x, pointerEvents: 'none' }}
        >
            <svg width={w} height={w * 0.45} viewBox={`0 0 ${w} ${w * 0.45}`}>
                <ellipse cx={w * 0.5} cy={w * 0.28} rx={w * 0.42} ry={w * 0.22} fill="white" opacity="0.9" />
                <ellipse cx={w * 0.28} cy={w * 0.35} rx={w * 0.22} ry={w * 0.18} fill="white" opacity="0.9" />
                <ellipse cx={w * 0.72} cy={w * 0.35} rx={w * 0.25} ry={w * 0.16} fill="white" opacity="0.9" />
                <ellipse cx={w * 0.5} cy={w * 0.4} rx={w * 0.46} ry={w * 0.14} fill="white" opacity="0.9" />
            </svg>
        </motion.div>
    );
}

export default function GameCanvas({ onDrop, onRestart, gameOverVisible }) {
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            setDims({ w: width, h: height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const { state, highScore, dropCube, restart, CUBE_H, CRANE_Y, CABLE_VISUAL_H } = useGameEngine(dims.w, dims.h);

    // Bubble up drop/restart to GamePage if needed
    const handleDrop = useCallback(() => {
        dropCube();
    }, [dropCube]);

    const handleRestart = useCallback(() => {
        restart();
        if (onRestart) onRestart();
    }, [restart, onRestart]);

    // Keyboard
    useEffect(() => {
        const handler = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); handleDrop(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleDrop]);

    const s = state;

    // Boom tip X on screen = crane left edge + 18*scale, where crane left is computed in Crane.jsx
    // Here we just need it for cable rendering:
    const boomTipX = s ? s.craneX + 18 * CRANE_SCALE / 2 : 0;
    // Actually crane positions boom tip at x=craneX (we pass craneX as the boom-tip x to Crane)
    // Wait, in Crane.jsx we pass `x` and do craneLeft = x - 18*CRANE_SCALE
    // So boom tip screen X = x = craneX (centre of the hanging cube)
    // Let's keep boomTipX = craneX + cubeWidth/2 (center of cube = center of hook)
    const cubeWidth = s?.attachedCube?.width ?? s?.fallingCube?.width ?? 80;
    const hookX = s ? s.craneX + cubeWidth / 2 : 0;
    const cableTopY = CRANE_Y;          // where cable starts (bottom of boom arm visual)
    const cableBottom = cableTopY + CABLE_VISUAL_H;

    const perfectFlash = s?.perfectFlash;

    return (
        <div
            ref={containerRef}
            onClick={handleDrop}
            style={{
                position: 'relative',
                width: '100%',
                flex: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                userSelect: 'none',
                background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 45%, #bae6fd 78%, #e0f2fe 100%)',
            }}
        >
            {/* ── Clouds ── */}
            {dims.w > 0 && (
                <>
                    <Cloud x={dims.w * 0.05} y={20} w={100} delay={0} />
                    <Cloud x={dims.w * 0.55} y={12} w={120} delay={1.5} />
                    <Cloud x={dims.w * 0.28} y={55} w={80} delay={3} />
                    <Cloud x={dims.w * 0.70} y={50} w={95} delay={0.8} />
                </>
            )}

            {/* ── Perfect flash ── */}
            <AnimatePresence>
                {perfectFlash && (
                    <motion.div
                        key="perfect"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        style={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#fef08a',
                            fontWeight: 900,
                            fontSize: '2rem',
                            fontFamily: "'Fredoka One', cursive",
                            textShadow: '0 3px 0 #ca8a04, 0 0 20px rgba(254,240,138,0.8)',
                            zIndex: 100,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        ⭐ PERFECT!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Crane ── */}
            {s && dims.w > 0 && (
                <Crane x={hookX} scale={CRANE_SCALE} />
            )}

            {/* ── Attached cube (swinging from hook) ── */}
            {s?.attachedCube && dims.w > 0 && (
                <Cube
                    x={s.attachedCube.x}
                    y={cableBottom}
                    width={s.attachedCube.width}
                    height={CUBE_H}
                    color={s.attachedCube.color}
                    falling={false}
                    hookX={hookX}
                    hookY={cableTopY}
                    cableHeight={CABLE_VISUAL_H}
                />
            )}

            {/* ── Falling cube ── */}
            {s?.fallingCube && dims.w > 0 && (
                <Cube
                    x={s.fallingCube.x}
                    y={s.fallingCube.y}
                    width={s.fallingCube.width}
                    height={CUBE_H}
                    color={s.fallingCube.color}
                    falling={true}
                />
            )}

            {/* ── Tower ── */}
            {s && dims.h > 0 && (
                <Tower
                    blocks={s.tower}
                    containerHeight={dims.h}
                    grassHeight={GRASS_H}
                />
            )}

            {/* ── Grass ground ── */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: GRASS_H,
                background: 'linear-gradient(180deg, #86efac 0%, #22c55e 100%)',
                borderTop: '4px solid #15803d',
                zIndex: 4,
                pointerEvents: 'none',
            }}>
                {/* Bumpy grass humps */}
                {dims.w > 0 && Array.from({ length: Math.ceil(dims.w / 52) }, (_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        bottom: 50,
                        left: i * 52,
                        width: 46,
                        height: 14,
                        borderRadius: '50% 50% 0 0',
                        background: '#4ade80',
                    }} />
                ))}
            </div>

            {/* ── Tap/Click hint ── */}
            {s?.tower?.length === 1 && !s.fallingCube && (
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        bottom: 140,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.8)',
                        color: '#0c4a6e',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        padding: '7px 20px',
                        borderRadius: 999,
                        border: '2px solid white',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                        zIndex: 40,
                    }}
                >
                    👆 Tap or SPACE to drop!
                </motion.div>
            )}
        </div>
    );
}

// Also export the engine hook accessor so GamePage can get state
export { useGameEngine };
