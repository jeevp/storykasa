import { useState } from 'react';

export default function useLibraryState() {
    const [
        libraries,
        setLibraries
    ] = useState<[]>([]);

    const [sharedLibraries, setSharedLibraries] = useState<[]>([])
    const [sharedLibraryInvitations, setSharedLibraryInvitations] = useState<[]>([])

    return {
        libraries,
        setLibraries,
        sharedLibraries,
        setSharedLibraries,
        sharedLibraryInvitations,
        setSharedLibraryInvitations
    };
}
