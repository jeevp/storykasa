import React, { createContext, useContext, ReactNode } from 'react';

export function createContextProvider<T>(useValue: () => T) {
    const Context = createContext<T | undefined>(undefined);

    // Explicitly type the props for Provider
    interface ProviderProps {
        children: ReactNode;
    }

    const Provider: React.FC<ProviderProps> = ({ children }) => {
        const value = useValue();
        return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    function useCtx() {
        const context = useContext(Context);
        if (context === undefined) {
            throw new Error("useCtx must be used within a Provider");
        }
        return context;
    }

    return [Provider, useCtx] as const; // Correct use of as const
}
