import React from 'react';
import {Typography, IconButton } from '@mui/material';
import { X } from '@phosphor-icons/react'
import STKCard from "@/components/STKCard/STKCard";

interface FileCardProps {
    file: File;
    onRemove: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onRemove }) => {
    return (
        <STKCard>
            <div className="p-4 flex items-center justify-between">
                <Typography variant="body1">{file.name}</Typography>
                <IconButton onClick={onRemove}>
                    <X size={18} />
                </IconButton>
            </div>
        </STKCard>
    );
};

export default FileCard;
