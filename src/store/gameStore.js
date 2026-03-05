import { create } from 'zustand';

const MILESTONES = {
    10: "Nice Start! 🏗️",
    25: "Tower Rising! 🏛️",
    50: "Halfway There! 🌆",
    75: "Almost There! 🏙️",
    100: "CONGRATULATIONS! 🎉",
};

const INITIAL_STATE = {
    gameStarted: false,
    currentFloor: 1,
    money: 0,
    incomeMultiplier: 1,
    buildPower: 1,
    speedMultiplier: 1,
    upgrades: { material: 0, speed: 0, buildPower: 0 },
    blocks: [], // array of { width, left, color }
    soundEnabled: true,
    milestone: null,
    won: false,
    shaking: false,
    floatingMoney: [], // { id, amount, x, y }
};

const BASE_WIDTH = 300;

const MATERIAL_COLORS = [
    ['#4ade80', '#22c55e'], // green - level 0
    ['#60a5fa', '#3b82f6'], // blue - level 1-2
    ['#f59e0b', '#d97706'], // amber - level 3-4
    ['#f472b6', '#ec4899'], // pink - level 5-6
    ['#a78bfa', '#8b5cf6'], // purple - level 7-8
    ['#67e8f9', '#22d3ee'], // cyan - level 9-10
    ['#fbbf24', '#f59e0b'], // gold - level 11+
];

function getMaterialColor(level) {
    const idx = Math.floor(level / 2);
    return MATERIAL_COLORS[Math.min(idx, MATERIAL_COLORS.length - 1)];
}

export const useGameStore = create((set, get) => ({
    ...INITIAL_STATE,

    startGame: () => set({
        ...INITIAL_STATE,
        gameStarted: true,
        blocks: [{ width: BASE_WIDTH, left: 0, color: MATERIAL_COLORS[0] }],
    }),

    stackBlock: (newWidth, newLeft, overlapPercent) => {
        const state = get();
        const { currentFloor, money, incomeMultiplier, buildPower, upgrades } = state;
        const baseReward = 10;
        const reward = Math.round(baseReward * currentFloor * incomeMultiplier * buildPower);
        const newFloor = currentFloor + 1;
        const colors = getMaterialColor(upgrades.material);
        const newBlock = { width: newWidth, left: newLeft, color: colors };

        const floatId = Date.now();
        const newFloat = { id: floatId, amount: reward };

        const isMilestone = MILESTONES[newFloor];
        const isWon = newFloor > 100;

        set({
            currentFloor: Math.min(newFloor, 100),
            money: money + reward,
            blocks: [...state.blocks, newBlock],
            floatingMoney: [...state.floatingMoney, newFloat],
            milestone: isMilestone && newFloor <= 100 ? isMilestone : state.milestone,
            won: isWon || newFloor === 100,
        });

        setTimeout(() => {
            set(s => ({ floatingMoney: s.floatingMoney.filter(f => f.id !== floatId) }));
        }, 1400);
    },

    missBlock: () => {
        set({ shaking: true });
        setTimeout(() => {
            set({
                ...INITIAL_STATE,
                gameStarted: true,
                blocks: [{ width: BASE_WIDTH, left: 0, color: MATERIAL_COLORS[0] }],
                shaking: false,
            });
        }, 600);
    },

    addIdleIncome: () => {
        const { currentFloor, incomeMultiplier, money } = get();
        const income = Math.round(currentFloor * 2 * incomeMultiplier);
        set({ money: money + income });
    },

    buyUpgrade: (type) => {
        const state = get();
        const level = state.upgrades[type];
        let cost = 0;
        let updates = {};

        if (type === 'material') {
            cost = Math.round(100 * Math.pow(1.3, level));
            if (state.money < cost) return;
            updates = {
                incomeMultiplier: state.incomeMultiplier + 0.2,
                upgrades: { ...state.upgrades, material: level + 1 },
            };
        } else if (type === 'speed') {
            cost = Math.round(150 * Math.pow(1.4, level));
            if (state.money < cost) return;
            updates = {
                speedMultiplier: Math.max(0.2, state.speedMultiplier - 0.05),
                upgrades: { ...state.upgrades, speed: level + 1 },
            };
        } else if (type === 'buildPower') {
            cost = Math.round(200 * Math.pow(1.5, level));
            if (state.money < cost) return;
            updates = {
                buildPower: state.buildPower + 1,
                upgrades: { ...state.upgrades, buildPower: level + 1 },
            };
        }

        set({ money: state.money - cost, ...updates });
    },

    dismissMilestone: () => set({ milestone: null }),

    resetGame: () => set({
        ...INITIAL_STATE,
        gameStarted: true,
        blocks: [{ width: BASE_WIDTH, left: 0, color: MATERIAL_COLORS[0] }],
        won: false,
        milestone: null,
    }),

    toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),

    getUpgradeCost: (type) => {
        const state = get();
        const level = state.upgrades[type];
        if (type === 'material') return Math.round(100 * Math.pow(1.3, level));
        if (type === 'speed') return Math.round(150 * Math.pow(1.4, level));
        if (type === 'buildPower') return Math.round(200 * Math.pow(1.5, level));
        return 0;
    },

    BASE_WIDTH,
}));
