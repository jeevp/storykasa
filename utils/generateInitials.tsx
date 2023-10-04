export default function generateInitials(fullName: string): string {
    const nameArray = fullName.trim().split(' ');

    if (nameArray.length === 1) {
        const singleName = nameArray[0];
        if (singleName.length >= 2) {
            return singleName.slice(0, 2).toUpperCase();
        } else if (singleName.length === 1) {
            return singleName.charAt(0).toUpperCase() + singleName.charAt(0).toUpperCase();
        } else {
            throw new Error('Name must contain at least one character');
        }
    }

    else if (nameArray.length >= 2) {
        const firstNameInitial = nameArray[0].charAt(0).toUpperCase();
        const lastNameInitial = nameArray[nameArray.length - 1].charAt(0).toUpperCase();
        return `${firstNameInitial}${lastNameInitial}`;
    } else {
        throw new Error('Name must contain at least one character');
    }
}
