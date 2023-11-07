// STKSkeleton.tsx
import React from 'react';
import './style.scss'; // Importing SCSS styles

interface STKSkeletonProps {
    width?: string;
    height?: string;
    circle?: boolean;
}

const STKSkeleton: React.FC<STKSkeletonProps> = ({ width, height, circle }) => {
    // Inline styles for dynamic width and height
    const skeletonStyle: React.CSSProperties = {
        width: width || '100%',
        height: height || '1rem',
    };

    // Add the --circle modifier to the class if circle prop is true
    const skeletonClasses = `skeleton ${circle ? 'skeleton--circle' : ''}`;

    return <div className={skeletonClasses} style={skeletonStyle}></div>;
};

export default STKSkeleton;
