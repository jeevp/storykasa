import { useState } from 'react';

export default function useBlogState() {
    const [blogPosts, setBlogPosts] = useState<[]>([]);

    return {
        blogPosts,
        setBlogPosts
    };
}
