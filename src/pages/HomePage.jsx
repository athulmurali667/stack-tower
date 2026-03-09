import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Cartoon cloud shape ── */
function Cloud({ x, y, scale = 1, delay = 0 }) {
    return (
        <motion.g
            transform={`translate(${x}, ${y}) scale(${scale})`}
            animate={{ x: [0, 18, 0] }}
            transition={{ duration: 9 + delay * 3, repeat: Infinity, ease: 'easeInOut', delay }}
        >
            <ellipse cx="60" cy="30" rx="50" ry="28" fill="white" opacity="0.92" />
            <ellipse cx="30" cy="38" rx="32" ry="22" fill="white" opacity="0.92" />
            <ellipse cx="90" cy="38" rx="36" ry="20" fill="white" opacity="0.92" />
            <ellipse cx="60" cy="40" rx="58" ry="18" fill="white" opacity="0.92" />
        </motion.g>
    );
}

/* ── Tower base drawn in SVG ── */
function TowerBase() {
    const blocks = [
        { x: 60, w: 220, color: '#f97316', shadow: '#c2410c' },
        { x: 80, w: 180, color: '#fb923c', shadow: '#ea580c' },
        { x: 100, w: 140, color: '#fdba74', shadow: '#f97316' },
    ];
    return (
        <svg width="340" height="90" viewBox="0 0 340 90" style={{ display: 'block', margin: '0 auto' }}>
            {blocks.map((b, i) => (
                <g key={i}>
                    <rect x={b.x} y={10 + i * 26} width={b.w} height={22} rx="5"
                        fill={b.shadow} />
                    <rect x={b.x} y={7 + i * 26} width={b.w} height={22} rx="5"
                        fill={b.color} />
                    {/* shine */}
                    <rect x={b.x + 10} y={9 + i * 26} width={b.w - 20} height={5} rx="3"
                        fill="rgba(255,255,255,0.35)" />
                </g>
            ))}
            {/* ground slab */}
            <rect x="20" y="83" width="300" height="7" rx="4" fill="#92400e" />
            <rect x="20" y="80" width="300" height="7" rx="4" fill="#b45309" />
        </svg>
    );
}

/* ── Cartoon crane (SVG) ── */
function CartoonCrane() {
    return (
        <motion.div
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'bottom center', display: 'inline-block' }}
        >
            <svg width="180" height="200" viewBox="0 0 180 200">
                {/* Vertical mast */}
                <rect x="78" y="60" width="18" height="130" rx="5" fill="#eab308" />
                <rect x="82" y="60" width="6" height="130" rx="3" fill="#facc15" />
                {/* Horizontal boom */}
                <rect x="10" y="54" width="160" height="16" rx="6" fill="#eab308" />
                <rect x="10" y="54" width="160" height="7" rx="6" fill="#facc15" />
                {/* Boom tip cap */}
                <circle cx="18" cy="62" r="8" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
                {/* Counterweight */}
                <rect x="10" y="68" width="30" height="22" rx="5" fill="#ca8a04" />
                <rect x="10" y="68" width="30" height="10" rx="5" fill="#d97706" />
                {/* Cable from boom tip */}
                <line x1="18" y1="70" x2="18" y2="140" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                {/* Hook */}
                <path d="M14 140 Q10 152 18 156 Q26 160 26 152" stroke="#475569" strokeWidth="3"
                    fill="none" strokeLinecap="round" />
                {/* Block on hook */}
                <motion.g
                    animate={{ y: [-4, 4, -4], rotate: [-3, 3, -3] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <rect x="0" y="158" width="36" height="30" rx="5" fill="#3b82f6" />
                    <rect x="0" y="158" width="36" height="14" rx="5" fill="#60a5fa" />
                    <rect x="5" y="161" width="26" height="5" rx="3" fill="rgba(255,255,255,0.4)" />
                </motion.g>
                {/* Cabin on mast */}
                <rect x="68" y="100" width="38" height="30" rx="6" fill="#fbbf24" />
                <rect x="70" y="102" width="34" height="14" rx="4" fill="#fde68a" />
                {/* Cabin window */}
                <rect x="74" y="104" width="12" height="10" rx="3" fill="#bae6fd" />
                <rect x="92" y="104" width="8" height="10" rx="3" fill="#bae6fd" />
                {/* Wheels */}
                <circle cx="82" cy="195" r="10" fill="#374151" />
                <circle cx="82" cy="195" r="5" fill="#6b7280" />
                <circle cx="110" cy="195" r="10" fill="#374151" />
                <circle cx="110" cy="195" r="5" fill="#6b7280" />
            </svg>
        </motion.div>
    );
}

export default function HomePage() {
    const navigate = useNavigate();
    const handleStart = () => navigate('/game');

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 45%, #bae6fd 75%, #e0f2fe 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>

            {/* ── Sky clouds (SVG layer) ── */}
            <svg
                viewBox="0 0 900 300"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '38%', pointerEvents: 'none' }}
                preserveAspectRatio="xMidYMax meet"
            >
                <Cloud x={20} y={20} scale={1.1} delay={0} />
                <Cloud x={250} y={0} scale={0.75} delay={1.2} />
                <Cloud x={500} y={30} scale={1.3} delay={0.5} />
                <Cloud x={730} y={10} scale={0.9} delay={2} />
                <Cloud x={100} y={90} scale={0.6} delay={1.8} />
                <Cloud x={620} y={85} scale={0.7} delay={0.9} />
            </svg>

            {/* ── Sun ── */}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    top: 24,
                    right: 40,
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #fde68a 40%, #fbbf24 100%)',
                    boxShadow: '0 0 35px 18px rgba(251,191,36,0.35)',
                }}
            />

            {/* ── Main content column ── */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0,
                width: '100%',
                maxWidth: 420,
                paddingTop: 28,
            }}>

                {/* Title badge */}
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: 'spring', stiffness: 200 }}
                    style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
                        borderRadius: 24,
                        padding: '10px 36px 8px',
                        boxShadow: '0 6px 0 #b91c1c, 0 12px 30px rgba(239,68,68,0.35)',
                        border: '3px solid #fff',
                        marginBottom: 2,
                    }}
                >
                    <div style={{
                        fontFamily: "'Fredoka One', 'Nunito', 'Inter', sans-serif",
                        fontSize: '3.2rem',
                        fontWeight: 900,
                        color: '#fff',
                        letterSpacing: '0.04em',
                        textShadow: '0 3px 0 rgba(0,0,0,0.22)',
                        lineHeight: 1.05,
                        textAlign: 'center',
                    }}>
                        TOWER<br />CRAFT
                    </div>
                </motion.div>

                {/* Stars decoration */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ display: 'flex', gap: 6, marginBottom: 4 }}
                >
                    {['⭐', '⭐', '⭐'].map((s, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            style={{ fontSize: '1.4rem' }}
                        >{s}</motion.span>
                    ))}
                </motion.div>

                {/* Crane illustration */}
                <motion.div
                    initial={{ x: -60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.25, type: 'spring', stiffness: 120 }}
                    style={{ alignSelf: 'flex-start', marginLeft: 20, marginBottom: -12 }}
                >
                    <CartoonCrane />
                </motion.div>

                {/* Tower base */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    style={{ width: '100%' }}
                >
                    <TowerBase />
                </motion.div>

                {/* Play button */}
                <motion.button
                    id="start-game-btn"
                    onClick={handleStart}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.65, type: 'spring', stiffness: 260, damping: 18 }}
                    whileHover={{ scale: 1.07, y: -2 }}
                    whileTap={{ scale: 0.93, y: 2 }}
                    style={{
                        marginTop: 20,
                        padding: '18px 72px',
                        fontSize: '1.6rem',
                        fontWeight: 900,
                        fontFamily: "'Fredoka One', 'Nunito', 'Inter', sans-serif",
                        letterSpacing: '0.06em',
                        color: '#fff',
                        background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
                        border: 'none',
                        borderRadius: 999,
                        boxShadow: '0 7px 0 #15803d, 0 14px 28px rgba(22,163,74,0.45)',
                        cursor: 'pointer',
                        textShadow: '0 2px 0 rgba(0,0,0,0.2)',
                        outline: 'none',
                        position: 'relative',
                    }}
                >
                    ▶ PLAY
                </motion.button>

                {/* Hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    style={{
                        marginTop: 14,
                        color: '#075985',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        opacity: 0.7,
                    }}
                >
                    TAP or press SPACE to stack blocks!
                </motion.p>
            </div>

            {/* ── Ground strip ── */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 48,
                background: 'linear-gradient(180deg, #86efac 0%, #22c55e 100%)',
                borderTop: '4px solid #15803d',
            }}>
                {/* little grass bumps */}
                {[0, 80, 170, 260, 360, 450, 550, 650, 740, 840].map((x, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        bottom: 42,
                        left: x,
                        width: 52,
                        height: 18,
                        borderRadius: '50% 50% 0 0',
                        background: '#4ade80',
                    }} />
                ))}
            </div>

            {/* ── Birds ── */}
            {[
                { x: '15%', y: '18%', delay: 0 },
                { x: '72%', y: '12%', delay: 1.5 },
                { x: '58%', y: '25%', delay: 0.8 },
            ].map((b, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: b.x,
                        top: b.y,
                        fontSize: '1.1rem',
                        pointerEvents: 'none',
                    }}
                    animate={{ x: [0, 30, 0], y: [0, -8, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
                >
                    🐦
                </motion.div>
            ))}
        </div>
    );
}
