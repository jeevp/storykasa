// useAuthState.ts
import { useState } from 'react';

export default function useAuthState() {
    const [currentUser, setCurrentUser] = useState<any>(null);

    return { currentUser, setCurrentUser };
}
