import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

async function convertWavToMp3(wavBlob) {
    const ffmpeg = new FFmpeg()
    await ffmpeg.load();
    await ffmpeg.writeFile("input.wav", await fetchFile(wavBlob))

    await ffmpeg.exec(['-i', 'input.wav', '-b:a', '128k', 'output.mp3']);

    const mp3Data = await ffmpeg.readFile('output.mp3');
    return new Blob([mp3Data.buffer], {type: 'audio/mp3'});
}

export default convertWavToMp3
