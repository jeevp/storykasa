import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

interface TooltipProps {
    children: React.ReactNode;
    text: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    active?: boolean;
}

const STKTooltip: React.FC<TooltipProps> = ({ children, text, position = 'bottom', active = true }) => {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const calculatePosition = () => {
        if (!anchorRef.current || !tooltipRef.current) return;

        const anchorRect = anchorRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        let top: number, left: number;

        switch (position) {
            case 'top':
                top = anchorRect.top - tooltipRect.height;
                left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = anchorRect.bottom;
                left = anchorRect.left + (anchorRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = anchorRect.top + (anchorRect.height / 2) - (tooltipRect.height / 2);
                left = anchorRect.left - tooltipRect.width;
                break;
            case 'right':
                top = anchorRect.top + (anchorRect.height / 2) - (tooltipRect.height / 2);
                left = anchorRect.right;
                break;
            default:
                top = 0;
                left = 0;
                break;
        }

        tooltipRef.current.style.top = `${top + window.scrollY}px`;
        tooltipRef.current.style.left = `${left + window.scrollX}px`;
    };

    useEffect(() => {
        if (showTooltip) {
            calculatePosition();
        }
    }, [showTooltip]);

    const tooltipContent = (
        <div ref={tooltipRef} className={`tooltip-content ${showTooltip ? 'visible' : ''}`}>
            {text}
        </div>
    );

    return (
        <div>
            <div
                className="inline-block"
                ref={anchorRef}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {children}
            </div>
            {active && ReactDOM.createPortal(tooltipContent, document.body)}
        </div>
    );
};

export default STKTooltip;
