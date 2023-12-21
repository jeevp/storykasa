import { useState } from 'react';

export default function useLibraryState() {
    const [
        libraries,
        setLibraries
    ] = useState<[]>([]);

    const [sharedLibraries, setSharedLibraries] = useState<[]>([])
    const [sharedLibraryInvitations, setSharedLibraryInvitations] = useState<[]>([])
    const [currentLibraryStories, setCurrentLibraryStories] = useState<[]>([])

    return {
        libraries,
        setLibraries,
        sharedLibraries,
        setSharedLibraries,
        sharedLibraryInvitations,
        setSharedLibraryInvitations,
        currentLibraryStories,
        setCurrentLibraryStories
    };
}
