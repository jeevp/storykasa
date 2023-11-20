import React from 'react';
import {Typography, IconButton } from '@mui/material';
import { X } from '@phosphor-icons/react'
import STKCard from "@/components/STKCard/STKCard";
import Image from "next/image";

interface FileCardProps {
    file: File;
    showImage?: boolean
    onRemove: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, showImage, onRemove }) => {
    return (
        <STKCard>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    {showImage && (
                        <div className="mr-4">
                            <img className="w-32 h-20 object-cover" src={URL.createObjectURL(file)} alt={file.name} />
                        </div>
                    )}
                    <Typography variant="body1">{file.name}</Typography>
                </div>
                <IconButton onClick={onRemove}>
                    <X size={18} />
                </IconButton>
            </div>
        </STKCard>
    );
};

export default FileCard;
