import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function MilestoneDialog() {
    const { milestone, dismissMilestone } = useGameStore();

    return (
        <Dialog
            open={!!milestone}
            onClose={dismissMilestone}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                component: motion.div,
                initial: { scale: 0.7, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { type: 'spring', stiffness: 250, damping: 20 },
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.6rem', pt: 3 }}>
                🏆 Milestone!
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
                <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: '#4ade80',
                    marginBottom: '8px',
                }}>
                    {milestone}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                    Keep stacking to reach floor 100!
                </div>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    id="milestone-close-btn"
                    variant="contained"
                    onClick={dismissMilestone}
                    sx={{
                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                        color: '#000',
                        fontWeight: 800,
                        px: 4,
                        py: 1,
                        '&:hover': { background: 'linear-gradient(135deg, #6ee7a0, #4ade80)' },
                    }}
                >
                    Keep Building! 🏗️
                </Button>
            </DialogActions>
        </Dialog>
    );
}
