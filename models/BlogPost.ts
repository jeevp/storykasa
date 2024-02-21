
interface BlogPostProps {
    title: string;
    text: string;
    id: number;
    createdAt: string;
    published: boolean;
}

export default class BlogPost {
    title: string;
    text: string;
    id: number;
    createdAt: string;
    published: boolean;


    constructor({
        id,
        createdAt,
        title,
        text,
        published
    }: BlogPostProps) {
        this.id = id
        this.createdAt = createdAt
        this.title = title
        this.text = text
        this.published = published
    }
}
