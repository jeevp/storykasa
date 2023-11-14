import {createContextProvider} from "@/contexts/createContextProvider";
import useStoryState from "@/contexts/story/useStoryState";

export const [StoryProvider, useStory] = createContextProvider(useStoryState)
