import OpenAI from "openai";
import axios from "axios";
import FormData from 'form-data';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default class OpenAIService {
    static async createCompletion({ prompt }) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a Story maker" }, { role: "user", content: prompt }],
            model: "gpt-4-0125-preview",
            temperature: 0.2
        });

        return completion?.choices[0];
    }

    static async getTranscriptFromAudio(recordingURL) {
        try {
            const maxChunkSizeBytes = 24.5 * 1024 * 1024; // 24.5 MB in bytes to leave room for form data overhead
            const response = await axios.get(recordingURL, { responseType: 'arraybuffer' });
            const audioData = Buffer.from(response.data);

            if (audioData.length <= maxChunkSizeBytes) {
                // Process the entire audio file if it is within the size limit
                return await this.processAudioFile(audioData, 'audio.wav');
            } else {
                // Process the audio file in chunks if it exceeds the size limit
                return await this.processAudioInChunks(audioData, maxChunkSizeBytes);
            }
        } catch (error) {
            console.error("Error getting transcript:", error.response ? error.response.data : error.message);
            throw new Error("Failed to get transcript from audio.");
        }
    }

    static async processAudioFile(audioData, filename) {
        try {
            fs.writeFileSync(filename, audioData);

            const formData = new FormData();
            formData.append('file', fs.createReadStream(filename));
            formData.append('model', 'whisper-1');
            formData.append('response_format', 'verbose_json');  // Request detailed JSON response including timestamps

            const transcriptResponse = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            });

            fs.unlinkSync(filename);

            // Parse the response to extract the text with timestamps
            const transcriptData = transcriptResponse.data;
            return transcriptData.segments.map(segment => ({
                start: segment.start,
                end: segment.end,
                text: segment.text
            }));

        } catch (error) {
            console.error("Error processing audio file:", error.response ? error.response.data : error.message);
            throw new Error("Failed to process audio file.");
        }
    }

    static async processAudioInChunks(audioData, maxChunkSizeBytes) {
        const transcripts = [];
        let start = 0;
        let chunkIndex = 0;

        while (start < audioData.length) {
            const chunkEnd = Math.min(start + maxChunkSizeBytes, audioData.length);
            const chunkData = audioData.slice(start, chunkEnd);
            const chunkPath = `chunk_${chunkIndex}.wav`;

            fs.writeFileSync(chunkPath, chunkData);

            const transcript = await this.processAudioFile(chunkData, chunkPath);
            if (transcript) {
                transcripts.push(...transcript);
            }

            start = chunkEnd;
            chunkIndex += 1;
        }

        return transcripts; // Return the combined array of all segments from all chunks
    }
}
