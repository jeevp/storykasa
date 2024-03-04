import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import playIcon from "../../assets/icons/play.svg";
import skipIcon from "../../assets/icons/skip.svg";
import pauseIcon from "../../assets/icons/pause.svg";
import volumeOnIcon from "../../assets/icons/volume-on.svg"
import { AnimatePresence, motion } from 'framer-motion'
import volumeOffIcon from "../../assets/icons/volume-off.svg"
import Image from "next/image";
import './style.scss';
import useAppleDevice from "@/customHooks/useAppleDevice";
import STKButton from "@/components/STKButton/STKButton";
import STKLoading from "@/components/STKLoading/STKLoading";
import {neutral800} from "@/assets/colorPallet/colors";
import STKMenu from "@/components/STKMenu/STKMenu";

interface STKAudioPlayerProps {
    src: string;
    preload?: boolean;
    outlined?: boolean;
    html5?: boolean;
    onPlaying?: (playing: boolean) => void;
    onEnd?: () => void;
    onTimeChange?: () => void
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return `${minutes}:${secs.padStart(2, '0')}`;
};

const STKAudioPlayer: React.FC<STKAudioPlayerProps> = ({
    src,
    preload = true,
    outlined = false,
    html5 = false,
    onPlaying = () => ({}),
    onEnd = () => ({}),
    onTimeChange = () => ({})
}) => {
    const speedControlOption = [
        { label: "0.25", value: 0.25 },
        { label: "0.5", value: 0.5 },
        { label: "0.75", value: 0.75 },
        { label: "1.0", value: 1.0 },
        { label: "1.25", value: 1.25 },
        { label: "1.5", value: 1.5 },
        { label: "1.75", value: 1.75 },
        { label: "2.0", value: 2.0 }
    ]

    const isAppleDevice = useAppleDevice()

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [howl, setHowl] = useState<Howl | null>(null);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [totalDuration, setTotalDuration] = useState('0:00');
    const [loading, setLoading] = useState(true)
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0)

    useEffect(() => {
        if (!src) {
            setLoading(false);
            return;
        }

        const sound = new Howl({
            src: [src],
            preload,
            html5: true,
            onload: () => {
                if (isFinite(sound.duration())) {
                    setTotalDuration(formatTime(sound.duration()));
                } else {
                    console.log('Duration not finite immediately after load, trying again...');
                    // Try to set the duration again after a short delay
                    setTimeout(() => {
                        if (isFinite(sound.duration())) {
                            setTotalDuration(formatTime(sound.duration()));
                        }
                    }, 1000);
                }
                setLoading(false);
            },
            onloaderror: (id, err) => {
                console.error('Failed to load sound', err);
                setLoading(false);
            },
            onplayerror: (id, err) => {
                console.error('Playback failed', err);
                sound.once('unlock', () => sound.play());
            },
            format: ["mp3"]
        });

        setHowl(sound);

        return () => {
            sound.unload();
        };
    }, [src, preload, html5]);

    useEffect(() => {
        if (howl) {
            isPlaying ? howl.play() : howl.pause();
        }
    }, [howl, isPlaying]);

    useEffect(() => {
        let frameId: number;

        const updateProgress = () => {
            if (howl && howl.playing()) {
                const current = howl.seek(); // Ensure this is cast to a number if necessary
                setCurrentTime(formatTime(current));
                setProgress((current / howl.duration()) * 100);
            }
        };

        const loop = () => {
            updateProgress();
            frameId = requestAnimationFrame(loop);
        };

        // Start the loop only if the audio is playing
        if (isPlaying) {
            loop();
        }

        // Clean up
        return () => {
            cancelAnimationFrame(frameId);
        };
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
                setCurrentTime("0:00")
                onEnd()
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
            setCurrentTime(formatTime(newTime));
            // @ts-ignore
            onTimeChange(newTime);
        }
    };

    const handleForward = () => {
        if (howl) {
            const newTime = Math.min((howl.seek() as number) + 10, howl.duration());
            howl.seek(newTime);
            setProgress((newTime / howl.duration()) * 100);
            setCurrentTime(formatTime(newTime));
            // @ts-ignore
            onTimeChange(newTime);
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
            const newTime = (howl.duration() / 100) * +e.target.value;
            howl.seek(newTime);
            setCurrentTime(formatTime(newTime));
            setProgress((newTime / howl.duration()) * 100);
            requestAnimationFrame(updateProgress);
            // @ts-ignore
            if (onTimeChange) onTimeChange(newTime);
        }
    };



    const handleStartPlaying = () => {
        setIsPlaying(!isPlaying)
        onPlaying(!isPlaying)
    }

    const changePlaybackSpeed = (speed: any) => {
        if (howl) {
            howl.rate(speed.value);
            setPlaybackSpeed(speed.value);
        }
    };


    return (
        <div className={`stk-audio-player ${!outlined ? '!border-0' : ''}`} style={{ background: 'white' }}>
            <div className="flex items-center w-full">
                <span className="timestamp">{currentTime}</span>
                <div className="progress-bar px-4 flex items-center">
                    {loading ? (
                        <div className="flex items-center">
                            <STKLoading
                                // @ts-ignore
                                color={neutral800}
                                size="6px"  />
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            (
                            <motion.div
                                initial={{ opacity: 0, width: "100%"}}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress}
                                onChange={(e) => handleProgressBarOnChange(e)}
                                // @ts-ignore
                                style={{ '--progress': `${progress}%` }}
                            />
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                <span className="timestamp">{totalDuration}</span>
            </div>

            <div className="flex items-center w-full justify-between mt-4">
                <div className={`controls ${loading ? 'disabled' : ''}`}>
                    <STKButton onClick={handleBackward} iconButton>
                        <Image src={skipIcon} alt="Skip backwards" width={16} style={{ transform: "rotate(180deg)" }} />
                    </STKButton>
                    <div className="px-2">
                        <STKButton iconButton onClick={handleStartPlaying}>
                            {isPlaying ? <Image width={20} src={pauseIcon} alt="Pause" /> : <Image src={playIcon} width={20} alt="Play" />}
                        </STKButton>
                    </div>
                    <STKButton iconButton onClick={handleForward}>
                        <Image src={skipIcon} alt="Skip forward" width={16} />
                    </STKButton>
                </div>
                <div className="flex items-center">
                    <div className={`volume w-30 flex items-center pl-2 lg:pl-2 ${loading ? 'disabled' : ''}`}>
                        <div className="mr-2">
                            <STKButton iconButton onClick={toggleMute}>
                                <Image src={volume ? volumeOnIcon : volumeOffIcon} alt="Volume Toggle" width={16} />
                            </STKButton>
                        </div>
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
                    <div className="w-40 flex justify-end pl-2 lg:pl-2">
                        <STKMenu
                            options={speedControlOption}
                            width="auto"
                            onChange={changePlaybackSpeed} customTarget={`Speed ${playbackSpeed}x`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default STKAudioPlayer;
