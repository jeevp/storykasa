
interface BlogPostProps {
    title: string;
    text: string;
    id: number;
    createdAt: string;
    published: boolean;
    routeName: string;
}

export default class BlogPost {
    title: string;
    text: string;
    id: number;
    createdAt: string;
    published: boolean;
    routeName: string;


    constructor({
        id,
        createdAt,
        title,
        text,
        published,
        routeName
    }: BlogPostProps) {
        this.id = id
        this.createdAt = createdAt
        this.title = title
        this.text = text
        this.published = published
        this.routeName = routeName
    }
}
