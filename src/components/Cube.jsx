import { motion } from 'framer-motion';

/**
 * Cube component — renders either the attached (swinging) cube or the falling cube.
 *
 * Props:
 *   x, y        – top-left position in pixels (canvas-relative)
 *   width       – cube width in pixels
 *   height      – cube height in pixels
 *   color       – background color string
 *   falling     – if true, no swing animation
 *   hookX       – absolute X of the hook center (for cable rendering)
 *   hookY       – absolute Y above the cube top (for cable rendering)
 *   cableHeight – pixel length of the cable above the cube
 */
export default function Cube({ x, y, width, height, color, falling, hookX, hookY, cableHeight }) {
    const centerX = x + width / 2;

    return (
        <>
            {/* ── Cable ── */}
            {hookY !== undefined && (
                <div
                    style={{
                        position: 'absolute',
                        top: hookY,
                        left: hookX - 1.5,
                        width: 3,
                        height: cableHeight,
                        background: 'linear-gradient(180deg, #475569, #64748b)',
                        borderRadius: 2,
                        zIndex: 25,
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* ── Hook ── */}
            {!falling && hookY !== undefined && (
                <svg
                    style={{
                        position: 'absolute',
                        top: hookY + cableHeight - 2,
                        left: hookX - 10,
                        zIndex: 26,
                        pointerEvents: 'none',
                    }}
                    width="22" height="16" viewBox="0 0 22 16"
                >
                    <path d="M11 0 L11 7 Q11 15 17 15 Q23 15 23 9"
                        stroke="#374151" strokeWidth="3" fill="none"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}

            {/* ── Cube block ── */}
            <motion.div
                animate={!falling ? { rotate: [-3, 3, -3] } : { rotate: 0 }}
                transition={!falling ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}}
                style={{
                    position: 'absolute',
                    top: y,
                    left: x,
                    width,
                    height,
                    transformOrigin: `${centerX - x}px 0px`,
                    background: color,
                    borderRadius: 7,
                    border: '2.5px solid rgba(0,0,0,0.22)',
                    boxShadow: '0 5px 0 rgba(0,0,0,0.2), 0 2px 10px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    zIndex: 30,
                    pointerEvents: 'none',
                }}
            >
                {/* Shine */}
                <div style={{
                    position: 'absolute', top: 5, left: 10, right: 10, height: 5,
                    background: 'rgba(255,255,255,0.5)', borderRadius: 3,
                }} />
            </motion.div>
        </>
    );
}
