import { useState } from 'react';

export default function useLibraryState() {
    const [sharedLibraries, setSharedLibraries] = useState<[]>([]);

    return {
        sharedLibraries,
        setSharedLibraries
    };
}
