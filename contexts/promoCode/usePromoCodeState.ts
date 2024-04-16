import { useState } from 'react';

export default function usePromoCodeState() {
    const [promoCodes, setPromoCodes] = useState<[]>([]);

    return {
        promoCodes,
        setPromoCodes
    };
}
