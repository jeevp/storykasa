// Import necessary packages
const formidable = require('formidable');
const fs = require('fs');  // Import the fs module
const { v4 } = require('uuid');
const supabase = require('../supabase');
const { AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME } = require('../../config');

class StorageController {
    static async uploadFile(req, res) {
        try {
            if (req.method === 'POST') {
                const form = new formidable.IncomingForm();

                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        console.error(err);
                        return res.status(400).send({ message: 'Error parsing form' });
                    }

                    const uploadDetails = JSON.parse(fields.uploadDetails);
                    const file = files.file[0];

                    const uuid = v4();
                    const allowedBucketNames = [AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME];

                    if (!allowedBucketNames.includes(uploadDetails.bucketName)) {
                        return res.status(401).send({ message: 'Bucket not found' });
                    }

                    const { bucketName, extension } = uploadDetails;

                    const fileBuffer = await fs.promises.readFile(file.filepath);

                    await supabase.storage.from(bucketName).upload(`${uuid}.${extension}`, fileBuffer, {
                        cacheControl: '3600',
                        upsert: false,
                    });

                    const publicURL = supabase.storage
                        .from(bucketName)
                        .getPublicUrl(`${uuid}.${extension}`);

                    if (!publicURL) {
                        return res.status(404).send({
                            message: "Couldn't get public url for uploaded file",
                        });
                    }

                    return res.status(201).send({
                        publicUrl: publicURL.data.publicUrl,
                    });
                });
            } else {
                res.status(405).send({ error: 'Method not allowed' });
            }
        } catch (error) {
            console.error(error);
            return res.status(400).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = StorageController;
