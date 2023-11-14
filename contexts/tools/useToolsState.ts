import { useState } from 'react';

export default function useToolsState() {
    const [pendoTrackingEnabled, setPendoTrackingEnabled] = useState<[]>([]);

    return {
        pendoTrackingEnabled,
        setPendoTrackingEnabled
    };
}
