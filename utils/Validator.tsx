export default class Validator {
    static isEmailValid(email: string){
        const isEmail = require('validator/es/lib/isEmail').default
        return isEmail(email)
    }

    static isPasswordValid(password: string) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasMinimumLength = password.length >= 8;

        return hasUpperCase && hasLowerCase && hasNumber && hasMinimumLength;
    }

    static isFullNameValid(fullName: string) {
        const nameParts = fullName.trim().split(/\s+/);
        if (nameParts.length < 2) {
            return false;
        }

        const firstName = nameParts[0];
        const lastName = nameParts[1];

        const firstNameIsValid = firstName.length >= 2;
        const lastNameIsValid = lastName.length >= 2;

        return firstNameIsValid && lastNameIsValid;
    }
}
