import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import playIcon from "../../assets/icons/play.svg";
import skipIcon from "../../assets/icons/skip.svg";
import pauseIcon from "../../assets/icons/pause.svg";
import volumeOnIcon from "../../assets/icons/volume-on.svg"
import volumeOffIcon from "../../assets/icons/volume-off.svg"
import Image from "next/image";
import './style.scss';
import useAppleDevice from "@/app/customHooks/useAppleDevice";

interface STKAudioPlayerProps {
    src: string;
    preload?: boolean;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return `${minutes}:${secs.padStart(2, '0')}`;
};

const STKAudioPlayer: React.FC<STKAudioPlayerProps> = ({ src, preload = true }) => {
    const isAppleDevice = useAppleDevice()
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [howl, setHowl] = useState<Howl | null>(null);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [totalDuration, setTotalDuration] = useState('0:00');

    useEffect(() => {
        const sound = new Howl({
            src: [src],
            preload,
            onload: () => {
                setHowl(sound);
                setTotalDuration(formatTime(sound.duration()));
            },
            format: ["mp3"]
        });

        return () => {
            sound.unload();
        };
    }, [src, preload]);

    useEffect(() => {
        if (howl) {
            isPlaying ? howl.play() : howl.pause();
        }
    }, [howl, isPlaying]);

    useEffect(() => {
        if (howl) {
            howl.on('play', () => {
                requestAnimationFrame(updateProgress);
            });

            howl.on('end', () => {
                setIsPlaying(false);
                howl.seek(0);
                setProgress(0);
            });
        }
    }, [howl]);

    useEffect(() => {
        if (howl) {
            howl.volume(volume);
        }
    }, [howl, volume]);

    const updateProgress = () => {
        if (howl && howl.playing()) {
            const current = (howl.seek() as number);
            setCurrentTime(formatTime(current));
            setProgress((current / howl.duration()) * 100);
            requestAnimationFrame(updateProgress);
        }
    };

    const handleBackward = () => {
        if (howl) {
            const newTime = Math.max((howl.seek() as number) - 10, 0);
            howl.seek(newTime);
            setProgress((newTime / howl.duration()) * 100);
        }
    };

    const handleForward = () => {
        if (howl) {
            const newTime = Math.min((howl.seek() as number) + 10, howl.duration());
            howl.seek(newTime);
            setProgress((newTime / howl.duration()) * 100);
        }
    };

    const toggleMute = () => {
        if (howl) {
            howl.mute(!howl.mute());
            setVolume(howl.mute() ? 0 : 1);
        }
    };

    const handleProgressBarOnChange = (e: any) => {
        if (howl) {
            howl.seek((howl.duration() / 100) * +e?.target?.value)
        }
    }


    return (
        <div className="stk-audio-player" style={{ background: 'white' }}>
            <div className="flex items-center w-full">
                <span>{currentTime}</span>
                <div className="progress-bar px-4 flex items-center">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => handleProgressBarOnChange(e)}
                        // @ts-ignore
                        style={{ '--progress': `${progress}%` }}
                    />
                </div>
                <span>{totalDuration}</span>
            </div>

            <div className="flex items-center w-full justify-between mt-4">
                <div className="controls">
                    <button onClick={handleBackward}>
                        <Image src={skipIcon} alt="Skip backwards" width={16} style={{ transform: "rotate(180deg)" }} />
                    </button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="px-2">
                        {isPlaying ? <Image width={20} src={pauseIcon} alt="Pause" /> : <Image src={playIcon} width={20} alt="Play" />}
                    </button>
                    <button onClick={handleForward}>
                        <Image src={skipIcon} alt="Skip forward" width={16} />
                    </button>
                </div>
                <div className="volume w-30 flex items-center">
                    <button onClick={toggleMute} className="mr-2">
                        <Image src={volume ? volumeOnIcon : volumeOffIcon} alt="Volume Toggle" width={16} />
                    </button>
                    <div className="volume-bar items-center flex">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(+e.target.value)}
                            // @ts-ignore
                            style={{ '--volume': `${volume * 100}%` }}
                            className="volume-bar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default STKAudioPlayer;
