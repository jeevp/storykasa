

class APIValidator {
    static optionalParams({ allowedParams, incomeParams }, response) {
        if (!incomeParams) return

        if (Object.keys(incomeParams).some((incomeParam) => !allowedParams.includes(incomeParam))) {
            return response.status(400).send({ message: "Params not allowed" })
        }
    }

    static requiredParams({ req, res }, { requiredParams }) {
        const incomingParamsList = Object.keys(req.query);

        if (
            incomingParamsList.every(
                (incomingParam) => !requiredParams.includes(incomingParam)
            )
        ) {
            return res.status(400).send({ message: "Incorrect params" });
        }
    }

    static requiredPayload({ req, res }, { requiredPayload }) {
        const incomingPayloadKeys = Object.keys(req.body);

        if (
            incomingPayloadKeys.every(
                (incomingPayloadKey) => !requiredPayload.includes(incomingPayloadKey)
            )
        ) {
            return res.status(400).send({ message: "Incorrect payload" });
        }
    }

    static generateErrorMessage({ serverErrorMessage }, response) {
        switch(serverErrorMessage) {
            case "Invalid login credentials":
                return response.status(400).send({ message: "Email or password is incorrect." })

            case "User already registered":
                return response.status(400).send({ message: "This email address is already registered." })

            case "Payload is incorrect":
                return response.status(400).send({ message: "You must fill in the email and password fields." })

            default:
                return response.status(400).send({ message: "Something went wrong" })
        }
    }
}

module.exports = APIValidator
