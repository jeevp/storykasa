interface RecordProps {
    isPublic: boolean;
    recordingURL: string;
    duration: string;
    recordedBy: string;
    title: string;
    description: string;
    language: string;
    ageGroup: string;
}

export default class Record {
    isPublic: boolean;
    recordingURL: string;
    duration: string;
    recordedBy: string;
    title: string;
    description: string;
    language: string;
    ageGroup: string;

    constructor({
        isPublic,
        recordingURL,
        duration,
        recordedBy,
        title,
        description,
        language,
        ageGroup
    }: RecordProps) {
        this.isPublic = isPublic
        this.recordingURL = recordingURL;
        this.duration = duration;
        this.recordedBy = recordedBy;
        this.title = title;
        this.description = description;
        this.language = language;
        this.ageGroup = ageGroup;
    }
}
