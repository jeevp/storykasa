import * as React from 'react';
import Card from '@mui/material/Card';
import "./style.scss"

interface STKCardProps {
    children: any,
    color?: string
}

export default function STKCard({ children, color }: STKCardProps) {
    return (
        <Card variant="outlined" className="stk-card" style={{ backgroundColor: color }}>
            {children}
        </Card>
    );
}
