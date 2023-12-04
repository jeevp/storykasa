import generateHeaders from "@/handlers/generateHeaders";
import axios from "axios";

export default class HeardAboutResearchHandler {
    static async create({ sources, otherSource }: { sources: any, otherSource: any }) {
        const response = await axios.post("/api/heard-about-research", {
            sources,
            otherSource
        }, generateHeaders())

        return response.data
    }
}
