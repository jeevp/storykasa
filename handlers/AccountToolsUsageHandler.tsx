import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";

export default class AccountToolsUsageHandler {
    static async fetchAccountToolsUsage() {
        const headers = generateHeaders()

        const response = await axios.get("/api/accountToolsUsage", headers)

        return response.data
    }
}
