const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');
const { v4 } = require('uuid');
const { AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME } = require('../../config');
const generateSupabaseHeaders = require("../../service/utils/generateSupabaseHeaders")

class StorageController {
    static async uploadFile(req, res) {
        try {
            if (req.method === 'POST') {
                const form = new formidable.IncomingForm({ multiples: false });

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

                    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucketName}/${uuid}.${extension}`;

                    const formData = new FormData();
                    const fileBlob = new Blob([fileBuffer], { type: 'audio/wav' });
                    formData.append('file', fileBlob, 'filename.wav');

                    const response = await axios.post(url, formData, {
                        headers: generateSupabaseHeaders(req.accessToken, "multipart/form-data")
                    });

                    if (response.status !== 200) {
                        return res.status(500).send({ message: 'File upload failed' });
                    }

                    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uuid}.${extension}`;
                    return res.status(201).send({ publicUrl });
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
