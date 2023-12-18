interface SharedLibraryInvitationProps {
    id: number
    libraryId: string
    userEmail: string
    accept: boolean
    complete: boolean
}

export default class SharedLibraryInvitation {
    id: number
    libraryId: string
    userEmail: string
    accept: boolean
    complete: boolean

    constructor({
        id,
        libraryId,
        userEmail,
        accept,
        complete
    }: SharedLibraryInvitationProps) {
        this.id = id
        this.libraryId = libraryId
        this.userEmail = userEmail
        this.accept = accept
        this.complete = complete
    }
}
