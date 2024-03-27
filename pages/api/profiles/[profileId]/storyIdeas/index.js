// Import your middleware and controller
import authMiddleware from "../../../../../middlewares/authMiddleware";
import StoryIdeaController from "../../../../../service/controllers/StoryIdeaController";

// Export the maxDuration at the top level
export const config = {
    api: {
        maxDuration: 80
    },
};

// Define your API route logic
const generateStoryIdea = async (req, res) => {
    try {
        if (!["POST", "GET"].includes(req.method)) return res.status(400).send({ message: "Endpoint doesn't exist" });

        if (req.method === "POST") return StoryIdeaController.createStoryIdea(req, res);

        if (req.method === "GET") return StoryIdeaController.getStoryIdeas(req, res)
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Something went wrong" });
    }
};

// Wrap your function with the middleware and export it
export default authMiddleware(generateStoryIdea);
