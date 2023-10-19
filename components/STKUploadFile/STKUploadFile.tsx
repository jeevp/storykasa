import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography, Snackbar } from '@mui/material';
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
    multiple?: boolean
    maxFiles?: number
    errorMessage?: string
    onFileUpload: (blob: any, sourceUrl: any, duration: any) => void
}

// @ts-ignore
const STKUploadFile: React.FC = (props: STKUploadFileProps) => {
    const MAX_FILE_SIZE_MB = props.maxSize || 5;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    const MAX_FILES_DEFAULT = 10

    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);

    const isMaxFilesReached = files.length >= (props.maxFiles || MAX_FILES_DEFAULT);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (isMaxFilesReached) {
            setError('Maximum number of files reached');
            return;
        }

        const validFiles = acceptedFiles.filter(file => {
            return props.acceptedTypes.includes(file.type) && file.size <= MAX_FILE_SIZE_BYTES;
        });

        if (validFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
            setError(null); // Reset error state

            const uploadFiles = async () => {
                for (let i = 0; i < validFiles.length; i++) {
                    const file = validFiles[i];

                    // Reset progress for each file
                    setUploadProgress(0);

                    // Simulate upload progress
                    let progress = 0;
                    const intervalId = setInterval(() => {
                        progress += 10;
                        setUploadProgress(progress);
                        if (progress === 100) {
                            clearInterval(intervalId);

                            // Process the file once the progress reaches 100%
                            processFile(file);
                        }
                    }, 500);
                }
            };

            const processFile = async (file: any) => {
                const buffer = await file.arrayBuffer();
                const blob = new Blob([buffer], { type: file.type });

                let sourceUrl = null;
                if (file.type.startsWith('image/')) {
                    sourceUrl = URL.createObjectURL(blob);
                } else if (file.type.startsWith('audio/')) {
                    sourceUrl = URL.createObjectURL(blob);
                }

                let duration = null;
                if (file.type.startsWith('audio/')) {
                    duration = await getAudioDuration(file);
                }

                // Call the onFileUpload prop function
                props.onFileUpload(blob, sourceUrl, duration);

                // Set upload complete if this is the last file
                if (files.indexOf(file) === files.length - 1) {
                    setUploadComplete(true);
                }
            };

            uploadFiles();
        } else {
            setError(`Please upload valid files with a size not exceeding ${MAX_FILE_SIZE_MB}MB.`);
        }
    }, [files, isMaxFilesReached]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: isMaxFilesReached ? undefined : onDrop,
        // @ts-ignore
        accept: props.acceptedTypes.join(','),
        multiple: props.multiple,
    });

    const handleClose = () => {
        setError(null);
    };

    const handleRemoveFile = (e: Event, index: number) => {
        e.stopPropagation()
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);

        // If there are no files left, reset the upload progress and completion state
        if (newFiles.length === 0) {
            setUploadProgress(null);
            setUploadComplete(false);
        }

        props.onFileUpload(null, null, null);
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
                // @ts-ignore
                style={styles.dropzone}>
                {!uploadComplete || props.multiple ? (
                    <>
                        <input {...getInputProps()} />
                        {(props.multiple || !uploadProgress) && (files.length < (props.maxFiles || MAX_FILES_DEFAULT)) ? (
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
                        ) : null}
                        {uploadProgress !== null && !uploadComplete && (
                            <div className={props.multiple ? 'mt-4' : ''}>
                                <STKLinearProgress value={uploadProgress} />
                            </div>
                        )}

                        {props.multiple ? (
                            <div className={uploadComplete || uploadProgress ? 'mt-4' : ''}>
                                {files.map((file, index) => (
                                    <div className="first:mt-0 mt-2" key={index}>
                                        <STKFileCard
                                            key={index}
                                            file={file}
                                            showImage
                                            // @ts-ignore
                                            onRemove={(e: Event) => handleRemoveFile(e, index)} />
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div>
                        {files.map((file, index) => (
                            <div className="first:mt-0 mt-2">
                                <STKFileCard
                                    key={index}
                                    file={file}
                                    showImage
                                    // @ts-ignore
                                    onRemove={(e: Event) => handleRemoveFile(e, index)} />
                            </div>
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
                            // @ts-ignore
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
