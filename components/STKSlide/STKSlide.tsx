import React, { useEffect, useState } from 'react';
import './style.scss';

interface STKSlideProps {
    images: string[];
    duration?: number;
    targetDuration?: number;  // New property
    isRunning: boolean;
    restart?: boolean;
}

const STKSlide: React.FC<STKSlideProps> = ({
   images,
   duration,
   targetDuration = 0,  // Default to 0 if not provided
   isRunning = true,
   restart
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [restartToggle, setRestartToggle] = useState(restart);

    const defaultTransitionTime = 2;  // Default transition time in seconds

    useEffect(() => {
        if (restart !== restartToggle) {
            console.log(">>>>>>>>")
            setCurrentIndex(0);
            setElapsedTime(0);
            setRestartToggle(restart);
        }
    }, [restart]);

    useEffect(() => {
        // Calculate initial index and elapsed time based on targetDuration
        const initialIndex = duration ? Math.floor(targetDuration / (duration / images.length)) : 0;
        const initialElapsedTime = initialIndex * (duration ? duration / images.length : defaultTransitionTime);

        setCurrentIndex(initialIndex);
        setElapsedTime(initialElapsedTime);

        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                if ((duration && elapsedTime >= duration) || (currentIndex === images.length - 1)) {
                    clearInterval(interval);
                } else {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                    setElapsedTime((prevTime) => prevTime + (duration ? duration / images.length : defaultTransitionTime));
                }
            }, (duration ? (duration / images.length) : defaultTransitionTime) * 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [images, duration, targetDuration, isRunning]);  // Added targetDuration to dependency array

    const offset = -currentIndex * 100;

    console.log({ restart })
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
