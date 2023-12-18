import axios from "axios"
import generateHeaders from "@/handlers/generateHeaders";
import Library from "@/models/Library";
import SharedLibraryInvitation from "@/models/SharedLibraryInvitation";


export default class SharedLibraryInvitationHandler {
    static async updateSharedLibraryInvitation({ sharedLibraryInvitationId }: {
        sharedLibraryInvitationId: number
    }, { accept }: {
        accept: boolean
    }) {
        const headers = generateHeaders()
        const response = await axios.put(`/api/sharedLibraryInvitations/${sharedLibraryInvitationId}`, {
            accept
        }, headers)

        return new SharedLibraryInvitation({
            ...response.data
        })
    }

    static async fetchSharedLibraryInvitations() {
        const headers = generateHeaders()
        const response = await axios.get("/api/sharedLibraryInvitations", headers)

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
}
