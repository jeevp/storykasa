import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

async function convertAudioToMp3(inputBlob) {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    // Simplified extension detection based on MIME type
    let extension = inputBlob.type.split('/')[1];
    if (extension === 'mpeg') extension = 'mp3'; // Adjust for common cases, e.g., "audio/mpeg" to "mp3"

    // Convert extensions for formats that FFmpeg might not recognize directly from MIME types
    switch (extension) {
        case 'webm':
            extension = 'webm';
            break;
        case 'mp4':
        case 'mp4a':
            extension = 'mp4';
            break;
        // Add more cases as needed based on the file types you encounter
        default:
            // This is a simplistic fallback. For better handling, consider more specific mappings.
            extension = 'wav';
            break;
    }

    const inputFilename = `input.${extension}`;
    const outputFilename = 'output.mp3';

    await ffmpeg.writeFile(inputFilename, await fetchFile(inputBlob));
    await ffmpeg.exec(['-i', inputFilename, '-b:a', '128k', outputFilename]);
    const mp3Data = await ffmpeg.readFile(outputFilename);

    return new Blob([mp3Data.buffer], {type: 'audio/mp3'});
}

export default convertAudioToMp3;
