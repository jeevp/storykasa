import React, { useEffect, useState } from 'react';
import './style.scss';

interface STKSlideProps {
    images: string[];
    duration?: number;
}

const STKSlide: React.FC<STKSlideProps> = ({ images, duration }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);

    const defaultTransitionTime = 2;  // Default transition time in seconds

    useEffect(() => {
        const interval = setInterval(() => {
            if (duration && elapsedTime >= duration) {
                clearInterval(interval);  // Stop changing images when duration is reached
            } else {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);  // Cycle through images
                setElapsedTime((prevTime) => prevTime + (duration ? duration / images.length : defaultTransitionTime));  // Update elapsed time
            }
        }, (duration ? (duration / images.length) : defaultTransitionTime) * 1000);  // Set interval based on duration or default transition time

        return () => clearInterval(interval);  // Cleanup interval on component unmount
    }, [images, duration]);

    return (
        <div className="stk-slide">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`slide-image ${index === currentIndex ? 'visible' : ''}`}
                    style={{
                        backgroundImage: `url(${image})`
                    }}
                ></div>
            ))}
        </div>
    );
};

export default STKSlide;
