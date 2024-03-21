import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default class OpenAIService {
    static async createCompletion({ prompt }){
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a Story maker" }, { role: "user", content: prompt }],
            model: "gpt-4-0125-preview"
        })

        return completion?.choices[0]
    }
}
