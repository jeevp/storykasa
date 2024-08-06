interface OrganizationProps {
    id: number
    name: string
    accountOwner?: { accountId?: string, name?: string, email?: string }
    accountId?: string
}

export default class Library {
    id: number
    name: string
    accountOwner?: { accountId?: string, name?: string, email?: string }
    accountId?: string

    constructor({ id, name, accountOwner, accountId }: OrganizationProps) {
        this.id = id
        this.name = name
        this.accountOwner = accountOwner
        this.accountId = accountId
    }
}
