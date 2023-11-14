import { useState } from 'react';

export default function useProfileState() {
    const [currentProfileId, setCurrentProfileId] = useState<any>(null);
    const [currentProfile, setCurrentProfile] = useState<any>(null);

    return {
        currentProfileId,
        setCurrentProfileId,
        currentProfile,
        setCurrentProfile
    };
}
