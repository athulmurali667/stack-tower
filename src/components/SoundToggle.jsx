import { useState } from 'react';
import { IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { soundManager } from '../utils/soundManager';

export default function SoundToggle() {
    const [enabled, setEnabled] = useState(true);

    const toggle = () => {
        const next = !enabled;
        setEnabled(next);
        soundManager.setEnabled?.(next);
    };

    return (
        <IconButton
            id="sound-toggle-btn"
            onClick={toggle}
            size="small"
            sx={{
                color: enabled ? '#4ade80' : 'rgba(255,255,255,0.3)',
                border: '1px solid',
                borderColor: enabled ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                '&:hover': { background: 'rgba(74,222,128,0.1)' },
            }}
        >
            {enabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
    );
}
