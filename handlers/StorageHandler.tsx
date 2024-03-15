import axios from "axios";
import {
    AVATAR_BUCKET_NAME,
    AVATAR_FILE_EXTENSION,
    RECORD_BUCKET_NAME,
    RECORD_FILE_EXTENSION,
    ILLUSTRATIONS_BUCKET_NAME,
    PNG_FILE_EXTENSION,
    MPEG_FILE_EXTENSION,
    STK_ACCESS_TOKEN
} from "@/config";
import {v4} from "uuid";
import generateSupabaseHeaders from "@/service/utils/generateSupabaseHeaders";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export default class StorageHandler {

    static async uploadFile(formData: FormData) {
       try {
           if (!formData) throw new Error('unable to get new avatar file')

           const uploadDetailsString = formData.get("uploadDetails");
           if (!uploadDetailsString) throw new Error('uploadDetails not found');

           const uploadDetails = JSON.parse(uploadDetailsString as string);

           const allowedBucketNames = [
               AVATAR_BUCKET_NAME,
               RECORD_BUCKET_NAME,
               ILLUSTRATIONS_BUCKET_NAME
           ];

           if (!allowedBucketNames.includes(uploadDetails.bucketName)) {
               throw new Error("Bucket not allowed");
           }

           const allowedExtensions = [
               AVATAR_FILE_EXTENSION,
               RECORD_FILE_EXTENSION,
               MPEG_FILE_EXTENSION,
               PNG_FILE_EXTENSION
           ];

           if (!allowedExtensions.includes(uploadDetails.extension)) {
               throw new Error("File extension not allowed");
           }

           const file = formData.get("file")
           // Check if the file size exceeds the maximum allowed size
           // @ts-ignore
           if (file?.size > MAX_FILE_SIZE) {
               throw new Error("File size exceeds the maximum allowed size");
           }

           let fileExtension = "webm";

           // @ts-ignore
           if (file.type === "audio/mp3" || file.type === "audio/mpeg") {
               fileExtension = "mp3";
           // @ts-ignore
           } else if (file.type.startsWith("audio/")) {
           // @ts-ignore
               fileExtension = file.type.split("/")[1].split(";")[0];
           }

           const uuid = v4();
           const { bucketName, extension } = JSON.parse(formData.get("uploadDetails") as string);

           // The URL to which you will send the file upload request
           const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucketName}/${uuid}.${fileExtension}`;

           // Sending the upload request using axios
           const response = await axios.post(url, formData, {
               headers: generateSupabaseHeaders({
                   contentType: "multipart/form-data"
               }, {
                   // @ts-ignore
                   accessToken: localStorage.getItem(STK_ACCESS_TOKEN)
               })
           });

           if (response.status !== 200) {
               throw new Error("File upload failed");
           }

           return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uuid}.${fileExtension}`;
       } catch (error) {
           console.error(error)
           throw new Error("Something went wrong")
       }
    }
}
