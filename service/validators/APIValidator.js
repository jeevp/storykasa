

class APIValidator {
    static optionalParams({ allowedParams, incomeParams }, response) {
        if (!incomeParams) return

        if (Object.keys(incomeParams).some((incomeParam) => !allowedParams.includes(incomeParam))) {
            return response.status(400).send({ message: "Params not allowed" })
        }
    }
}

module.exports = APIValidator
