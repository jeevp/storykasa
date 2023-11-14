import { useState } from 'react';

export default function useStoryState() {
    const [publicStoryNarrators, setPublicStoryNarrators] = useState<[]>([]);
    const [privateStoryNarrators, setPrivateStoryNarrators] = useState<[]>([]);
    const [privateStories, setPrivateStories] = useState<[]>([])
    const [publicStories, setPublicStories] = useState<[]>([])
    const [storyFilters, setStoryFilters] = useState<Object>({})

    return {
        publicStoryNarrators,
        setPublicStoryNarrators,
        privateStoryNarrators,
        setPrivateStoryNarrators,
        privateStories,
        setPrivateStories,
        publicStories,
        setPublicStories,
        storyFilters,
        setStoryFilters
    };
}
