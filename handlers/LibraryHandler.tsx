import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Library from "@/models/Library";


export default class LibraryHandler {
    static async fetchSharedLibraries() {
        const headers = generateHeaders()
        const response = await axios.get("/api/libraries", headers)

        return response.data.map((library: any) => new Library({
            ...library
        }))
    }

    static async createSharedLibrary({ libraryName, listenersEmails }: { libraryName: string, listenersEmails: string[] }) {
        const payload = {}
        if (libraryName) payload.libraryName = libraryName
        if (listenersEmails) payload.listenersEmails = listenersEmails

        const headers = generateHeaders()

        const response = await axios.post("/api/libraries", payload, headers)

        return new Library({ ...response.data })
    }
}
