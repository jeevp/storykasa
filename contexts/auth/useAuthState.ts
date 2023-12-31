// useAuthState.ts
import { useState } from 'react';

export default function useAuthState() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState<boolean>(false)
    const [showHeardAboutDialog, setShowHeardAboutDialog] = useState<boolean>(false)

    return {
        currentUser,
        setCurrentUser,
        currentUserIsAdmin,
        setCurrentUserIsAdmin,
        showHeardAboutDialog,
        setShowHeardAboutDialog
    };
}
