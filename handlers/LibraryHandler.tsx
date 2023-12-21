import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Library from "@/models/Library";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";
import Story from "@/models/Story";


export default class LibraryHandler {
    static async fetchLibraries(setLibraries: any) {
        const headers = generateHeaders()
        const response = await axios.get("/api/libraries", headers)

        setLibraries(response.data.map((library: any) => new Library({
            ...library
        })))
    }

    static async createLibrary({ libraryName, listenersEmails }: { libraryName: string, listenersEmails: string[] }) {
        const payload = {}
        // @ts-ignore
        if (libraryName) payload.libraryName = libraryName
        // @ts-ignore
        if (listenersEmails) payload.listenersEmails = listenersEmails

        const headers = generateHeaders()

        const response = await axios.post("/api/libraries", payload, headers)

        return new Library({ ...response.data })
    }

    static async fetchSharedLibraries() {
        const headers = generateHeaders()
        const response = await axios.get("/api/sharedLibraries", headers)

        return response.data.map((sharedLibrary: any) => {
            return new Library({
                ...sharedLibrary
            })
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

    static async fetchStories({ libraryId }: { libraryId: string }) {
        const headers = generateHeaders()
        const response = await axios.get(`/api/libraries/${libraryId}/stories`, headers)

        return response.data.map((story: any) => new Story({
            ...story
        }))
    }

    static async addStory({ storyId, libraryId, profileId }: { storyId: string, libraryId: string, profileId: string }) {
        const headers = generateHeaders()
        await axios.post(`/api/profiles/${profileId}/libraries/${libraryId}/stories`, {
            storyId
        }, headers)

        // @ts-ignore
        return new Story({
            storyId,
            profileId
        })
    }
}
