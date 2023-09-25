// LoadingDots.tsx
import React from 'react';
import './style.scss';

const STKLoading: React.FC = () => {
    return (
        <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );
};

export default STKLoading;
