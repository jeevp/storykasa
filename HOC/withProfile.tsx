import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ProfileContext from "@/contexts/ProfileContext";
import {STK_PROFILE_ID} from "@/config";

const withProfile = (WrappedComponent: any) => {
    return (props: any) => {
        const { currentProfileId, setCurrentProfileId } = useContext(ProfileContext);
        const router = useRouter();
        const [isValidationComplete, setIsValidationComplete] = useState(false);

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const storedProfileId = localStorage.getItem(STK_PROFILE_ID)
                if (!currentProfileId && !storedProfileId) {
                    router.push('/profiles');
                } else {
                    setIsValidationComplete(true);
                    setCurrentProfileId(storedProfileId)
                }
            }
        }, []);

        return isValidationComplete ? <WrappedComponent {...props} /> : null;
    }
}

export default withProfile;
