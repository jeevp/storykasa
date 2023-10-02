import axios from "axios";

export default class StorageHandler {
    static async uploadFile(file: FormData) {
        if (!file) throw new Error('unable to get new avatar file')

        const response = await axios.post("/api/storage/files", file, {
            headers: {
                "access-token": localStorage.getItem("STK_ACCESS_TOKEN")
            }
        })

        return response.data.publicUrl
    }
}
