import { memo } from 'react';
import { motion } from 'framer-motion';

const Block = memo(function Block({ width, left, color, index, isNew }) {
    // Derive lighter/darker shades from the base color for cartoon look
    return (
        <motion.div
            initial={isNew ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            style={{
                position: 'absolute',
                bottom: 0,
                left: `calc(50% + ${left}px)`,
                width: `${width}px`,
                height: '24px',
                transformOrigin: 'bottom',
                background: color,
                borderRadius: '6px',
                border: '2.5px solid rgba(0,0,0,0.18)',
                boxShadow: `0 4px 0 rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12)`,
                zIndex: index,
                overflow: 'hidden',
            }}
        >
            {/* Top shine */}
            <div style={{
                position: 'absolute',
                top: 3,
                left: 8,
                right: 8,
                height: 5,
                background: 'rgba(255,255,255,0.45)',
                borderRadius: 3,
            }} />
        </motion.div>
    );
});

export default Block;
