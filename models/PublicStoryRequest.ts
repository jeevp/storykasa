import Story from "@/models/Story";
import Profile from "@/models/Profile"

interface PublicStoryRequestProps {
    id: boolean
    createdAt: string
    storyId: string
    approved: boolean
    completed: boolean
    profileId: string,
    story: Story
    profile: Profile
}


export default class PublicStoryRequest {
    id: boolean
    storyId: string
    approved: boolean
    completed: boolean
    profileId: string
    story: Story
    profile: Profile
    createdAt: string

    constructor({
        id,
        storyId,
        approved,
        completed,
        profileId,
        story,
        profile,
        createdAt
    }: PublicStoryRequestProps) {
        this.id = id
        this.storyId = storyId
        this.approved = approved
        this.completed = completed
        this.profileId = profileId
        this.story = story
        this.profile = profile
        this.createdAt = createdAt
    }
}

