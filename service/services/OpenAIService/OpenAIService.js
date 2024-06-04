import OpenAI from "openai";
import axios from "axios"
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
import FormData from 'form-data';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
export default class OpenAIService {
    static async createCompletion({ prompt }){
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a Story maker" }, { role: "user", content: prompt }],
            model: "gpt-4-0125-preview",
            temperature: 0.2
        })

        return completion?.choices[0]
    }

    static async getTranscriptFromAudio(recordingURL) {
        try {
            // Fetch the audio data
            const response = await axios.get(recordingURL, { responseType: 'arraybuffer' });
            const audioData = Buffer.from(response.data);
            const maxChunkSizeBytes = 25 * 1024 * 1024; // 25 MB in bytes
            const minChunkDuration = 0.1; // Minimum duration in seconds
            const transcripts = [];
            const chunkDuration = 20; // Reduce chunk duration to 20 seconds

            // Helper function to chunk and process the audio
            const chunkAudio = (buffer, start, duration) => {
                return new Promise((resolve, reject) => {
                    const chunkStream = new Readable();
                    chunkStream.push(buffer);
                    chunkStream.push(null);

                    const chunkPath = `chunk_${start}.wav`;

                    ffmpeg(chunkStream)
                        .setStartTime(start)
                        .setDuration(duration)
                        .output(chunkPath)
                        .toFormat('wav')
                        .on('end', async () => {
                            try {
                                // Verify the chunk file was created
                                if (!fs.existsSync(chunkPath)) {
                                    reject(new Error(`Chunk file ${chunkPath} not found`));
                                    return;
                                }

                                // Check the size of the created chunk file
                                const stats = fs.statSync(chunkPath);
                                console.log(`Chunk file ${chunkPath} size: ${stats.size} bytes`);
                                if (stats.size > maxChunkSizeBytes) {
                                    reject(new Error(`Chunk file ${chunkPath} exceeds maximum size limit`));
                                    return;
                                }

                                // Check the duration of the chunk file
                                ffmpeg.ffprobe(chunkPath, (err, metadata) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }

                                    const chunkDuration = metadata.format.duration;
                                    console.log(`Chunk file ${chunkPath} duration: ${chunkDuration} seconds`);

                                    if (isNaN(chunkDuration) || chunkDuration < minChunkDuration) {
                                        console.log(`Skipping chunk ${chunkPath} with duration ${chunkDuration} seconds (invalid or too short)`);
                                        fs.unlinkSync(chunkPath); // Clean up the chunk file
                                        resolve(''); // Return an empty string for invalid or too short chunks
                                        return;
                                    }

                                    const formData = new FormData();
                                    formData.append('file', fs.createReadStream(chunkPath));
                                    formData.append('model', 'whisper-1');
                                    formData.append('response_format', 'text');

                                    axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
                                        headers: {
                                            ...formData.getHeaders(),
                                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                                        }
                                    }).then((transcriptResponse) => {
                                        fs.unlinkSync(chunkPath); // Clean up the chunk file
                                        resolve(transcriptResponse.data);
                                    }).catch((error) => {
                                        console.error('Error in transcription request:', error.response ? error.response.data : error.message);
                                        reject(error);
                                    });
                                });
                            } catch (error) {
                                console.error('Error in transcription process:', error);
                                reject(error);
                            }
                        })
                        .on('error', (err) => {
                            console.error('Error processing audio chunk:', err);
                            reject(err);
                        })
                        .run();
                });
            };

            // Calculate the total duration of the audio in seconds
            const totalDuration = 1262; // Assume total duration based on your logs, replace with actual calculation if possible

            // Loop through and process each chunk, skip invalid chunks
            for (let start = 0; start < totalDuration; start += chunkDuration) {
                const duration = Math.min(chunkDuration, totalDuration - start);

                // Skip final short chunk if too short
                if (duration < minChunkDuration) {
                    console.log(`Skipping final short chunk from ${start} with duration ${duration} seconds (too short)`);
                    continue;
                }

                console.log(`Processing chunk from ${start} to ${start + duration} seconds`);
                const transcript = await chunkAudio(audioData, start, duration);
                if (transcript) {
                    transcripts.push(transcript);
                }
            }

            return transcripts.join(' ');
        } catch (error) {
            console.error("Error getting transcript:", error.response ? error.response.data : error.message);
            throw new Error("Failed to get transcript from audio.");
        }
    }
}
