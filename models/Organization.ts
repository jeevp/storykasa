interface OrganizationProps {
    id: string
    name: string
}

export default class Library {
    id: string
    name: string

    constructor({ id, name }: OrganizationProps) {
        this.id = id
        this.name = name
    }
}
