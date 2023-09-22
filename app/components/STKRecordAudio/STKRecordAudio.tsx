// STKRecordAudio.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import WaveSurfer from 'wavesurfer.js';
import './style.scss';
import STKAudioPlayer from "@/app/components/STKAudioPlayer/STKAudioPlayer";
import Record from "@/app/assets/icons/iconsJS/Record";
import {neutral800, red800} from "@/app/assets/colorPallet/colors";
import PauseSolid from "@/app/assets/icons/iconsJS/PauseSolid";
import Stop from "@/app/assets/icons/iconsJS/Stop";

interface STKRecordAudioProps {
    onComplete: Function
}
const STKRecordAudio = ({ onComplete = () => ({}) }: STKRecordAudioProps) => {
    const [loaded, setLoaded] = useState(false);
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [paused, setPaused] = useState(false);
    const [recordCompleted, setRecordCompleted] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);  // added a
    const [duration, setDuration] = useState(0)// udioRef


    useEffect(() => {
        if (audioURL && waveformRef.current && audioRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'violet',
                progressColor: 'purple',
                backend: 'MediaElement',  // updated to use MediaElement backend
                mediaControls: true,  // added mediaControls
            });

            waveSurferRef.current.load(audioRef.current);  // updated to pass audioRef

            return () => {
                waveSurferRef.current?.destroy();
            };
        }
    }, [audioURL]);

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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const ffmpeg = ffmpegRef.current;
            await ffmpeg.writeFile('input.wav', await fetchFile(audioBlob));
            await ffmpeg.exec(['-i', 'input.wav', 'output.mp3']);
            const data = (await ffmpeg.readFile('output.mp3')) as any;
            setAudioURL(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
        };
        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const pauseResumeRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.pause();
            setPaused(true)
        } else {
            mediaRecorderRef.current?.resume();
            setPaused(false)
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
        setRecordCompleted(true)
        onComplete(audioURL)
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
                    {recording && (
                        <button onClick={stopRecording} className="bg-red-50 text-red-800 rounded-3xl border border-red-300 px-4 h-10 flex items-center">
                            <Stop fill={red800} />
                            <span className="ml-2">Stop Recording</span>
                        </button>
                    )}
                </div>
                {/*<div ref={waveformRef} id="waveform"></div>*/}
                <div className="mt-8">
                    <div className={recording ? "flex items-center" : "disabled"}>
                        <span>REC</span>
                        <div className={`circle ml-2 ${recording && !paused ? 'bg-red-800' : recording && paused ? 'bg-neutral-300 stop-animation' : 'hidden'}`} />
                    </div>
                    <div></div>
                    <div>
                        <span>{duration}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default STKRecordAudio;
