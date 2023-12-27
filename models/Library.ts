interface LibraryProps {
    libraryId: string
    accountId: string
    profileId: string
    libraryName: string
    sharedAccountIds: string[]
    listeners: []
    totalStories: number
    totalDuration: number
    profile: {}
}

export default class Library {
    libraryId: string
    profileId: string
    accountId: string
    libraryName: string
    listeners: []
    sharedAccountIds: string[]
    totalStories: number
    totalDuration: number
    profile: {}

    constructor({
        libraryId,
        accountId,
        profileId,
        libraryName,
        listeners = [],
        sharedAccountIds,
        totalStories = 0,
        totalDuration = 0,
        profile
    }: LibraryProps) {
        this.libraryId = libraryId
        this.accountId = accountId
        this.libraryName = libraryName
        this.sharedAccountIds = sharedAccountIds
        this.totalStories = totalStories
        this.listeners = listeners
        this.totalDuration = totalDuration
        this.profileId = profileId
        this.profile = profile
    }
}
