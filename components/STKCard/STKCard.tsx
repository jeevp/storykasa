import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

interface STKCardProps {
    children: any,
    padding: string
}

export default function STKCard({ children }: STKCardProps) {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">{children}</Card>
        </Box>
    );
}
