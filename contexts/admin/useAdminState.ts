import { useState } from 'react';

export default function useAdminState() {
    const [publicStoryRequests, setPublicStoryRequests] = useState<Object>([]);

    return { publicStoryRequests, setPublicStoryRequests };
}
