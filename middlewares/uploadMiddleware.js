import multer from 'multer';
import os from 'os';

// Configure multer to use the /tmp directory for uploads
const tmpDir = os.tmpdir();
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, tmpDir);
    },
    filename: function(req, file, callback) {
        // Optionally, you can change the file name if needed
        callback(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({ storage: storage });

// Middleware to handle file upload
const uploadMiddleware = (req, res) => new Promise((resolve, reject) => {
    upload.single('file')(req, res, (error) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
});

export default uploadMiddleware;
