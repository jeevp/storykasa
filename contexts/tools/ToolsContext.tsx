import {createContextProvider} from "@/contexts/createContextProvider";
import useToolsState from "@/contexts/tools/useToolsState";

export const [ToolsProvider, useTools] = createContextProvider(useToolsState)
