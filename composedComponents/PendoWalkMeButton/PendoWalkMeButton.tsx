import React from 'react';
import IconButton from '@mui/material/IconButton';
import { XCircle, Question } from '@phosphor-icons/react';
import {useTools} from "@/contexts/tools/ToolsContext";
import STKButton from "@/components/STKButton/STKButton";

const PendoWalkMeButton = () => {
    const { showPendoWalkMeButton, setShowPendoWalkMeButton } = useTools()

    if (!showPendoWalkMeButton) return null;

    return (
        <div id="storykasa-pendo-walk-me-button" style={{
            position: 'fixed',
            right: '16px',
            bottom: '16px',
            zIndex: 1000,
        }}>
            <STKButton startIcon={<Question />} variant="contained" color="primary">
                Help me
            </STKButton>
            <IconButton onClick={() => setShowPendoWalkMeButton(false)} style={{ marginLeft: '8px' }}>
                <XCircle />
            </IconButton>
        </div>
    );
};

export default PendoWalkMeButton;
