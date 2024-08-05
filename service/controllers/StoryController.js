import DecodeJWT from "../../utils/decodeJWT";
const supabase = require("../../service/supabase");
const axios = require("axios");
const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders");
const APIValidator = require("../validators/APIValidator");
const LibraryStory = require("../models/LibraryStory");
const PublicStoryRequest = require("../models/PublicStoryRequest");
const convertArrayToHash = require("../../utils/convertArrayToHash");
const { allowedAdminUsers } = require("../config");
import Story from "../models/Story";
import OpenAIService from "../services/OpenAIService/OpenAIService";
import { MONTHLY_STORY_IDEAS_ALLOWED } from "../models/AccountToolsUsage";

const applyAlphabeticalOrder = require("../../utils/applyAlphabeticalOrder");
const Library = require("../models/Library");
const SubscriptionValidator = require("../validators/SubscriptionValidator");
const Subscription = require("../models/Subscription");
const Account = require("../models/Account");
const AccountToolsUsage = require("../models/AccountToolsUsage");

class StoryController {
  static async deleteStory(req, res) {
    try {
      const { storyId } = req.query;

      const response = await axios.patch(
        `${process.env.SUPABASE_URL}/rest/v1/stories`,
        {
          deleted: true,
        },
        {
          params: {
            story_id: `eq.${storyId}`,
          },
          headers: generateSupabaseHeaders(),
        }
      );

      await Library.deleteStoryFromLibraries(storyId);

      return res.status(204).send(response.data);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async updateStory(req, res) {
    try {
      const { storyId } = req.query;
      const {
        title,
        description,
        narratorName,
        recordingURL,
        duration,
        language,
        ageGroups,
        illustrationsURL,
        finished,
      } = req.body;

      if (
        !title &&
        !description &&
        !narratorName &&
        !recordingURL &&
        !duration &&
        !language &&
        !ageGroups &&
        !illustrationsURL &&
        !finished
      ) {
        return res.status(400).send({
          message: "Payload is missing",
        });
      }

      const story = await Story.getStory(storyId);

      if (!story) {
        return res.status(404).send({ message: "Story not found" });
      }

      let transcript = story.transcript;

      const updatedStory = await story.update({
        title,
        description,
        narratorName,
        recordingURL,
        duration,
        language,
        ageGroups,
        illustrationsURL,
        finished,
        transcript,
      });

      return res.status(202).send(updatedStory);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getLibraryStories(req, res) {
    try {
      APIValidator.requiredParams({ req, res }, { requiredParams: ["profileId"] });

      APIValidator.optionalParams(
        {
          allowedParams: [
            "narrator",
            "language",
            "ageGroups[]",
            "storyLengths[]",
            "profileId",
          ],
          incomeParams: req.query,
        },
        res
      );

      const { narrator, language, profileId } = req.query;

      const ageGroups = req.query["ageGroups[]"];
      const storyLengths = req.query["storyLengths[]"];

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      const library = await Library.findDefaultLibrary({
        accountId: user.id,
      });

      const privateStories = await Story.getStories(
        {
          narrator,
          language,
          ageGroups,
          storyLengths,
          private: true,
          finished: true,
        },
        {
          userId: user.id,
          profileId,
          libraryId: library?.libraryId,
        }
      );

      if (privateStories.length === 0) return res.status(200).send([]);

      let storiesIds = [];
      privateStories.forEach((story) => {
        if (story?.story_id) storiesIds.push(story?.story_id);
      });

      if (storiesIds.length > 0) storiesIds = storiesIds.join(",");

      let illustrationParams = { select: "*" };
      if (storiesIds.length > 0) illustrationParams["story_id"] = `in.(${storiesIds})`;

      // Stories Illustrations
      const illustrationsResponse = await axios.get(
        `${process.env.SUPABASE_URL}/rest/v1/stories_images`,
        {
          params: illustrationParams,
          headers: generateSupabaseHeaders(),
        }
      );

      const illustrations = illustrationsResponse.data;

      // Public story request
      const publicStoriesRequests = await PublicStoryRequest.findAll({
        storyIds: storiesIds,
      });

      const publicStoriesRequestHash = convertArrayToHash(
        publicStoriesRequests,
        "storyId"
      );

      const storiesSerialized = privateStories
        ?.map((story) => {
          const publicStoryRequest = publicStoriesRequestHash[story.story_id];
          if (publicStoryRequest) {
            story.publicStoryRequest = publicStoryRequest;
          }
          story.illustrationsURL = illustrations
            .filter((illustration) => {
              return illustration?.story_id === story?.story_id;
            })
            .map((storyIllustration) => storyIllustration?.image_url);

          return story;
        })
        .sort((a, b) => {
          if (a.library_created_at < b.library_created_at) return 1;
          if (a.library_created_at > b.library_created_at) return -1;
        });

      return res.status(200).send(storiesSerialized);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getDiscoverStories(req, res) {
    try {
      const decodedJWT = DecodeJWT(req.accessToken);
      const isGuestUser = decodedJWT.isGuest;

      if (isGuestUser) {
        const publicStories = await Story.getStories(
          {
            private: false,
          },
          {
            freeTier: true,
          }
        );

        return res.status(200).send(publicStories);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      APIValidator.optionalParams(
        {
          allowedParams: ["narrator", "language", "ageGroups[]", "storyLengths[]"],
          incomeParams: req.query,
        },
        res
      );

      const { narrator, language } = req.query;
      const ageGroups = req.query["ageGroups[]"];
      const storyLengths = req.query["storyLengths[]"];

      const subscription = await Subscription.findOne({ accountId: user?.id });

      const adminAccount = Account.getAdminAccounts().includes(user.email);

      const publicStories = await Story.getStories(
        {
          narrator,
          language,
          ageGroups,
          storyLengths,
          private: false,
        },
        {
          freeTier:
            !adminAccount &&
            subscription.subscriptionPlan ===
              Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN,
        }
      );
      return res.status(200).send(publicStories);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async createStory(req, res) {
    try {
      APIValidator.requiredParams(
        { req, res },
        {
          requiredParams: ["profileId"],
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      let allowActionToProceed = false;
      if (Account.getAdminAccounts().includes(user.email)) {
        allowActionToProceed = true;
      } else {
        allowActionToProceed =
          await SubscriptionValidator.validateMaxStoriesRecordingTime({
            accountId: user.id,
          });
      }

      if (!allowActionToProceed) {
        return res
          .status(400)
          .send({ message: "This account has reached the max stories duration allowed" });
      }

      const {
        title,
        description,
        isPublic,
        language,
        ageGroups,
        recordingURL,
        duration,
        illustrationsURL,
        finished,
        storyIdeaId,
      } = req.body;

      const { profileId } = req.query;

      const newStory = {
        is_public: isPublic,
        title: title,
        recorded_by: profileId,
        recording_url: recordingURL,
        description: description,
        language: language,
        age_groups: ageGroups,
        duration: duration,
        account_id: user?.id,
        finished,
        story_idea_id: storyIdeaId,
      };

      const response = await axios.post(
        `${process.env.SUPABASE_URL}/rest/v1/stories`,
        newStory,
        {
          params: {
            select: "*",
          },
          headers: generateSupabaseHeaders(),
        }
      );

      let newStoryID = response.data[0].story_id;

      // simulate the story "saving" process by adding it to the library_stories table
      if (newStoryID && user) {
        const defaultLibrary = await Library.findDefaultLibrary({ accountId: user?.id });

        await axios.post(
          `${process.env.SUPABASE_URL}/rest/v1/library_stories`,
          {
            account_id: user.id,
            story_id: newStoryID,
            library_id: defaultLibrary.libraryId,
            profile_id: profileId,
          },
          {
            params: {
              select: "*",
            },
            headers: generateSupabaseHeaders(),
          }
        );

        const createdStory = new Story({
          storyId: response.data[0].story_id,
          title: response.data[0].title,
          description: response.data[0].description,
          isPublic: response.data[0].is_public,
          transcript: response.data[0].transcript,
          language: response.data[0].language,
          region: response.data[0].region,
          theme: response.data[0].theme,
          category: response.data[0].category,
          imageUrl: response.data[0].imageUrl,
          lastUpdated: response.data[0].last_updated,
          createdAt: response.data[0].created_at,
          ageGroups: response.data[0].age_groups,
          narratorName: response.data[0].narrator_name,
          recordedBy: response.data[0]?.recorded_by,
          playCount: response.data[0]?.play_count,
          finished: response.data[0]?.finished,
          recordingUrl: response.data[0]?.recording_url,
        });

        if (illustrationsURL?.length > 0) {
          // Let's add the illustrations
          illustrationsURL.map(async (illustrationURL) => {
            await axios.post(
              `${process.env.SUPABASE_URL}/rest/v1/stories_images`,
              {
                image_url: illustrationURL,
                story_id: createdStory?.storyId,
              },
              {
                params: {
                  select: "*",
                },
                headers: generateSupabaseHeaders(),
              }
            );
          });
        }
      }

      return res.status(201).send({ storyId: newStoryID });
    } catch (error) {
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getStoriesFilters(req, res) {
    try {
      let userId = null;
      if (req.query.profileId) {
        const {
          data: { user },
        } = await supabase.auth.getUser(req.accessToken);
        userId = user.id;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      const library = await Library.findDefaultLibrary({ accountId: user.id });

      let stories = await Story.getStories(
        {
          private: Boolean(req.query.profileId),
        },
        {
          userId,
          profileId: req.query.profileId,
          libraryId: library?.libraryId,
        }
      );

      const uniqueNarrators = new Set();
      const uniqueLanguages = new Set();

      const narrators = stories
        .reduce((acc, story) => {
          const narratorName = story?.narrator_name || story?.profiles?.profile_name;
          if (!uniqueNarrators.has(narratorName)) {
            uniqueNarrators.add(narratorName);
            acc.push({ narratorName });
          }

          return acc;
        }, [])
        .filter((narrator) => narrator?.narratorName !== undefined);

      const languages = stories.reduce((acc, story) => {
        if (!uniqueLanguages.has(story.language)) {
          uniqueLanguages.add(story.language);
          acc.push({ language: story.language });
        }

        return acc;
      }, []);

      return res.status(200).send({
        narrators: applyAlphabeticalOrder(narrators, "narratorName"),
        languages: applyAlphabeticalOrder(languages, "language"),
      });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async addStoryToLibrary(req, res) {
    try {
      APIValidator.requiredParams(
        { req, res },
        {
          requiredParams: ["storyId", "profileId"],
        }
      );

      const { storyId, profileId } = req.query;

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      const defaultLibrary = await Library.findDefaultLibrary({ accountId: user.id });

      await LibraryStory.create({
        storyId,
        profileId,
        accountId: user.id,
        libraryId: defaultLibrary?.libraryId,
      });

      return res.status(201).send({ message: "Story added to library with success" });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async removeStoryFromLibrary(req, res) {
    try {
      APIValidator.requiredParams(
        { req, res },
        {
          requiredParams: ["storyId", "profileId"],
        }
      );

      const { storyId, profileId } = req.query;

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      const defaultLibrary = await Library.findDefaultLibrary({ accountId: user.id });

      await LibraryStory.delete({
        storyId,
        libraryId: defaultLibrary.libraryId,
        profileId,
        accountId: user.id,
      });

      return res.status(204).send({ message: "Story removed from library with success" });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong." });
    }
  }

  static async submitStoryToPublicLibrary(req, res) {
    try {
      APIValidator.requiredParams(
        { req, res },
        {
          requiredParams: ["storyId", "profileId"],
        }
      );

      const { storyId, profileId } = req.query;

      const { publicStoryRequest, error } = await PublicStoryRequest.create({
        storyId,
        profileId,
      });

      if (error) return res.status(200).send({ message: error });

      return res
        .status(201)
        .send({ message: "Public story request has been created with success." });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getPublicStoryRequests(req, res) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      if (!allowedAdminUsers.includes(user.email)) {
        return res.status(401).send({ message: "Not allowed" });
      }

      const publicStoryRequests = await PublicStoryRequest.getPublicStoryRequests({});

      const publicStoryRequestsSerialized = [];
      await Promise.all(
        publicStoryRequests.map(async (publicStoryRequest) => {
          const publicStoryRequestSerialized = await publicStoryRequest.serializer();

          publicStoryRequestsSerialized.push(publicStoryRequestSerialized);
        })
      );

      return res.status(200).send(publicStoryRequestsSerialized);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getTotalRecordingTime(req, res) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      const totalRecordingTime = await Library.getTotalRecordingTime({
        accountId: user?.id,
      });

      return res.status(200).send({ totalRecordingTime });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async updatePlayCount(req, res) {
    try {
      APIValidator.requiredParams({ req, res }, { requiredParams: ["storyId"] });

      const story = await Story.getStory(req.query.storyId);
      await story.update({ playCount: story.playCount + 1 });

      return res.status(202).send({ message: "Play count updated with success" });
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getUnfinishedStories(req, res) {
    try {
      const { profileId } = req.query;

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      const stories = await Story.getStories(
        { finished: false, private: true },
        {
          userId: user.id,
          profileId,
        }
      );

      return res.status(200).send(stories);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async generateStoryIdea(req, res) {
    try {
      APIValidator.requiredPayload(
        { req, res },
        {
          requiredPayload: ["isFictional", "language", "ageGroups", "description"],
        }
      );

      const { isFictional, ageGroups, description } = req.body;

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);

      if (!user) return res.status(401).send({ message: "Not allowed" });

      const accountToolsUsage = await AccountToolsUsage.findOne({
        accountId: user.id,
      });

      if (!accountToolsUsage) {
        return res.status(400).send({ message: "Missing tools usage configuration" });
      }

      if (accountToolsUsage.currentMonthTotalStoryIdeas >= MONTHLY_STORY_IDEAS_ALLOWED) {
        return res
          .status(401)
          .send({ message: "AI Story idea generator usage has reached it's limit" });
      }

      function generateRandomString(length) {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

      const prompt = `Generate a ${
        isFictional ? "fictional" : "real-life"
      } story idea in English. 
            Describe a unique setting in 280 characters. 
            Introduce three main characters with distinct descriptions in 525 characters.
            Provide a title in 50 characters that includes specific keywords/themes and is unique and should some of following letters "${generateRandomString(
              10
            )}".
            Give the first line of the story in 210 characters.
            The story should revolve around ${description} and be suitable for ${ageGroups}. 
            Format the response as an object with id:guid, title:string, setting:string, characters:array of objects(name:string, description:string)  and firstLine:string.
            Ensure each aspect of the prompt adds uniqueness and specificity to the story idea.
            `;

      const response = await OpenAIService.createCompletion({ prompt });
      let data = response.message.content;

      data = data.replace(/```json\n|\n```|\n/g, "");
      const storyIdea = JSON.parse(data);

      await accountToolsUsage.update({
        currentMonthTotalStoryIdeas: accountToolsUsage.currentMonthTotalStoryIdeas + 1,
        totalStoryIdeas: accountToolsUsage.totalStoryIdeas + 1,
      });

      return res.status(200).send(storyIdea);
    } catch (error) {
      console.error(error);
      return res.status(400).send({ message: "Something went wrong" });
    }
  }

  static async getTranscript(req, res) {
    try {
      APIValidator.requiredParams(
        { req, res },
        {
          requiredParams: ["storyId"],
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser(req.accessToken);
      const subscription = await Subscription.findOne({ accountId: user?.id });

      const adminAccount = Account.getAdminAccounts().includes(user.email);

      if (
        !adminAccount &&
        subscription.subscriptionPlan ===
          Subscription.getAllowedSubscriptionPlanNames().FREE_SUBSCRIPTION_PLAN
      ) {
        return res.status(200).send({ transcript: "" });
      }

      const { storyId } = req.query;

      const story = await Story.getStory(storyId);

      const transcript = await story.getTranscript();

      return res.status(200).send({ transcript });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Something went wrong." });
    }
  }

  static async generateTranscriptForExistingStories(req, res) {
    try {
      const stories = await Story.findAll();
      const _stories = stories.filter((story) => {
        return !story.deleted && story.recordingUrl;
      });

      console.log(">>> TOTAL STORIES: ", _stories.length);
      for (let i = 0; i < _stories.length; i += 1) {
        const story = _stories[i];
        console.log(`>>> START STORY ID: ${story.storyId} | ${i + 1}/${_stories.length}`);
        if (story.transcriptWithTimestamp) {
          console.log(">>> SKIPPING STORY - TRANSCRIPTION ALREADY DONE");
          continue;
        }
        await story.getTranscript({ forceCreation: true });
        console.log(">>> END STORY");
      }

      return res.status(200).send("OK");
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Something went wrong." });
    }
  }
}

module.exports = StoryController;
