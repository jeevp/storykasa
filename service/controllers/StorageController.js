const {v4 } = require("uuid")
const supabase = require("../supabase")
const {AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME} = require("../../config");

class StorageController {
    static async uploadFile(req, res) {
        try {
            if (!req.file || !req.body.uploadDetails)
                return res.status(400).send({ message: "Missing file or file is incomplete" });

            // Parse uploadDetails from JSON string to object
            const uploadDetails = JSON.parse(req.body.uploadDetails);

            const uuid = v4();

            const allowedBucketNames = [AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME];

            if (!allowedBucketNames.includes(uploadDetails.bucketName)) {
                return res.status(401).send({ message: "Bucket not found" });
            }

            // Destructure bucketName and extension from uploadDetails object
            const { bucketName, extension } = uploadDetails;

            await supabase.storage.from(bucketName).upload(`${uuid}.${extension}`, req.file.buffer, {
                cacheControl: '3600',
                upsert: false,
            });

            const publicURL = supabase.storage
                .from(bucketName)
                .getPublicUrl(`${uuid}.${extension}`);

            if (!publicURL) {
                return res.status(404).send({
                    message: "Couldn't get public url for uploaded file"
                });
            }

            return res.status(201).send({
                publicUrl: publicURL.data.publicUrl  // Assuming publicUrl is an object with a data property
            });

        } catch (error) {
            console.error(error);
            return res.status(400).send({ message: "Something went wrong" });
        }
    }
}

module.exports = StorageController
