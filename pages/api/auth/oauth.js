import axios from "axios";

const processOauth = async (req, res) => {
    try {
        const { code } = req.body

        if (!code) {
            return res.status(400).send({ message: "Missing code" })
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token`,
            {},
            {
                params: {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: "https://app.storykasa.com",
                    client_id: "1083848522772-4rdsvcnnpsd4dc4un6ceoafhs457iaj6.apps.googleusercontent.com",
                    client_secret: "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"

                },
                headers: {
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return res.status(201).send({ message: "Authentication succeed.", data: response.data })


    } catch (error) {
        return res.status(400).send({ message: "Something went wrong." })
    }
}


export default processOauth