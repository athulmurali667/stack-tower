import { IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useGameStore } from '../store/gameStore';

export default function SoundToggle() {
    const { soundEnabled, toggleSound } = useGameStore();

    return (
        <IconButton
            id="sound-toggle-btn"
            onClick={toggleSound}
            size="small"
            sx={{
                color: soundEnabled ? '#4ade80' : 'rgba(255,255,255,0.3)',
                border: '1px solid',
                borderColor: soundEnabled ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                '&:hover': {
                    background: 'rgba(74,222,128,0.1)',
                },
            }}
        >
            {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
    );
}
