import * as React from 'react';
import Card from '@mui/material/Card';
import "./style.scss"

interface STKCardProps {
    children: any
}

export default function STKCard({ children }: STKCardProps) {
    return (
        <Card variant="outlined" className="stk-card">
            {children}
        </Card>
    );
}
