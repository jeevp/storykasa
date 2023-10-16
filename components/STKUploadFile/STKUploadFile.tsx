// components/STKUploadFile.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { LinearProgress, Typography, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import {red600} from "@/assets/colorPallet/colors";
import { X } from '@phosphor-icons/react'
import STKButton from "@/components/STKButton/STKButton";
import STKFileCard from "@/composedComponents/FileCard/FileCard";
import STKLinearProgress from "@/components/STKLinearProgress/STKLinearProgress";

const RedSnackbar = styled(Snackbar)(({ theme }) => ({
    '.MuiSnackbarContent-root': {
        backgroundColor: red600,
    },
}));

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface STKUploadFileProps {
    onFileUpload: (blob: any, audioUrl: any, duration: any) => void
}

// @ts-ignore
const STKUploadFile: React.FC = (props: STKUploadFileProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'audio/mpeg') {
            if (file.size <= MAX_FILE_SIZE_BYTES) {
                setFile(file);
                setError(null);  // Reset error state
                // Mock upload progress
                let progress = 0;
                const intervalId = setInterval(() => {
                    progress += 10;
                    setUploadProgress(progress);
                    if (progress === 100) {
                        clearInterval(intervalId);
                        setUploadComplete(true);
                        file.arrayBuffer().then(async (buffer) => {
                            const blob = new Blob([buffer], { type: 'audio/mpeg' });
                            const audioURL = URL.createObjectURL(blob);
                            const duration = await getAudioDuration(file)

                            props.onFileUpload(blob, audioURL, duration);
                        });
                    }
                }, 500);
            } else {
                setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`)
            }
        } else {
            setError('Please upload a valid MP3 file.');
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        // @ts-ignore
        accept: 'audio/mp3',
        multiple: false,
    });

    const handleClose = () => {
        setError(null);
    };

    const handleRemoveFile = (e: Event) => {
        e.stopPropagation()
        setFile(null);
        setUploadProgress(null);
        setUploadComplete(false);
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
                {!uploadComplete ? (
                  <>
                      <input {...getInputProps()} />
                      {!uploadProgress && (
                          <div>
                              <Typography variant="subtitle1">
                                  Drag & drop an MP3 file here, or click to select one
                              </Typography>
                              <div>
                                  <label className="text-sm font-semibold">50MB max size</label>
                              </div>
                          </div>
                      )}
                      {uploadProgress !== null && (
                          <STKLinearProgress value={uploadProgress} />
                      )}
                  </>
                ) : (
                    <div>
                        <STKFileCard
                            file={file as File}
                            // @ts-ignore
                            onRemove={handleRemoveFile} />
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
