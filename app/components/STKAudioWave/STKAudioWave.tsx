import { useEffect, useRef } from "react";

interface STKAudioWaveProps {
    stream: any,
    active: boolean
}

export default function STKAudioWave({ stream, active }: STKAudioWaveProps){
    const canvasRef = useRef(null);
    const audioContextRef = useRef(new (window.AudioContext)());
    const analyserRef = useRef(audioContextRef.current.createAnalyser());
    const animationFrameRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;

        audioContextRef.current.resume().then(() => {
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyser);

            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                analyser.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = 1;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    const gradient = ctx.createLinearGradient(0, canvas.height / 2 - barHeight, 0, canvas.height / 2 + barHeight);
                    gradient.addColorStop(0, 'rgba(61, 153, 109, 1)');
                    gradient.addColorStop(1, 'rgba(61, 153, 109, 1)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, canvas.height / 2 - barHeight, barWidth, barHeight); // upper half
                    ctx.fillRect(x, canvas.height / 2, barWidth, barHeight); // lower half
                    x += barWidth + 1;
                }

                animationFrameRef.current = requestAnimationFrame(draw);
            }

            if (active) {
                animationFrameRef.current = requestAnimationFrame(draw);
            }
        });

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [stream, active]);

    useEffect(() => {
        if (!active && animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, [active]);

    return <canvas ref={canvasRef} className="w-full h-20" />;
};
