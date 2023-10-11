import axios from "axios";
import {
    AVATAR_BUCKET_NAME,
    AVATAR_FILE_EXTENSION,
    RECORD_BUCKET_NAME,
    RECORD_FILE_EXTENSION,
    MPEG_FILE_EXTENSION
} from "@/config";
import generateHeaders from "@/handlers/generateHeaders";

export default class StorageHandler {
    static async uploadFile(formData: FormData) {
        if (!formData) throw new Error('unable to get new avatar file')

        const uploadDetailsString = formData.get("uploadDetails");
        if (!uploadDetailsString) throw new Error('uploadDetails not found');

        const uploadDetails = JSON.parse(uploadDetailsString as string);

        const allowedBucketNames = [AVATAR_BUCKET_NAME, RECORD_BUCKET_NAME];
        if (!allowedBucketNames.includes(uploadDetails.bucketName)) {
            throw new Error("Bucket not allowed");
        }

        const allowedExtensions = [AVATAR_FILE_EXTENSION, RECORD_FILE_EXTENSION, MPEG_FILE_EXTENSION];
        if (!allowedExtensions.includes(uploadDetails.extension)) {
            throw new Error("File extension not allowed");
        }

        const headers = generateHeaders();
        const response = await axios.post("/api/storage/files", formData, headers)

        return response.data.publicUrl;
    }

}
