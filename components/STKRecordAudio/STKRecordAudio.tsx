// STKRecordAudio.tsx
import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';

import './style.scss';
import Record from "@/assets/icons/iconsJS/Record";
import {neutral800, red800} from "@/assets/colorPallet/colors";
import PauseSolid from "@/assets/icons/iconsJS/PauseSolid";
import Stop from "@/assets/icons/iconsJS/Stop";
import Formatter from "@/utils/Formatter";
import STKAudioWave from "@/components/STKAudioWave/STKAudioWave";
import STKLoading from "@/components/STKLoading/STKLoading";

interface STKRecordAudioProps {
    onComplete: Function,
    onDuration: Function
}

const STKRecordAudio = ({ onComplete = () => ({}), onDuration = () => ({}) }: STKRecordAudioProps) => {
    const [loaded, setLoaded] = useState(false);
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [stream, setStream] = useState(null);
    const [processing, setProcessing] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // // @ts-ignore
            mediaRecorderRef.current = (RecordRTC as any)(stream, { type: 'audio', mimeType: 'audio/wav' });
            // @ts-ignore
            mediaRecorderRef.current.startRecording();
            // @ts-ignore
            setStream(stream);
            setRecording(true);
            intervalRef.current = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        } catch (error) {
            console.error(error);
        }
    };

    const pauseResumeRecording = () => {
        if (recording && !paused) {
            // @ts-ignore
            mediaRecorderRef.current?.pauseRecording();
            setPaused(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
            // @ts-ignore
            mediaRecorderRef.current?.resumeRecording();
            setPaused(false);
            intervalRef.current = setInterval(() => {
                setDuration((prevDuration) => prevDuration + 1);
            }, 1000);
        }
    };


    const stopRecording = () => {
        // @ts-ignore
        mediaRecorderRef.current?.stopRecording(async () => {
            // @ts-ignore
            const blob = mediaRecorderRef.current?.getBlob();
            if (blob && typeof window !== "undefined") {
                const audioURL = URL.createObjectURL(blob);
                onComplete(blob, audioURL);
                if (intervalRef.current) clearInterval(intervalRef.current);
                onDuration(duration);
            }
        });
    };

    return (
        <div className="stk-record-audio">
            <div>
                <div className="flex items-center justify-between">
                    {recording ? (
                        paused ? (
                            <button onClick={pauseResumeRecording} className="bg-neutral-50 text-neutral-800 rounded-3xl border border-neutral-300 px-4 h-10 flex items-center">
                                <Record fill={neutral800} />
                                <span className="ml-2">Resume</span>
                            </button>
                        ) : (
                            <button onClick={pauseResumeRecording} className="bg-neutral-50 text-neutral-800 rounded-3xl border border-neutral-300 px-4 h-10 flex items-center">
                                <PauseSolid fill={neutral800} />
                                <span className="ml-2">Pause</span>
                            </button>
                        )
                    ) : (
                        <button onClick={startRecording} className="bg-red-50 text-red-800 rounded-3xl border border-red-300 px-4 h-10 flex items-center">
                            <Record fill={red800} />
                            <span className="ml-2">Start recording</span>
                        </button>
                    )}
                    {recording && !processing && (
                        <button onClick={stopRecording} className="bg-red-50 text-red-800 lg:rounded-3xl rounded-full w-10 lg:w-auto border border-red-300 justify-center lg:px-4 h-10 flex items-center">
                            <Stop fill={red800} />
                            <span className="ml-2 lg:block hidden">Stop Recording</span>
                        </button>
                    )}
                    {processing && (
                        <button className="bg-red-50 text-red-800 rounded-3xl border border-red-300 px-4 h-10 flex items-center">
                            <STKLoading />
                        </button>
                    )}
                </div>
                <div className="flex justify-center w-full py-4">
                    {stream && <STKAudioWave stream={stream} active={recording && !paused} />}
                </div>
                <div className="mt-8 flex items-center justify-between">
                    <div className={`flex items-center ${recording ? '' : 'disabled'}`}>
                        <span>REC</span>
                        <div className={`circle ml-2 ${recording && !paused ? 'bg-red-800' : recording && paused ? 'bg-neutral-300 stop-animation' : 'hidden'}`} />
                    </div>
                    <div></div>
                    <div>
                        <span>{Formatter.formatDuration(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default STKRecordAudio;
