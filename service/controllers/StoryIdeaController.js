const supabase = require('../../service/supabase');
const APIValidator = require("../validators/APIValidator");
const OpenAIService = require("../services/OpenAIService/OpenAIService").default
const StoryIdea = require("../models/StoryIdea")
const StoryIdeaCharacter = require("../models/StoryIdeaCharacter")
const AccountToolsUsage = require("../models/AccountToolsUsage")
const {MONTHLY_STORY_IDEAS_ALLOWED} = require("../models/AccountToolsUsage")

class StoryIdeaController {
    static async createStoryIdea(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["profileId"]
            })

            APIValidator.requiredPayload({ req, res }, {
                requiredPayload: ["isFictional", "language", "ageGroups", "description", "ageGroupsLabel"]
            })

            const { isFictional, ageGroups, description, ageGroupsLabel } = req.body
            const { profileId } = req.query

            const { data: { user } } = await supabase.auth.getUser(req.accessToken)

            if (!user) return res.status(401).send({ message: "Not allowed" })

            const accountToolsUsage = await AccountToolsUsage.findOne({
                accountId: user.id
            })

            if (!accountToolsUsage) {
                return res.status(400).send({ message: "Missing tools usage configuration" })
            }

            if (accountToolsUsage.currentMonthTotalStoryIdeas >= MONTHLY_STORY_IDEAS_ALLOWED) {
                return res.status(401).send({ message: "AI Story idea generator usage has reached it's limit" })
            }

            function generateRandomString(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            let prompt = ""

            if (isFictional) {
                prompt = `Generate a ${isFictional ? 'fictional' : 'real-life'} story idea in English. 
                    Describe a unique setting where the story is taking place in 280 characters. 
                    Introduce three main characters with distinct names and descriptions in 525 characters.
                    Provide a title in 50 characters that includes specific keywords/themes and is unique and should some of following letters "${generateRandomString(10)}".
                    Give the first line of the story in 210 characters.
                    The story should revolve around ${description} and be suitable for ${ageGroupsLabel}. 
                    Format the response as an object with id:guid, title:string, setting:string, characters:array of objects(name:string, description:string)  and firstLine:string.
                    Ensure each aspect of the prompt adds uniqueness and specificity to the story idea.
                `
            } else {
                prompt = `
                     I want to tell a true story about ${description} and the story is 
                     for an audience of ${ageGroupsLabel}. Could you provide me with some ideas for how to get 
                     started, not the actual story? Format the response as an object with id:guid, title:string, creationStepsDescription:string. Make sure the creationStepsDescription string is formatted with bullet points.
                `
            }


            const response = await OpenAIService.createCompletion({ prompt })
            let data = response.message.content

            data = data.replace(/```json\n|\n```|\n/g, '');
            const generatedStoryIdea = JSON.parse(data);

            await accountToolsUsage.update({
                currentMonthTotalStoryIdeas: accountToolsUsage.currentMonthTotalStoryIdeas + 1,
                totalStoryIdeas: accountToolsUsage.totalStoryIdeas + 1
            })

            const storyIdea = await StoryIdea.create({
                title: generatedStoryIdea.title,
                description: generatedStoryIdea.description || "",
                setting: generatedStoryIdea.setting || "",
                firstLine: generatedStoryIdea.firstLine || "",
                creationStepsDescription: generatedStoryIdea.creationStepsDescription || "",
                isFictional,
                accountId: user.id,
                profileId,
                ageGroups,
                language: "English",
                prompt: description
            })

            const storyIdeaCharacters = []
            if (generatedStoryIdea?.characters?.length > 0) {
                await Promise.all(generatedStoryIdea.characters.map(async(character) => {
                    const storyIdeaCharacter = await StoryIdeaCharacter.create({
                        storyIdeaId: storyIdea?.id,
                        name: character?.name || "",
                        description: character?.description || ""
                    })

                    storyIdeaCharacters.push(storyIdeaCharacter)
                }))
            }

            return res.status(201).send({
                ...storyIdea,
                characters: storyIdeaCharacters
            })
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong" })
        }
    }

    static async getStoryIdeas(req, res) {
        try {
            APIValidator.requiredParams({ req, res }, {
                requiredParams: ["profileId"]
            })

            const { profileId, page } = req.query

            const {data: { user }} = await supabase.auth.getUser(req.accessToken)

            const storyIdeas = await StoryIdea.findAll({
                accountId: user.id,
                profileId
            }, { serialized: true, page })

            return res.status(200).send(storyIdeas)
        } catch (error) {
            console.error(error)
            return res.status(400).send({ message: "Something went wrong." })
        }
    }
}


module.exports = StoryIdeaController
