import React, { useEffect, useState } from 'react';
import './style.scss';

interface STKSlideProps {
    images: string[];
    duration?: number;
    isRunning: boolean;
    restart?: boolean;
}

const STKSlide: React.FC<STKSlideProps> = ({
    images,
    duration,
    isRunning = true,
    restart
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [restartToggle, setRestartToggle] = useState(restart);

    const defaultTransitionTime = 2;  // Default transition time in seconds

    useEffect(() => {
        if (restart !== restartToggle) {
            // Restart the slide show
            setCurrentIndex(0);
            setElapsedTime(0);
            setRestartToggle(restart);
        }
    }, [restart]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                if ((duration && elapsedTime >= duration) || (currentIndex === images.length - 1)) {
                    clearInterval(interval);  // Stop changing images when duration is reached or at the last image
                } else {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);  // Cycle through images
                    setElapsedTime((prevTime) => prevTime + (duration ? duration / images.length : defaultTransitionTime));  // Update elapsed time
                }
            }, (duration ? (duration / images.length) : defaultTransitionTime) * 1000);  // Set interval based on duration or default transition time
        }

        return () => {
            if (interval) clearInterval(interval);  // Cleanup interval on component unmount
        };
    }, [images, duration, currentIndex, isRunning]);  // Added isRunning to dependency array


    const offset = -currentIndex * 100;  // Calculate offset percentage based on currentIndex

    return (
        <div className="stk-slide">
            <div className="slide-container" style={{ transform: `translateX(${offset}%)` }}>
                {images.map((image, index) => (
                    <div key={index} className="slide-image">
                        <img src={image} alt="" style={{ width: '100%', height: '100%' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default STKSlide;
