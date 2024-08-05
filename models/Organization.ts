interface OrganizationProps {
    id: string
    name: string
    accountOwner?: { accountId?: string, name?: string, email?: string }
}

export default class Library {
    id: string
    name: string
    accountOwner?: { accountId?: string, name?: string, email?: string }

    constructor({ id, name, accountOwner }: OrganizationProps) {
        this.id = id
        this.name = name
        this.accountOwner = accountOwner
    }
}
