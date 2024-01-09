
interface AccountProps {
    accountId: string;
    createdAt: string;
    name: string;
    username: string
    avatarUrl: string
}

export default class Account {
    accountId: string;
    createdAt: string;
    name: string;
    username: string
    avatarUrl: string

    constructor({
        accountId,
        createdAt,
        name,
        username,
        avatarUrl
    }: AccountProps) {
        this.accountId = accountId
        this.createdAt = createdAt
        this.name = name
        this.username = username
        this.avatarUrl = avatarUrl
    }
}
