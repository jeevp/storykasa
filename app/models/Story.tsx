interface StoryProps {
    title: string;
    description: string;
    recordedBy: string;
    language: string;
    ageGroup: string;
    recordingUrl: string;
    duration: number;
}

class Story implements StoryProps {
    title: string;
    description: string;
    recordedBy: string;
    language: string;
    ageGroup: string;
    recordingUrl: string;
    duration: number;

    constructor({
        title,
        description,
        recordedBy,
        language,
        ageGroup,
        recordingUrl,
        duration
    }: StoryProps) {
        this.title = title
        this.description = description
        this.recordedBy = recordedBy
        this.language = language
        this.ageGroup = ageGroup
        this.recordingUrl = recordingUrl
        this.duration = duration
    }
}

export default Story
