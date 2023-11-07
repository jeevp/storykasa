
export const MAX_PROFILES_ALLOWED = 5

interface ProfileProps {
    profileName: boolean;
    profileId: string;
    avatarUrl: string;
}

export default class Profile {
    profileName: boolean;
    profileId: string;
    avatarUrl: string;

    constructor({
        profileName,
        profileId,
        avatarUrl
    }: ProfileProps) {
        this.profileName = profileName
        this.profileId = profileId;
        this.avatarUrl = avatarUrl;
    }
}
