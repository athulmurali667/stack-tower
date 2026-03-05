import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import Block from './Block';
import MovingBlock from './MovingBlock';

const BLOCK_HEIGHT = 22; // block height + gap

export default function TowerCanvas() {
    const { blocks, currentFloor, floatingMoney, shaking } = useGameStore();
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => {
            setContainerWidth(entries[0].contentRect.width);
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Camera: shift up as tower grows so top blocks stay visible
    const towerHeight = blocks.length * BLOCK_HEIGHT;
    const canvasHeight = containerRef.current?.clientHeight || 500;
    // Keep top block visible with some padding
    const cameraOffset = Math.max(0, towerHeight - canvasHeight + 120);

    // Scale for zoom-out effect
    const scale = Math.max(0.5, 1 - (currentFloor * 0.004));

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden select-none ${shaking ? 'shake' : ''}`}
            style={{ cursor: 'pointer' }}
        >
            {/* Click overlay */}
            <div className="absolute inset-0 z-20" style={{ pointerEvents: 'none' }} />

            {/* Moving block */}
            {containerWidth > 0 && (
                <MovingBlock containerWidth={containerWidth} />
            )}

            {/* Tower container with camera pan */}
            <motion.div
                className="absolute bottom-0 left-0 right-0"
                style={{ height: towerHeight + 120 }}
                animate={{ y: cameraOffset }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
                {/* Scale wrapper for gradual zoom-out */}
                <motion.div
                    style={{ transformOrigin: 'bottom center' }}
                    animate={{ scale }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    className="absolute bottom-0 left-0 right-0"
                >
                    {/* Stacked blocks */}
                    {blocks.map((block, i) => {
                        const bottomOffset = i * BLOCK_HEIGHT;
                        return (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    bottom: bottomOffset,
                                    left: 0,
                                    right: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <Block
                                        width={block.width}
                                        left={block.left}
                                        color={block.color}
                                        index={i}
                                        totalBlocks={blocks.length}
                                        isNew={i === blocks.length - 1 && i > 0}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* Ground platform */}
                    <div className="tower-platform absolute bottom-[-16px] left-1/2"
                        style={{
                            transform: 'translateX(-50%)',
                            width: 380,
                            height: 16,
                            borderRadius: '4px',
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Floating money popups */}
            <AnimatePresence>
                {floatingMoney.map(fm => (
                    <motion.div
                        key={fm.id}
                        className="float-money absolute text-yellow-300 font-bold text-xl pointer-events-none z-50"
                        style={{ left: '50%', bottom: '40%', transform: 'translateX(-50%)' }}
                        initial={{ opacity: 1, y: 0, scale: 0.8 }}
                        animate={{ opacity: 0, y: -80, scale: 1.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                    >
                        +${fm.amount.toLocaleString()}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Click hint if first floor */}
            {blocks.length === 1 && (
                <motion.div
                    className="absolute bottom-32 left-1/2 text-center z-30 pointer-events-none"
                    style={{ transform: 'translateX(-50%)' }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <div className="text-white/60 text-sm">Click or press SPACE to drop block</div>
                    <div className="text-white/30 text-xs mt-1">↓</div>
                </motion.div>
            )}

            {/* Sky clouds decoration */}
            {[0, 1, 2].map(i => (
                <motion.div
                    key={i}
                    className="absolute rounded-full opacity-5 pointer-events-none"
                    style={{
                        width: 120 + i * 80,
                        height: 40,
                        background: 'white',
                        left: `${(i * 30 + 10)}%`,
                        top: `${15 + i * 20}%`,
                        filter: 'blur(12px)',
                    }}
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
                />
            ))}
        </div>
    );
}
