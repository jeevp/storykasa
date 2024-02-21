import {createContextProvider} from "@/contexts/createContextProvider"
import useBlogState from "@/contexts/blog/useBlogState"

export const [BlogProvider, useBlog] = createContextProvider(useBlogState)
