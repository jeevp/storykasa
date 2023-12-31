import { useState } from 'react';

export default function useStoryState() {
    const [storyLanguages, setStoryLanguages] = useState<[]>([]);
    const [storyNarrators, setStoryNarrators] = useState<[]>([]);
    const [privateStories, setPrivateStories] = useState<[]>([])
    const [publicStories, setPublicStories] = useState<[]>([])
    const [storyFilters, setStoryFilters] = useState<Object>({})

    return {
        storyLanguages,
        setStoryLanguages,
        storyNarrators,
        setStoryNarrators,
        privateStories,
        setPrivateStories,
        publicStories,
        setPublicStories,
        storyFilters,
        setStoryFilters
    };
}
