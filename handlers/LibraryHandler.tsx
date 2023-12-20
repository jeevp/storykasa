import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Library from "@/models/Library";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";


export default class LibraryHandler {
    static async fetchLibraries() {
        const headers = generateHeaders()
        const response = await axios.get("/api/libraries", headers)

        return response.data.map((library: any) => new Library({
            ...library
        }))
    }

    static async createLibrary({ libraryName, listenersEmails }: { libraryName: string, listenersEmails: string[] }) {
        const payload = {}
        if (libraryName) payload.libraryName = libraryName
        if (listenersEmails) payload.listenersEmails = listenersEmails

        const headers = generateHeaders()

        const response = await axios.post("/api/libraries", payload, headers)

        return new Library({ ...response.data })
    }

    static async fetchSharedLibraries() {
        const headers = generateHeaders()
        const response = await axios.get("/api/sharedLibraries", headers)

        return response.data.map((sharedLibrary: any) => {
            return {
                sharedLibraryInvitation: new SharedLibraryInvitation({
                    id: sharedLibrary.id,
                    libraryId: sharedLibrary.libraryId,
                    userEmail: sharedLibrary.userEmail,
                    accept: sharedLibrary.accept,
                    complete: sharedLibrary.complete
                }),
                library: new Library({
                    ...sharedLibrary.library
                })
            }
        })
    }

    static async addListenerToLibrary({ libraryId }: { libraryId: string }, {
        listenersEmails
    }: { listenersEmails: string[] }) {
        const headers = generateHeaders()
        const response = await axios.post(`/api/libraries/${libraryId}/listeners`, {
            listenersEmails
        }, headers)

        return new Library({
            ...response.data
        })
    }
}
