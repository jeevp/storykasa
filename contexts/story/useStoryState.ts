import { useState, useEffect } from 'react';
import { base64ToBlob, blobToBase64 } from "@/utils/BlobHelper"


export default function useStoryState() {
    const [storyLanguages, setStoryLanguages] = useState<[]>([]);
    const [storyNarrators, setStoryNarrators] = useState<[]>([]);
    const [privateStories, setPrivateStories] = useState<[]>([]);
    const [publicStories, setPublicStories] = useState<[]>([]);
    const [storyFilters, setStoryFilters] = useState<Object>({});
    const [totalRecordingTime, setTotalRecordingTime] = useState<number>(0);
    const [currentGuestDemoStory, setCurrentGuestDemoStory] = useState<any>(null);

    useEffect(() => {
        const savedStory = typeof window !== 'undefined' ? localStorage.getItem('currentGuestDemoStory') : null;
        if (savedStory) {
            const storyObject = JSON.parse(savedStory);
            // Convert Base64 back to Blob if audioBlob exists
            if (storyObject.audioBlob) {
                storyObject.audioBlob = base64ToBlob(storyObject.audioBlob, storyObject.audioBlob.type);
            }
            setCurrentGuestDemoStory(storyObject);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && currentGuestDemoStory) {
            if (currentGuestDemoStory.audioBlob) {
                // Convert Blob to Base64 before storing
                blobToBase64(currentGuestDemoStory.audioBlob).then((base64) => {
                    const storyToSave = { ...currentGuestDemoStory, audioBlob: base64 };
                    localStorage.setItem('currentGuestDemoStory', JSON.stringify(storyToSave));
                });
            } else {
                // If there's no audioBlob, store it directly
                localStorage.setItem('currentGuestDemoStory', JSON.stringify(currentGuestDemoStory));
            }
        }
    }, [currentGuestDemoStory]);

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
        setStoryFilters,
        totalRecordingTime,
        setTotalRecordingTime,
        currentGuestDemoStory,
        setCurrentGuestDemoStory,
    };
}
