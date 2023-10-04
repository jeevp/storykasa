const {v4 } = require("uuid")
const supabase = require("../supabase")
const {AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME} = require("../../config");

class StorageController {
    static async uploadFile(req, res) {
        try {
            if (!req.file || !req.body.uploadDetails) return res.status(400).send({ message: "Missing file or file is incomplete" })

            const uuid = v4()

            const allowedBucketNames = [AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME]
            if (!allowedBucketNames.includes(req.uploadDetails.bucketName)) {
                return res.status(401).send({ message: "Bucket not found" })
            }

            const {
                bucketName,
                extension
            } = req.body.uploadDetails
            await supabase.storage.from(bucketName).upload(`${uuid}.${extension}`, req.file, {
                cacheControl: '3600',
                upsert: false,
            })

            const publicURL = supabase.storage
                .from(bucketName)
                .getPublicUrl(`${uuid}.${extension}`)

            if (!publicURL){
                return res.status(404).send({
                    message: "Couldn't get public url for uploaded file"
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
