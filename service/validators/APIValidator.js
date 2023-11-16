

class APIValidator {
    static optionalParams({ allowedParams, incomeParams }, response) {
        if (!incomeParams) return

        if (Object.keys(incomeParams).some((incomeParam) => !allowedParams.includes(incomeParam))) {
            return response.status(400).send({ message: "Params not allowed" })
        }
    }

    static generateErrorMessage(error, { response }) {
        switch(error.message) {
            case "Invalid login credentials":
                return response.status(400).send({ message: "Email or password is incorrect." })

            case "User already registered":
                return response.status(400).send({ message: "This email address is already registered." })

            default:
                return ""
        }
    }
}

module.exports = APIValidator
