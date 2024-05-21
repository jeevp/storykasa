import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Library from "@/models/Library";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";
import Story from "@/models/Story";


export default class LibraryHandler {
    static async fetchLibraries(setLibraries: any) {
        const headers = generateHeaders()
        const response = await axios.get("/api/libraries?includeShared=1", headers)

        setLibraries(response.data.map((library: any) => new Library({
            ...library
        })))
    }

    static async removeListener(
        { profileId, libraryId }: { profileId: string, libraryId: string },
        { listenerAccountId }: { listenerAccountId: string },
    ) {
        const headers = generateHeaders()
        const response = await axios.delete(
            `/api/profiles/${profileId}/libraries/${libraryId}/listeners/${listenerAccountId}`,
            headers
        )


        return response.data
    }

    static async fetchLibraryDetails(
        { profileId, libraryId }: { profileId: string, libraryId: string },
        {setCurrentLibrary}: {setCurrentLibrary: (library: Library) => void}
    ) {
        const headers = generateHeaders()
        const response = await axios.get(
            `/api/profiles/${profileId}/libraries/${libraryId}`,
            headers
        )

        const library = new Library({
            ...response.data
        })

        setCurrentLibrary(library)
    }

    static async updateLibrary({ profileId, libraryId }: { profileId: string, libraryId: string }, { libraryName }: { libraryName: string }) {
        const headers = generateHeaders()
        const payload = { libraryName }
        const response = await axios.put(
            `/api/profiles/${profileId}/libraries/${libraryId}`,
            payload,
            headers
        )

        return new Library({
            ...response.data
        })
    }

    static async createLibrary({ libraryName, listenersEmails, profileId }: { libraryName: string, listenersEmails: string[], profileId: string }) {
        const payload = {}
        // @ts-ignore
        if (libraryName) payload.libraryName = libraryName
        // @ts-ignore
        if (listenersEmails) payload.listenersEmails = listenersEmails
        // @ts-ignore
        if (profileId) payload.profileId = profileId

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
        listenersEmails,
        profileId
    }: { listenersEmails: string[], profileId: string }) {
        const headers = generateHeaders()
        const response = await axios.post(`/api/libraries/${libraryId}/listeners`, {
            listenersEmails,
            profileId
        }, headers)

        return response.data
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

    static async removeStory({ storyId, libraryId, profileId }: { storyId: string, libraryId: string, profileId: string }) {
        const headers = generateHeaders()

        await axios.delete(`/api/profiles/${profileId}/libraries/${libraryId}/stories/${storyId}`, headers)

        // @ts-ignore
        return new Story({
            storyId,
            profileId
        })
    }

    static async deleteLibrary({ profileId, libraryId }: { profileId: string, libraryId: string }) {
        const headers = generateHeaders()

        await axios.delete(`/api/profiles/${profileId}/libraries/${libraryId}`, headers)
    }
}
