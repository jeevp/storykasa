const {v4 } = require("uuid")
const supabase = require("../supabase")

class StorageController {
    static async uploadFile(req, res) {
        try {
            if (!req.file) return res.status(400).send({ message: "Missing file" })

            const uuid = v4()

            await supabase.storage.from('storykasa-avatars').upload(`${uuid}.webp`, req.file, {
                cacheControl: '3600',
                upsert: false,
            })

            const publicURL = supabase.storage
                .from('storykasa-avatars')
                .getPublicUrl(`${uuid}.webp`)

            if (!publicURL){
                return res.status(404).send({
                    message: "Couldn't get public url for avatar"
                })
            }

            return res.status(201).send({
                publicUrl: publicURL.data.publicUrl
            })

        } catch (error) {
            return res.status(400).send({ message: "Something went wrong" })
        }
    }
}

module.exports = StorageController
