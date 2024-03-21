// Import your middleware and controller
import authMiddleware from "../../../middlewares/authMiddleware";
import StoryController from "../../../service/controllers/StoryController";

// Export the maxDuration at the top level
export const config = {
    api: {
        maxDuration: 80
    },
};

// Define your API route logic
const generateStoryIdeas = async (req, res) => {
    try {
        if (req.method !== "POST") return res.status(400).send({ message: "Endpoint doesn't exist" });
        return StoryController.generateStoryIdeas(req, res);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Something went wrong" });
    }
};

// Wrap your function with the middleware and export it
export default authMiddleware(generateStoryIdeas);
