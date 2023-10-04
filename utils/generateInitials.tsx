export default function generateInitials(fullName: string): string {
    // Split the full name into an array of words
    const nameArray = fullName.split(' ');

    // Check if the nameArray has at least two elements
    if (nameArray.length < 2) {
        throw new Error('Full name must contain at least first and last name');
    }

    // Get the first character of the first name
    const firstNameInitial = nameArray[0].charAt(0).toUpperCase();

    // Get the first character of the last name
    const lastNameInitial = nameArray[nameArray.length - 1].charAt(0).toUpperCase();

    // Combine and return the initials
    return `${firstNameInitial}${lastNameInitial}`;
}
