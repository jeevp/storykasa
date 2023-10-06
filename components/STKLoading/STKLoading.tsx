// LoadingDots.tsx
import React from 'react';
import './style.scss';
import {green600} from "@/assets/colorPallet/colors";

interface STKLoadingProps {
    color?: string
}

const STKLoading: React.FC = ({ color }: STKLoadingProps) => {
    return (
        <div className="loading-dots">
            {[1,2,3].map((dot) => (
                // eslint-disable-next-line react/jsx-key
                <div key={dot} className="dot" style={{ backgroundColor: color || green600 }} />
            ))}
        </div>
    );
};

export default STKLoading;
