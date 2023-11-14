import { useState } from 'react';

export default function useToolsState() {
    const [pendoTrackingEnabled, setPendoTrackingEnabled] = useState<boolean>(false);

    return {
        pendoTrackingEnabled,
        setPendoTrackingEnabled
    };
}
