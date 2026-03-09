import { useRef, useState, useEffect, useCallback } from 'react';
import { calculateOverlap, nextCubeColor, resetColorCycle } from '../utils/alignmentLogic';

// ── Game constants ────────────────────────────────────────────────────────────
const BOOM_TIP_X_RATIO = 0.58;  // boom tip at 58% of container width
const CHAIN_LEN = 170;   // cable length in px
const BOOM_TIP_Y = 24;    // Y of boom tip from game-area top
const MAX_ANGLE = 0.62;  // max pendulum swing (radians, ~35°)
const BASE_FREQ = 0.42;  // oscillations/sec at score 0 (slow swing)
const FREQ_SCALE = 0.012; // extra freq per score point
const GRAVITY = 1600;  // px/sec² for falling cube
const CUBE_H = 58;    // cube height — more square
const INITIAL_CUBE_W = 120;   // starting cube width
const GRASS_H = 60;    // px
const LS_KEY = 'towerCraftHighScore';

function loadHighScore() {
    try { return parseInt(localStorage.getItem(LS_KEY) || '0', 10); } catch { return 0; }
}
function saveHighScore(s) {
    try { localStorage.setItem(LS_KEY, String(s)); } catch { /* ignore */ }
}

function boomTipX(cw) { return cw * BOOM_TIP_X_RATIO; }
function cubeCenter(cw, angle) {
    return boomTipX(cw) + Math.sin(angle) * CHAIN_LEN;
}
function cubeTopY(angle) {
    return BOOM_TIP_Y + Math.cos(angle) * CHAIN_LEN;
}

function makeInitialState(cw) {
    const btx = boomTipX(cw);
    const cubeW = INITIAL_CUBE_W;
    return {
        pendulumAngle: MAX_ANGLE,  // start at max swing
        pendulumTime: 0,
        fallingCube: null,
        attachedCube: { width: cubeW, color: nextCubeColor() },
        tower: [{
            x: btx - cubeW / 2,
            width: cubeW,
            y: 0,
            color: '#b45309',
        }],
        score: 0,
        gameStatus: 'playing',
        perfectFlash: false,
    };
}

// Exported constants so GamePage can render consistently
export { BOOM_TIP_Y, CHAIN_LEN, CUBE_H, MAX_ANGLE, BOOM_TIP_X_RATIO, GRASS_H };

export default function useGameEngine(containerWidth, containerHeight) {
    const [highScore, setHighScore] = useState(loadHighScore);
    const [state, setState] = useState(null);

    const stateRef = useRef(null);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);
    const cwRef = useRef(containerWidth);
    const chRef = useRef(containerHeight);

    useEffect(() => { cwRef.current = containerWidth; }, [containerWidth]);
    useEffect(() => { chRef.current = containerHeight; }, [containerHeight]);

    // ── Start / Restart ───────────────────────────────────────────────────────
    const startGame = useCallback(() => {
        resetColorCycle();
        const initial = makeInitialState(cwRef.current);
        stateRef.current = initial;
        setState(initial);
        lastTimeRef.current = null;
    }, []);

    // ── Drop cube ─────────────────────────────────────────────────────────────
    const dropCube = useCallback(() => {
        const s = stateRef.current;
        if (!s || s.gameStatus !== 'playing' || s.fallingCube) return;

        const cw = cwRef.current;
        const angle = s.pendulumAngle;
        const cubeW = s.attachedCube.width;
        const cx = cubeCenter(cw, angle) - cubeW / 2; // left edge
        const cy = cubeTopY(angle);

        const next = {
            ...s,
            fallingCube: { x: cx, y: cy, width: cubeW, color: s.attachedCube.color },
            attachedCube: null,
        };
        stateRef.current = next;
        setState(next);
    }, []);

    // ── Game loop ─────────────────────────────────────────────────────────────
    const tick = useCallback((timestamp) => {
        const s = stateRef.current;
        if (!s || s.gameStatus !== 'playing') return;

        const cw = cwRef.current;
        const ch = chRef.current;
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
        lastTimeRef.current = timestamp;

        let next = { ...s };

        // ── Pendulum swing ───────────────────────────────────────────────────
        const freq = BASE_FREQ + s.score * FREQ_SCALE;
        const newTime = s.pendulumTime + dt;
        const newAngle = MAX_ANGLE * Math.sin(newTime * freq * Math.PI * 2);
        next.pendulumTime = newTime;
        next.pendulumAngle = newAngle;

        // Update attached-cube derived position (just track angle, position derived in render)
        if (s.attachedCube) {
            next.attachedCube = { ...s.attachedCube };
        }

        // ── Falling cube gravity ─────────────────────────────────────────────
        if (s.fallingCube) {
            const fc = s.fallingCube;
            const newY = fc.y + GRAVITY * dt;

            const towerBlocks = s.tower;
            const towerHeightPx = towerBlocks.length * (CUBE_H + 2);
            const floorY = ch - GRASS_H - towerHeightPx;

            if (newY + CUBE_H >= floorY) {
                // ── Land: alignment check ────────────────────────────────────
                const topBlock = towerBlocks[towerBlocks.length - 1];
                const { newLeft, newWidth, isPerfect, missed } = calculateOverlap(
                    fc.x, fc.width, topBlock.x, topBlock.width
                );

                if (missed || newWidth < 10) {
                    const newHS = Math.max(s.score, loadHighScore());
                    saveHighScore(newHS);
                    setHighScore(newHS);
                    next = { ...next, fallingCube: null, gameStatus: 'gameover' };
                } else {
                    const landed = { x: newLeft, width: newWidth, y: towerBlocks.length, color: fc.color };
                    const newScore = s.score + 1 + (isPerfect ? 2 : 0);
                    const newCubeW = newWidth;
                    const newColor = nextCubeColor();
                    next = {
                        ...next,
                        fallingCube: null,
                        tower: [...towerBlocks, landed],
                        score: newScore,
                        perfectFlash: isPerfect,
                        attachedCube: { width: newCubeW, color: newColor },
                    };
                    if (isPerfect) {
                        setTimeout(() => {
                            stateRef.current = { ...stateRef.current, perfectFlash: false };
                            setState(prev => prev ? { ...prev, perfectFlash: false } : prev);
                        }, 600);
                    }
                }
            } else {
                next.fallingCube = { ...fc, y: newY };
            }
        }

        stateRef.current = next;
        setState(next);
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    // ── Mount ────────────────────────────────────────────────────────────────
    useEffect(() => {
        startGame();
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const restart = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        lastTimeRef.current = null;
        startGame();
        rafRef.current = requestAnimationFrame(tick);
    }, [startGame, tick]);

    return { state, highScore, dropCube, restart };
}
