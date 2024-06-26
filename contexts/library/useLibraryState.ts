import { useState } from 'react';
import Library from "@/models/Library";

export default function useLibraryState() {
    const [
        libraries,
        setLibraries
    ] = useState<[]>([]);

    const [sharedLibraries, setSharedLibraries] = useState<Library[]>([])
    const [sharedLibraryInvitations, setSharedLibraryInvitations] = useState<[]>([])
    const [currentLibraryStories, setCurrentLibraryStories] = useState<[]>([])
    const [currentLibrary, setCurrentLibrary] = useState<Library | null>(null)

    return {
        libraries,
        setLibraries,
        sharedLibraries,
        setSharedLibraries,
        sharedLibraryInvitations,
        setSharedLibraryInvitations,
        currentLibraryStories,
        setCurrentLibraryStories,
        currentLibrary,
        setCurrentLibrary
    };
}
