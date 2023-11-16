import { useState } from 'react';

export default function useToolsState() {
    const [pendoTrackingEnabled, setPendoTrackingEnabled] = useState<boolean>(false);
    const [showPendoWalkMeButton, setShowPendoWalkMeButton] = useState<boolean>(true)
    return {
        pendoTrackingEnabled,
        setPendoTrackingEnabled,
        showPendoWalkMeButton,
        setShowPendoWalkMeButton
    };
}
