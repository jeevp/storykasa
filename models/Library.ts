interface LibraryProps {
    libraryId: string
    accountId: string
    libraryName: string
    sharedAccountIds: string[]
    listeners: []
    totalStories: number
}

export default class Library {
    libraryId: string
    accountId: string
    libraryName: string
    listeners: []
    sharedAccountIds: string[]
    totalStories: number

    constructor({
        libraryId,
        accountId,
        libraryName,
        listeners = [],
        sharedAccountIds,
        totalStories
    }: LibraryProps) {
        this.libraryId = libraryId
        this.accountId = accountId
        this.libraryName = libraryName
        this.sharedAccountIds = sharedAccountIds
        this.totalStories = totalStories
        this.listeners = listeners
    }
}
