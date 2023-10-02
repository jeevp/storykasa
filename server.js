require('dotenv').config();
const express = require('express')
const next = require("next")
const {authMiddleware} = require("./service/middleware");
const UserController = require("./service/controllers/UserController");
const AuthController = require("./service/controllers/AuthController");
const StoryController = require("./service/controllers/StoryController").default;
const ProfileController = require("./service/controllers/ProfileController")
const StorageController = require("./service/controllers/StorageController")

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10000000,
    },
});

app.prepare().then(() => {
    const server = express();

    // Enable JSON body parsing for Express
    server.use(express.json());

    // Define your custom API routes
    // Stories
    server.delete('/api/stories/:storyId', authMiddleware, StoryController.deleteStory)
    server.get("/api/stories", authMiddleware,  StoryController.getStories)

    // Profiles
    server.get("/api/profiles", authMiddleware, ProfileController.getProfiles)
    server.post("/api/profiles", authMiddleware, ProfileController.updateProfile)
    server.put("/api/profiles/:profileId", authMiddleware, ProfileController.updateProfile)

    // Auth
    server.post("/api/auth/signIn", AuthController.signInWithPassword)

    // Storage
    server.post(
        "/api/storage/files",
        [authMiddleware, upload.single('file')],
        StorageController.uploadFile)


    // Default route to handle Next.js pages
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
