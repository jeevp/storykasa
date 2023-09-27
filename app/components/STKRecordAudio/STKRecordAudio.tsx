// STKRecordAudio.tsx
import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import './style.scss';
import Record from "@/app/assets/icons/iconsJS/Record";
import {neutral800, red800} from "@/app/assets/colorPallet/colors";
import PauseSolid from "@/app/assets/icons/iconsJS/PauseSolid";
import Stop from "@/app/assets/icons/iconsJS/Stop";
import Formatter from "@/app/utils/Formatter";
import STKAudioWave from "@/app/components/STKAudioWave/STKAudioWave";
import STKLoading from "@/app/components/STKLoading/STKLoading";

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

    const ffmpegRef = useRef(new FFmpeg());
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        });
        setLoaded(true);
    };

    const startRecording = async () => {
        if (!loaded) await load();
        const _stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(_stream);
        // @ts-ignore
        setStream(_stream)
        const audioChunks: Blob[] = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
            setProcessing(true);
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const ffmpeg = ffmpegRef.current;
            await ffmpeg.writeFile('input.wav', await fetchFile(audioBlob));
            await ffmpeg.exec(['-i', 'input.wav', '-q:a', '0', '-acodec', 'libmp3lame', 'output.mp3']);
            const data = (await ffmpeg.readFile('output.mp3')) as any;
            const convertedAudioBlob = new Blob([data.buffer], { type: 'audio/mp3' })
            const audioURL = URL.createObjectURL(convertedAudioBlob);

            setProcessing(false);
            setRecording(false);
            onComplete(convertedAudioBlob, audioURL);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        mediaRecorderRef.current.start();
        setRecording(true);
        intervalRef.current = setInterval(() => {
            setDuration(prevDuration => prevDuration + 1);
        }, 1000);
    };

    const pauseResumeRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.pause();
            setPaused(true)
            if (intervalRef.current) clearInterval(intervalRef.current)
        } else {
            mediaRecorderRef.current?.resume();
            setPaused(false)
            intervalRef.current = setInterval(() => {
                setDuration(prevDuration => prevDuration + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        onDuration(duration)
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
