import { useEffect, useState } from 'react';

const useAppleDevice = () => {
    const [isAppleDevice, setIsAppleDevice] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent;

        setIsAppleDevice(/iPhone|iPad|Mac/.test(userAgent));
    }, []);

    return isAppleDevice;
};

export default useAppleDevice;
