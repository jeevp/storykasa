import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Configure according to your needs

// Middleware to handle file upload and authentication
const uploadMiddleware = (req, res) => new Promise((resolve, reject) => {
    upload.single('file')(req, {}, (error) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
});


export default uploadMiddleware
