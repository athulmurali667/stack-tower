import { motion } from 'framer-motion';

const CUBE_H = 58;      // must match useGameEngine CUBE_H
const GAP = 2;       // gap between blocks
const BLOCK_H = CUBE_H + GAP;

/**
 * Tower component — renders all stacked tower blocks from the bottom up.
 *
 * Props:
 *   blocks        – array of { x, width, y (index from bottom), color }
 *   containerHeight – canvas height in pixels
 *   grassHeight   – height of the grass strip at the bottom (px)
 */
export default function Tower({ blocks, containerHeight, grassHeight = 60 }) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <>
            {blocks.map((block, i) => {
                // y=0 is the base slab at the bottom; higher index = higher up
                const topPx = containerHeight - grassHeight - (i + 1) * BLOCK_H;

                return (
                    <motion.div
                        key={i}
                        initial={i > 0 ? { scaleY: 0, opacity: 0.7 } : false}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 0.12, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            top: topPx,
                            left: block.x,
                            width: block.width,
                            height: CUBE_H,
                            transformOrigin: 'bottom center',
                            background: block.color,
                            borderRadius: i === 0 ? '6px 6px 0 0' : 6,
                            border: '2.5px solid rgba(0,0,0,0.18)',
                            boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            zIndex: 10 + i,
                        }}
                    >
                        {/* Shine */}
                        <div style={{
                            position: 'absolute', top: 4, left: 8, right: 8, height: 5,
                            background: 'rgba(255,255,255,0.4)', borderRadius: 3,
                        }} />
                    </motion.div>
                );
            })}

            {/* Tower base platform */}
            <div style={{
                position: 'absolute',
                bottom: grassHeight - 4,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 260,
                height: 14,
                background: 'linear-gradient(180deg, #d97706 0%, #b45309 100%)',
                borderRadius: '10px 10px 0 0',
                border: '2px solid #92400e',
                boxShadow: '0 3px 0 #92400e',
                zIndex: 5,
            }} />
        </>
    );
}
