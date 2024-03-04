import React, { useState, useEffect } from 'react';

interface CountdownProps {
    onCountdownComplete: () => void;
    start: boolean;
}

const CountDown: React.FC<CountdownProps> = ({ onCountdownComplete, start }) => {
    const [count, setCount] = useState<number>(3);
    const [show, setShow] = useState<boolean>(false); // State to control visibility

    useEffect(() => {
        // Reset count and show overlay when start changes to true
        if (start) {
            setCount(3);
            setShow(true); // Show overlay when countdown starts
        }
    }, [start]);

    useEffect(() => {
        if (!start) return; // Only proceed if start is true

        if (count === 0) {
            onCountdownComplete();
            setShow(false); // Hide overlay when countdown is complete
            return;
        }

        const timerId = setTimeout(() => {
            setCount(count - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [count, start]);

    return (
        <div className={`${!show ? 'hidden' : ''} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
            <div className="text-9xl font-bold text-white transition-opacity duration-700 ease-out" style={{ opacity: count === 0 ? 0 : 1 }}>
                {count}
            </div>
        </div>
    );
};

export default CountDown;
