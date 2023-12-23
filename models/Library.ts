interface LibraryProps {
    libraryId: string
    accountId: string
    libraryName: string
    sharedAccountIds: string[]
    listeners: []
    totalStories: number
    totalDuration: number
}

export default class Library {
    libraryId: string
    accountId: string
    libraryName: string
    listeners: []
    sharedAccountIds: string[]
    totalStories: number
    totalDuration: number

    constructor({
        libraryId,
        accountId,
        libraryName,
        listeners = [],
        sharedAccountIds,
        totalStories,
        totalDuration
    }: LibraryProps) {
        this.libraryId = libraryId
        this.accountId = accountId
        this.libraryName = libraryName
        this.sharedAccountIds = sharedAccountIds
        this.totalStories = totalStories
        this.listeners = listeners
        this.totalDuration = totalDuration
    }
}
