import {createContextProvider} from "@/contexts/createContextProvider";
import useLibraryState from "@/contexts/library/useLibraryState";

export const [LibraryProvider, useLibrary] = createContextProvider(useLibraryState)
