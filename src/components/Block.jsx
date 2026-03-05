import { memo } from 'react';
import { motion } from 'framer-motion';

const Block = memo(function Block({ width, left, color, index, totalBlocks, isNew }) {
    const [colorLight, colorDark] = color;
    const relativeIndex = totalBlocks - 1 - index;

    return (
        <motion.div
            initial={isNew ? { scaleY: 0, opacity: 0.5 } : false}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
                position: 'absolute',
                bottom: 0,
                left: `calc(50% + ${left}px)`,
                width: `${width}px`,
                height: '20px',
                transformOrigin: 'bottom',
                background: `linear-gradient(90deg, ${colorDark}, ${colorLight}, ${colorDark})`,
                borderRadius: '4px',
                boxShadow: `0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)`,
                zIndex: index,
            }}
        >
            {/* Shine streak */}
            <div style={{
                position: 'absolute',
                top: '3px',
                left: '8px',
                right: '8px',
                height: '3px',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '2px',
            }} />
        </motion.div>
    );
});

export default Block;
