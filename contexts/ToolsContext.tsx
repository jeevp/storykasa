import { createContext } from "react";

interface ToolsContextProps {
    pendoTrackingEnabled: boolean,
    setPendoTrackingEnabled: (enabled: boolean) => void
}

const ToolsContext = createContext<ToolsContextProps>({
    pendoTrackingEnabled: false,
    setPendoTrackingEnabled: () => {},
});

export default ToolsContext;
