import { useRef, useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/soundManager';

const BLOCK_HEIGHT = 20;
const BASE_SPEED = 3; // pixels per frame at speedMultiplier=1

export default function MovingBlock({ containerWidth }) {
    const { blocks, speedMultiplier, won, stackBlock, missBlock, BASE_WIDTH } = useGameStore();
    const rafRef = useRef(null);
    const posRef = useRef(0);
    const dirRef = useRef(1);
    const [visualPos, setVisualPos] = useState(0);
    const [dropping, setDropping] = useState(false);

    const topBlock = blocks[blocks.length - 1];
    const movingWidth = topBlock ? topBlock.width : BASE_WIDTH;
    const travelRange = containerWidth - movingWidth;

    const speed = BASE_SPEED / speedMultiplier;

    const animate = useCallback(() => {
        posRef.current += speed * dirRef.current;
        if (posRef.current >= travelRange || posRef.current <= 0) {
            dirRef.current *= -1;
            posRef.current = Math.max(0, Math.min(travelRange, posRef.current));
        }
        setVisualPos(posRef.current);
        rafRef.current = requestAnimationFrame(animate);
    }, [speed, travelRange]);

    useEffect(() => {
        if (won) return;
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [animate, won]);

    const handleDrop = useCallback(() => {
        if (dropping || won) return;
        cancelAnimationFrame(rafRef.current);
        setDropping(true);

        const topBlock = blocks[blocks.length - 1];
        if (!topBlock) return;

        // Moving block position in "centered" coordinate space
        // container center is at containerWidth/2
        // blocks are rendered with left: `calc(50% + ${block.left}px)`
        // so topBlock occupies from (center + topBlock.left) to (center + topBlock.left + topBlock.width)
        // moving block occupies from (visualPos) to (visualPos + movingWidth)

        const center = containerWidth / 2;
        const stackLeft = center + topBlock.left;
        const stackRight = stackLeft + topBlock.width;
        const moveLeft = visualPos;
        const moveRight = visualPos + movingWidth;

        const overlapLeft = Math.max(stackLeft, moveLeft);
        const overlapRight = Math.min(stackRight, moveRight);
        const overlap = overlapRight - overlapLeft;

        if (overlap <= 0) {
            // complete miss
            soundManager.playFail();
            missBlock();
            setDropping(false);
            posRef.current = 0;
            dirRef.current = 1;
            return;
        }

        // Trimmed block
        const newWidth = Math.round(overlap);
        // new left is relative to center
        const newLeft = overlapLeft - center;

        soundManager.playStack();
        stackBlock(newWidth, newLeft, overlap / movingWidth);

        // Reset for next block
        setTimeout(() => {
            posRef.current = 0;
            dirRef.current = 1;
            setDropping(false);
        }, 150);
    }, [dropping, won, blocks, containerWidth, movingWidth, visualPos, stackBlock, missBlock]);

    // Keyboard support
    useEffect(() => {
        const onKey = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleDrop();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handleDrop]);

    if (won) return null;

    const [colorLight, colorDark] = topBlock?.color || ['#4ade80', '#22c55e'];

    // Y position: sits above the top of the stacked blocks
    // The tower renders from bottom, each block is 20px + 2px gap
    // The moving block is always floating at a fixed visual top position

    return (
        <div
            id="moving-block"
            onClick={handleDrop}
            style={{
                position: 'absolute',
                top: '32px',
                left: visualPos,
                width: movingWidth,
                height: BLOCK_HEIGHT,
                cursor: 'pointer',
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${colorDark}, ${colorLight}, ${colorDark})`,
                boxShadow: `0 0 20px ${colorLight}88, 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)`,
                transition: dropping ? 'none' : undefined,
                zIndex: 100,
            }}
        >
            {/* Shine */}
            <div style={{
                position: 'absolute', top: 3, left: 8, right: 8, height: 3,
                background: 'rgba(255,255,255,0.5)', borderRadius: 2,
            }} />
            {/* Glow pulse */}
            <div style={{
                position: 'absolute', inset: -4, borderRadius: 8,
                background: `radial-gradient(ellipse, ${colorLight}22, transparent)`,
                animation: 'blockGlow 1.5s ease-in-out infinite',
            }} />
        </div>
    );
}
