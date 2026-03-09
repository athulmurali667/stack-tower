/**
 * Tower Craft – Alignment Logic
 * All measurements in pixels on the game canvas.
 */

/** Fewer than this many pixels difference = "perfect" drop */
export const PERFECT_THRESHOLD = 6;

/**
 * Calculate overlap between the falling cube and the top tower block.
 *
 * @param {number} curLeft   - left edge of the falling cube (px)
 * @param {number} curWidth  - width of the falling cube (px)
 * @param {number} prevLeft  - left edge of the top tower block (px)
 * @param {number} prevWidth - width of the top tower block (px)
 *
 * @returns {{ overlap: number, newLeft: number, newWidth: number, isPerfect: boolean, missed: boolean }}
 */
export function calculateOverlap(curLeft, curWidth, prevLeft, prevWidth) {
    const curRight = curLeft + curWidth;
    const prevRight = prevLeft + prevWidth;

    const overlapLeft = Math.max(curLeft, prevLeft);
    const overlapRight = Math.min(curRight, prevRight);
    const overlap = overlapRight - overlapLeft;

    if (overlap <= 0) {
        return { overlap: 0, newLeft: curLeft, newWidth: 0, isPerfect: false, missed: true };
    }

    const diff = Math.abs(curLeft - prevLeft);
    const isPerfect = diff < PERFECT_THRESHOLD;

    // If perfect, keep same width & snap to previous position
    if (isPerfect) {
        return {
            overlap: prevWidth,
            newLeft: prevLeft,
            newWidth: prevWidth,
            isPerfect: true,
            missed: false,
        };
    }

    return {
        overlap,
        newLeft: overlapLeft,
        newWidth: overlap,
        isPerfect: false,
        missed: false,
    };
}

/**
 * Pick a vivid cartoon color for each new cube.
 * Cycles through a fixed palette for visual variety.
 */
const CUBE_COLORS = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#f43f5e', // rose
    '#a855f7', // purple
    '#06b6d4', // cyan
    '#eab308', // yellow
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
];

let colorIndex = 0;
export function nextCubeColor() {
    const c = CUBE_COLORS[colorIndex % CUBE_COLORS.length];
    colorIndex++;
    return c;
}

export function resetColorCycle() {
    colorIndex = 0;
}
