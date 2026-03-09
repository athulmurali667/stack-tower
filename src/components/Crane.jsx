import { motion } from 'framer-motion';

/**
 * Cartoon crane SVG — identical style to the main menu crane.
 * Props:
 *   x  – left pixel position of the boom-tip (the hook reference point)
 *   y  – top of the crane arm (canvas-relative)
 *   scale – optional scale factor (default 0.72)
 */
export default function Crane({ x, scale = 0.72 }) {
    const w = Math.round(180 * scale);
    const h = Math.round(200 * scale);

    // Boom tip in SVG coords = (18, 58) → at scale: (18*s, 58*s)
    // We want the boom tip to be at screen-x = x
    // So crane left = x - 18*scale
    const craneLeft = x - 18 * scale;

    return (
        <motion.div
            animate={{ rotate: [-0.8, 0.8, -0.8] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                position: 'absolute',
                top: -30,               // push crane up; boom arm peeks in from top
                left: craneLeft,
                width: w,
                height: h,
                transformOrigin: 'bottom center',
                pointerEvents: 'none',
                zIndex: 20,
            }}
        >
            <svg width={w} height={h} viewBox="0 0 180 200">
                {/* Vertical mast */}
                <rect x="78" y="60" width="18" height="130" rx="5" fill="#eab308" />
                <rect x="82" y="60" width="6" height="130" rx="3" fill="#facc15" />
                <rect x="78" y="60" width="18" height="130" rx="5" fill="none" stroke="#92400e" strokeWidth="1.5" />

                {/* Horizontal boom */}
                <rect x="10" y="50" width="160" height="16" rx="6" fill="#eab308" />
                <rect x="10" y="50" width="160" height="8" rx="6" fill="#facc15" />
                <rect x="10" y="50" width="160" height="16" rx="6" fill="none" stroke="#92400e" strokeWidth="1.5" />

                {/* Support wires */}
                <line x1="87" y1="60" x2="160" y2="54" stroke="#92400e" strokeWidth="1.5" />
                <line x1="87" y1="60" x2="30" y2="54" stroke="#92400e" strokeWidth="1.5" />

                {/* Boom tip pulley */}
                <circle cx="18" cy="58" r="7" fill="#fde047" stroke="#92400e" strokeWidth="2" />
                <circle cx="18" cy="58" r="3" fill="#92400e" />

                {/* Counterweight */}
                <rect x="148" y="66" width="24" height="20" rx="4" fill="#ca8a04" />
                <rect x="148" y="66" width="24" height="10" rx="4" fill="#d97706" />
                <rect x="148" y="66" width="24" height="20" rx="4" fill="none" stroke="#92400e" strokeWidth="1.2" />

                {/* Cabin */}
                <rect x="68" y="96" width="42" height="32" rx="7" fill="#fbbf24" />
                <rect x="70" y="98" width="38" height="15" rx="5" fill="#fde68a" />
                <rect x="68" y="96" width="42" height="32" rx="7" fill="none" stroke="#92400e" strokeWidth="1.5" />
                {/* Windows */}
                <rect x="73" y="100" width="13" height="11" rx="3" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1" />
                <rect x="91" y="100" width="10" height="11" rx="3" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1" />
                {/* Door */}
                <rect x="78" y="115" width="10" height="13" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="1" />

                {/* Ladder */}
                <line x1="110" y1="100" x2="110" y2="130" stroke="#92400e" strokeWidth="2" />
                <line x1="116" y1="100" x2="116" y2="130" stroke="#92400e" strokeWidth="2" />
                {[104, 110, 116, 122, 128].map(y => (
                    <line key={y} x1="110" y1={y} x2="116" y2={y} stroke="#92400e" strokeWidth="1.5" />
                ))}

                {/* Wheels / axle */}
                <rect x="66" y="185" width="48" height="8" rx="4" fill="#4b5563" />
                <circle cx="76" cy="192" r="10" fill="#374151" stroke="#1e293b" strokeWidth="2" />
                <circle cx="76" cy="192" r="4" fill="#6b7280" />
                <circle cx="104" cy="192" r="10" fill="#374151" stroke="#1e293b" strokeWidth="2" />
                <circle cx="104" cy="192" r="4" fill="#6b7280" />
            </svg>
        </motion.div>
    );
}
