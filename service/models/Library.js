const generateSupabaseHeaders = require("../utils/generateSupabaseHeaders")
const axios = require("axios")
const {ApiError} = require("next/dist/server/api-utils")

const LibraryStory = require("./LibraryStory")
const Profile = require("./Profile")
import Story from "../models/Story"
const Account = require("./Account")

class Library {
    /**
     *
     * @param {string} createdAt
     * @param {string} accountId
     * @param {string} libraryId
     * @param {string} libraryName
     * @param {string} profileId
     * @param {string[]} sharedAccountIds
     */
    constructor({
        createdAt,
        accountId,
        libraryId,
        libraryName,
        sharedAccountIds = [],
        profileId
    }) {
        this.createdAt = createdAt
        this.accountId = accountId
        this.libraryId = libraryId
        this.libraryName = libraryName
        this.sharedAccountIds = sharedAccountIds
        this.profileId = profileId
    }


    /**
     *
     * @param {string} libraryName
     * @param {string} accountId
     * @param {string} profileId
     * @param {string} accessToken
     * @returns {Promise<Library>}
     */
    static async create({
        libraryName,
        accountId,
        profileId
    }) {
        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/libraries`, {
            account_id: accountId,
            profile_id: profileId,
            library_name: libraryName
        }, {
            params: {
               select: "*"
            },
            headers: generateSupabaseHeaders()
        })


        return new Library({
            libraryId: response.data[0].library_id,
            accountId: response.data[0].account_id,
            profileId: response.data[0].profile_id,
            libraryName: response.data[0].library_name,
            totalDuration: 0,
            totalStories: 0
        })
    }

    async delete() {
        await axios.delete(`${process.env.SUPABASE_URL}/rest/v1/libraries`,{
            params: {
                select: "*",
                library_id: `eq.${this.libraryId}`
            },
            headers: generateSupabaseHeaders()
        })


        return new Library({
            libraryId: this.libraryId,
            accountId: this.accountId,
            profileId: this.profileId,
            libraryName: this.libraryName,
            totalDuration: 0,
            totalStories: 0
        })
    }

    /**
     *
     * @param {object} searchParams
     * @param {{serialized: boolean}} options
     * @returns {Promise<*>}
     */
    static async findAll(searchParams ={ accountId: null, sharedAccountId: null}, options = { serialized: false }) {
        const queryParams = { select: "*" }
        if (searchParams.accountId) queryParams.account_id = `eq.${searchParams.accountId}`;
        if (searchParams.sharedAccountId) {
            queryParams.shared_account_ids = `cs.{${searchParams.sharedAccountId}}`;
        }

        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/libraries`, {
            params: queryParams,
            headers: generateSupabaseHeaders()
        });

        const librariesPromises = response.data.map(async (library) => {
            const libraryStories = await LibraryStory.findAll({ libraryId: library?.library_id })

            const totalDuration = libraryStories.length > 0 ? libraryStories.reduce((acc, current) => {
                return acc + current.duration
            }, 0) : 0

            const _library = new Library({
                createdAt: library?.created_at,
                accountId: library?.account_id,
                profileId: library?.profile_id,
                libraryId: library?.library_id,
                libraryName: library?.library_name,
                sharedAccountIds: library?.shared_account_ids,
                totalStories: libraryStories?.length,
                totalDuration: totalDuration
            });

            if (options.serialized) {
                return await _library.serializer();
            }

            return _library;
        });

        return await Promise.all(librariesPromises);
    }

    static async findDefaultLibrary({ accountId }) {
        const libraries = await Library.findAll({
            accountId
        })

        const orderedLibraries = libraries.sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1
            if (a.createdAt > b.createdAt) return 1
        })

        return orderedLibraries.shift()
    }


    static async findOne({ libraryId }, options = { serialized: false }) {
        const response = await axios.get(`${process.env.SUPABASE_URL}/rest/v1/libraries`, {
            params: {
                select: "*",
                library_id: `eq.${libraryId}`
            },
            headers: generateSupabaseHeaders()
        })

        const library = new Library({
            accountId: response.data[0].account_id,
            profileId: response.data[0].profile_id,
            libraryId: response.data[0].library_id,
            libraryName: response.data[0].library_name,
            sharedAccountIds: response.data[0].shared_account_ids
        })

        if (!options.serialized) {
            return library
        }

        return await library.serializer()
    }

    static async addStory({ storyId, libraryId, accountId, profileId }) {
        const storyAlreadyAddedToLibrary = await LibraryStory.findOne({ libraryId, storyId })

        if (storyAlreadyAddedToLibrary) {
            throw new ApiError(409, "Story already added to this library.")
        }

        const response = await axios.post(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            library_id: libraryId,
            story_id: storyId,
            account_id: accountId,
            profile_id: profileId
        }, {
            params: {
                select: "*"
            },
            headers: generateSupabaseHeaders()
        })

        return response.data[0]
    }

    static async removeStory({ storyId, libraryId, profileId }) {
        const response = await axios.delete(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                select: "*",
                library_id: `eq.${libraryId}`,
                story_id: `eq.${storyId}`,
                profile_id: `eq.${profileId}`
            },
            headers: generateSupabaseHeaders()
        })

        return response.data[0]
    }

    static async deleteStoryFromLibraries(storyId) {
        const response = await axios.delete(`${process.env.SUPABASE_URL}/rest/v1/library_stories`, {
            params: {
                select: "*",
                story_id: `eq.${storyId}`,
            },
            headers: generateSupabaseHeaders()
        })

        return response.data[0]
    }

    static async getTotalRecordingTime({ accountId }) {
        const stories = await Story.findAll({ accountId })

        return stories.reduce((accumulator, currentStory) => {
            return accumulator + (currentStory?.duration || 0)
        }, 0) / 60
    }

    async update({ sharedAccountIds, libraryName }) {
        const payload = {}
        if (sharedAccountIds) payload.shared_account_ids = sharedAccountIds
        if (libraryName) payload.library_name = libraryName

        const response = await axios.patch(`${process.env.SUPABASE_URL}/rest/v1/libraries`,
            payload, {
            params: {
                select: "*",
                library_id: `eq.${this.libraryId}`
            },
            headers: generateSupabaseHeaders()
        })

        return new Library({
            accountId: response.data[0].account_id,
            libraryId: response.data[0].library_id,
            profileId: response.data[0].profile_id,
            libraryName: response.data[0].library_name,
            sharedAccountIds: response.data[0].shared_account_ids
        })
    }

    async serializer() {
        const listenersPromises = this.sharedAccountIds.map(async (sharedAccountId) => {
            const account = await Account.findOne({ accountId: sharedAccountId });
            if (account) {
                return {
                    avatarUrl: account.avatarUrl,
                    name: account.name,
                    accountId: account.accountId,
                    email: account?.email
                };
            }
        });

        const listeners = (await Promise.all(listenersPromises)).filter(listener => !!listener);
        let profile = {}
        if (this.profileId) {
            profile = await Profile.getProfile(this.profileId)
        } else {
            profile = await Account.getDefaultProfile({ accountId: this.accountId })
        }

        const totalStories = await this.getTotalStories()
        const totalDuration = await this.getTotalDuration()

        return {
            accountId: this.accountId,
            libraryId: this.libraryId,
            profileId: this.profileId,
            libraryName: this.libraryName,
            sharedAccountIds: this.sharedAccountIds,
            totalStories,
            totalDuration,
            createdAt: this.createdAt,
            listeners,
            profile
        };
    }

    async getStories() {
        return await LibraryStory.findAll({libraryId: this.libraryId}) || []
    }

    async getTotalStories() {
        const stories = await this.getStories()

        return stories.length
    }

    async getTotalDuration() {
        const libraryStories = await this.getStories()
        return libraryStories.length > 0 ? libraryStories.reduce((acc, current) => {
            return acc + current.duration
        }, 0) : 0
    }
}


module.exports = Library
