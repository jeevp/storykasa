import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LinearProgress, Typography, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { red600 } from "@/assets/colorPallet/colors";
import { X } from '@phosphor-icons/react'
import STKButton from "@/components/STKButton/STKButton";
import STKFileCard from "@/composedComponents/FileCard/FileCard";
import STKLinearProgress from "@/components/STKLinearProgress/STKLinearProgress";

const RedSnackbar = styled(Snackbar)(({ theme }) => ({
    '.MuiSnackbarContent-root': {
        backgroundColor: red600,
    },
}));

interface STKUploadFileProps {
    maxSize?: number
    placeholder?: string
    acceptedTypes: Array<string>
    helperText?: string
    errorMessage?: string
    onFileUpload: (blob: any, imageUrl: any, audioUrl: any, duration: any) => void
}

const STKUploadFile: React.FC = (props: STKUploadFileProps) => {
    const MAX_FILE_SIZE_MB = props.maxSize || 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file => {
            return props.acceptedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_BYTES;
        });

        if (validFiles.length > 0) {
            setFiles(validFiles);
            setError(null);  // Reset error state

            const uploadFiles = async () => {
                for (let i = 0; i < validFiles.length; i++) {
                    const file = validFiles[i];
                    const progress = ((i + 1) / validFiles.length) * 100;
                    setUploadProgress(progress);

                    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay

                    if (i === validFiles.length - 1) {
                        setUploadComplete(true);
                    }

                    const buffer = await file.arrayBuffer();
                    const blob = new Blob([buffer], { type: file.type });

                    let imageUrl = null;
                    if (file.type.startsWith('image/')) {
                        imageUrl = URL.createObjectURL(blob);
                    }

                    let audioUrl = null;
                    let duration = null;
                    if (file.type.startsWith('audio/')) {
                        audioUrl = URL.createObjectURL(blob);
                        duration = await getAudioDuration(file);
                    }

                    props.onFileUpload(blob, imageUrl, audioUrl, duration);
                }
            };

            uploadFiles();
        } else {
            setError(`Please upload valid files with a size not exceeding ${MAX_FILE_SIZE_MB}MB.`);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: props.acceptedTypes.join(','), // Accept multiple types
        multiple: true, // Allow multiple file selection
    });

    const handleClose = () => {
        setError(null);
    };

    const handleRemoveFile = (e, index: number) => {
        e.stopPropagation()
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        // If there are no files left, reset the upload progress and completion state
        if (newFiles.length === 0) {
            setUploadProgress(null);
            setUploadComplete(false);
        }

        props.onFileUpload(null, null, null, null);
    }

    const getAudioDuration = async (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        return new Promise((resolve, reject) => {
            const audioElement = new Audio(objectUrl);
            audioElement.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(objectUrl);  // Free up memory
                resolve(Math.round(audioElement.duration));
            });
            audioElement.addEventListener('error', () => {
                URL.revokeObjectURL(objectUrl);  // Free up memory
                reject(new Error('Failed to load audio file'));
            });
        });
    };

    return (
        <div>
            <div
                {...getRootProps()}
                style={styles.dropzone}>
                {!uploadComplete ? (
                    <>
                        <input {...getInputProps()} />
                        {!uploadProgress && (
                            <div>
                                <Typography variant="subtitle1">
                                    {props.placeholder || "Drag & drop files here, or click to select them"}
                                </Typography>
                                <div>
                                    <label className="text-sm font-semibold">
                                        {props.helperText ? props.helperText : (
                                            <>
                                                {props.maxSize || 5}MB max size
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        )}
                        {uploadProgress !== null && (
                            <STKLinearProgress value={uploadProgress} />
                        )}
                    </>
                ) : (
                    <div>
                        {files.map((file, index) => (
                            <STKFileCard
                                key={index}
                                file={file}
                                showImage
                                onRemove={(e) => handleRemoveFile(e, index)} />
                        ))}
                    </div>
                )}
            </div>
            <RedSnackbar
                open={error !== null}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                message={error}
                action={
                    <React.Fragment>
                        <STKButton
                            iconButton
                            onClick={handleClose}
                            style={styles.closeButton}>
                            <X size={18} color="white" />
                        </STKButton>
                    </React.Fragment>
                }
            />
        </div>
    );
};

const styles = {
    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    },
    closeButton: {
        color: '#ffffff',
    },
};

export default STKUploadFile;
