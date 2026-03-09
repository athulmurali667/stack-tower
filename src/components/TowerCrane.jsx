import { motion } from 'framer-motion';
import { BOOM_TIP_X_RATIO, BOOM_TIP_Y, CHAIN_LEN } from '../hooks/useGameEngine';

/**
 * TowerCrane — tall lattice tower crane fixed on the LEFT with boom extending to CENTER.
 *
 * Props:
 *   canvasWidth, canvasHeight  – game area dimensions
 *   pendulumAngle              – current swing angle in radians (from engine state)
 *   cubeColor                  – attached cube's color
 *   cubeWidth, cubeHeight      – cube dimensions
 *   isAttached                 – cube is on hook (vs falling free)
 */
export default function TowerCrane({
    canvasWidth, canvasHeight,
    pendulumAngle,
    cubeColor, cubeWidth, cubeHeight,
    isAttached,
}) {
    // ── Geometry ──────────────────────────────────────────────────────────────
    const btx = canvasWidth * BOOM_TIP_X_RATIO;  // boom tip X
    const bty = BOOM_TIP_Y;                       // boom tip Y

    // Pendulum-driven chain endpoint
    const chainEndX = btx + Math.sin(pendulumAngle) * CHAIN_LEN;
    const chainEndY = bty + Math.cos(pendulumAngle) * CHAIN_LEN;

    // Cube center
    const cubeLeft = chainEndX - cubeWidth / 2;
    const cubeTop = chainEndY;

    // Crane structural dims
    const mastL = 10;
    const mastR = 62;
    const mastCx = (mastL + mastR) / 2;    // 36
    const boomY = bty - 6;                // boom runs along the top
    const mastBot = Math.min(canvasHeight * 0.75, 460);

    // Counterweight on the far left of the boom
    const cwL = mastL - 42;
    const cwR = mastL;

    return (
        <svg
            width={canvasWidth}
            height={canvasHeight}
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 20, pointerEvents: 'none' }}
        >
            {/* ── Mast foundation ── */}
            <rect x={mastL - 14} y={mastBot + boomY + 2} width={mastR - mastL + 28} height={12} rx="5" fill="#b45309" />
            <rect x={mastL - 22} y={mastBot + boomY + 12} width={mastR - mastL + 44} height={10} rx="5" fill="#92400e" />

            {/* ── Mast lattice ── */}
            {/* Left and right rails */}
            <rect x={mastL} y={boomY} width={9} height={mastBot} rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            <rect x={mastR - 9} y={boomY} width={9} height={mastBot} rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
            {/* Left highlight streak */}
            <rect x={mastL + 1} y={boomY} width={3} height={mastBot} rx="2" fill="#fde047" />
            {/* X-lattice every 40px */}
            {Array.from({ length: Math.ceil(mastBot / 40) }, (_, i) => {
                const ty = boomY + i * 40;
                return (
                    <g key={i}>
                        <line x1={mastL + 9} y1={ty} x2={mastR - 9} y2={ty + 40} stroke="#ca8a04" strokeWidth="2.5" />
                        <line x1={mastR - 9} y1={ty} x2={mastL + 9} y2={ty + 40} stroke="#ca8a04" strokeWidth="2.5" />
                        <rect x={mastL} y={ty} width={mastR - mastL} height={2} rx="1" fill="#ca8a04" />
                    </g>
                );
            })}

            {/* ── Boom (horizontal arm, left counterweight to boom tip) ── */}
            {/* Boom main beam bottom rail */}
            <rect x={cwL - 4} y={boomY + 2} width={btx - cwL + 14} height={16} rx="5" fill="#eab308" />
            <rect x={cwL - 4} y={boomY + 2} width={btx - cwL + 14} height={7} rx="5" fill="#fde047" />
            {/* Boom lattice struts */}
            {Array.from({ length: Math.floor((btx - mastL) / 48) }, (_, i) => {
                const sx = mastL + i * 48;
                return (
                    <g key={i}>
                        <line x1={sx} y1={boomY + 18} x2={sx + 24} y2={boomY + 1} stroke="#ca8a04" strokeWidth="2" />
                        <line x1={sx + 24} y1={boomY + 18} x2={sx + 48} y2={boomY + 1} stroke="#ca8a04" strokeWidth="2" />
                    </g>
                );
            })}
            {/* Boom top rail */}
            <rect x={cwL - 4} y={boomY} width={btx - cwL + 14} height={4} rx="2" fill="#ca8a04" />

            {/* ── Counterweight block (left of mast) ── */}
            <rect x={cwL - 4} y={boomY + 2} width={cwR - cwL + 4} height={28} rx="5" fill="#92400e" />
            <rect x={cwL - 4} y={boomY + 2} width={cwR - cwL + 4} height={14} rx="5" fill="#b45309" />
            <rect x={cwL} y={boomY + 5} width={cwR - cwL - 3} height={5} rx="3" fill="rgba(255,255,255,0.2)" />

            {/* ── Support wires from mast apex ── */}
            <line x1={mastCx} y1={boomY} x2={cwL} y2={boomY + 18} stroke="#374151" strokeWidth="2.5" opacity="0.75" />
            <line x1={mastCx} y1={boomY} x2={btx + 4} y2={boomY + 18} stroke="#374151" strokeWidth="2.5" opacity="0.75" />
            {/* Mid support wire */}
            <line x1={mastCx} y1={boomY} x2={(mastCx + btx) / 2} y2={boomY + 18} stroke="#374151" strokeWidth="1.5" opacity="0.5" />

            {/* ── Control cabin ── */}
            <rect x={mastL - 2} y={boomY + 18} width={mastR - mastL + 4} height={36} rx="6" fill="#fbbf24" />
            <rect x={mastL + 1} y={boomY + 20} width={mastR - mastL - 2} height={17} rx="4" fill="#fde68a" />
            {/* Windows */}
            <rect x={mastL + 4} y={boomY + 22} width={16} height={12} rx="3" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1.2" />
            <rect x={mastL + 26} y={boomY + 22} width={12} height={12} rx="3" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="1.2" />
            {/* Cabin outline */}
            <rect x={mastL - 2} y={boomY + 18} width={mastR - mastL + 4} height={36} rx="6" fill="none" stroke="#92400e" strokeWidth="1.5" />

            {/* ── Mast apex cap ── */}
            <polygon
                points={`${mastCx - 18},${boomY} ${mastCx + 18},${boomY} ${mastCx},${boomY - 14}`}
                fill="#d97706" stroke="#92400e" strokeWidth="1.5"
            />
            <circle cx={mastCx} cy={boomY - 16} r={5} fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />

            {/* ── Boom-tip pulley ── */}
            <circle cx={btx} cy={bty + 4} r={10} fill="#fde047" stroke="#92400e" strokeWidth="2" />
            <circle cx={btx} cy={bty + 4} r={4} fill="#92400e" />
            {/* Pulley grooves */}
            <circle cx={btx} cy={bty + 4} r={7} fill="none" stroke="#ca8a04" strokeWidth="1.5" />

            {/* ── Swinging chain from boom-tip pulley to hook ── */}
            {/* Main cable */}
            <line
                x1={btx} y1={bty + 14}
                x2={chainEndX} y2={chainEndY - 10}
                stroke="#374151" strokeWidth="3" strokeLinecap="round"
            />
            {/* Chain link pattern overlay */}
            {(() => {
                const dx = chainEndX - btx;
                const dy = chainEndY - 10 - (bty + 14);
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len, uy = dy / len;
                const links = Math.floor(len / 14);
                return Array.from({ length: links }, (_, i) => {
                    const t = (i + 0.5) * 14;
                    const lx = btx + ux * t;
                    const ly = bty + 14 + uy * t;
                    return (
                        <ellipse
                            key={i}
                            cx={lx} cy={ly}
                            rx={4} ry={2.5}
                            transform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI}, ${lx}, ${ly})`}
                            fill="none" stroke="#6b7280" strokeWidth="1.5"
                        />
                    );
                });
            })()}

            {/* ── Hook assembly ── */}
            <circle cx={chainEndX} cy={chainEndY - 9} r={7} fill="#6b7280" stroke="#374151" strokeWidth="2" />
            <circle cx={chainEndX} cy={chainEndY - 9} r={3} fill="#9ca3af" />
            {/* Hook curve */}
            <path
                d={`M${chainEndX} ${chainEndY - 2} Q${chainEndX - 11} ${chainEndY + 8} ${chainEndX} ${chainEndY + 10} Q${chainEndX + 11} ${chainEndY + 10} ${chainEndX + 10} ${chainEndY + 2}`}
                stroke="#374151" strokeWidth="3.5" fill="none" strokeLinecap="round"
            />
            {/* Hook pin */}
            <line x1={chainEndX - 8} y1={chainEndY + 2} x2={chainEndX + 9} y2={chainEndY + 2} stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />

            {/* ── Hanging cube (when attached) ── */}
            {isAttached && (
                <g>
                    {/* Drop shadow */}
                    <rect
                        x={cubeLeft + 4} y={cubeTop + 6}
                        width={cubeWidth} height={cubeHeight}
                        rx="8" fill="rgba(0,0,0,0.12)"
                    />
                    {/* Cube body */}
                    <rect
                        x={cubeLeft} y={cubeTop}
                        width={cubeWidth} height={cubeHeight}
                        rx="8"
                        fill={cubeColor}
                        stroke="rgba(0,0,0,0.22)"
                        strokeWidth="3"
                    />
                    {/* Top face shine */}
                    <rect
                        x={cubeLeft + 12} y={cubeTop + 8}
                        width={cubeWidth - 24} height={cubeHeight * 0.22}
                        rx="4" fill="rgba(255,255,255,0.45)"
                    />
                    {/* Side shadow */}
                    <rect
                        x={cubeLeft + cubeWidth - 18} y={cubeTop + 8}
                        width={14} height={cubeHeight - 14}
                        rx="4" fill="rgba(0,0,0,0.1)"
                    />
                    {/* Rivet dots */}
                    {[0.25, 0.75].map((fx, i) => (
                        <circle key={i} cx={cubeLeft + cubeWidth * fx} cy={cubeTop + cubeHeight * 0.78}
                            r={3.5} fill="rgba(0,0,0,0.18)" />
                    ))}
                </g>
            )}

            {/* ── Decorative: warning stripes on boom tip ── */}
            <rect x={btx - 8} y={boomY + 2} width={18} height={16} rx="3" fill="#f59e0b" />
            {[0, 6].map(i => (
                <rect key={i} x={btx - 8 + i} y={boomY + 2} width={3} height={16} rx="1" fill="#1f2937" opacity="0.5" />
            ))}
        </svg>
    );
}
