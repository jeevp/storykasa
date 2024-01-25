async function setAccountIdToStories() {
    require('dotenv').config({ path: '.env' });

    const convertArrayToHash = require("../../utils/convertArrayToHash")
    console.log({ supabaseURL: process.env.SUPABASE_URL })

    console.log(">>> Start script - set account_id to stories")
    const Story = require("../models/Story")
    const Profile = require("../models/Profile")

    const stories = await Story.findAll()
    const profiles = await Profile.findAll()

    const storiesWithoutAccountId = stories.filter((story) => !story.accountId)

    const profilesHash = convertArrayToHash(profiles, "profileId")
    console.log(`>>> Updating ${storiesWithoutAccountId.length} stories`)

    for (let storyIndex = 0; storyIndex < storiesWithoutAccountId.length; storyIndex += 1) {
        const story = storiesWithoutAccountId[storyIndex]
        const profile = profilesHash[story.recordedBy]
        if (profile) {
            await story.update({ accountId: profile.accountId })
        }
    }

    console.log(">>> End script - set account_id to stories")
}

setAccountIdToStories()
