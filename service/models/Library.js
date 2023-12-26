import generateSupabaseHeaders from "../utils/generateSupabaseHeaders";
import axios from "axios";
import Account from "../models/Account"
import Story from "../models/Story"
import LibraryStory from "../models/LibraryStory"
import Profile from "../models/Profile"
import {ApiError} from "next/dist/server/api-utils";

export default class Library {
    /**
     *
     * @param {string} createdAt
     * @param {string} accountId
     * @param {string} libraryId
     * @param {string} libraryName
     * @param {number} totalStories
     * @param {number} totalDuration
     * @param {string} profileId
     * @param {string[]} sharedAccountIds
     */
    constructor({
        createdAt,
        accountId,
        libraryId,
        libraryName,
        sharedAccountIds = [],
        totalStories= 0,
        totalDuration = 0,
        profileId
    }) {
        this.createdAt = createdAt
        this.accountId = accountId
        this.libraryId = libraryId
        this.libraryName = libraryName
        this.sharedAccountIds = sharedAccountIds
        this.totalStories = totalStories
        this.totalDuration = totalDuration
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
    }, { accessToken }) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            account_id: accountId,
            profile_id: profileId,
            library_name: libraryName
        }, {
            params: {
               select: "*"
            },
            headers: generateSupabaseHeaders(accessToken)
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

    /**
     *
     * @param {string} accountId
     * @param {string} sharedAccountId
     * @param {string} accessToken
     * @param {{serialized: boolean}} options
     * @returns {Promise<*>}
     */
    static async findAll({ accountId, sharedAccountId }, { accessToken }, options = { serialized: false }) {
        const queryParams = { select: "*" }
        if (accountId) queryParams.account_id = `eq.${accountId}`;
        if (sharedAccountId) {
            queryParams.shared_account_ids = `cs.{${sharedAccountId}}`;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            params: queryParams,
            headers: generateSupabaseHeaders(accessToken)
        });

        const librariesPromises = response.data.map(async (library) => {
            const libraryStories = await Story.findAll({ libraryId: library?.library_id }, {
                accessToken
            }) || []

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
                return await _library.serializer({ accessToken });
            }

            return _library;
        });

        return await Promise.all(librariesPromises);
    }

    static async findDefaultLibrary({ accountId }, { accessToken }) {
        const libraries = await Library.findAll({ accountId }, { accessToken })

        const orderedLibraries = libraries.sort((a, b) => {
            if (a.createdAt < b.createdAt) return -1
            if (a.createdAt > b.createdAt) return 1
        })

        return orderedLibraries.shift()
    }


    static async findOne({ libraryId }, { accessToken }) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            params: {
                select: "*",
                library_id: `eq.${libraryId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return new Library({
            accountId: response.data[0].account_id,
            profileId: response.data[0].profile_id,
            libraryId: response.data[0].library_id,
            libraryName: response.data[0].library_name,
            sharedAccountIds: response.data[0].shared_account_ids
        })
    }

    static async addStory({ storyId, libraryId, accountId, profileId }, { accessToken }) {
        const storyAlreadyAddedToLibrary = await LibraryStory.findOne({ libraryId, storyId }, { accessToken })

        if (storyAlreadyAddedToLibrary) {
            throw new ApiError(409, "Story already added to this library.")
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/library_stories`, {
            library_id: libraryId,
            story_id: storyId,
            account_id: accountId,
            profile_id: profileId
        }, {
            params: {
                select: "*"
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return response.data[0]
    }

    async update({ sharedAccountIds }, { accessToken }) {
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/libraries`, {
            shared_account_ids: sharedAccountIds
        }, {
            params: {
                select: "*",
                library_id: `eq.${this.libraryId}`
            },
            headers: generateSupabaseHeaders(accessToken)
        })

        return new Library({
            accountId: response.data[0].account_id,
            libraryId: response.data[0].library_id,
            profileId: response.data[0].profile_id,
            libraryName: response.data[0].library_name,
            sharedAccountIds: response.data[0].shared_account_ids
        })
    }

    async serializer({ accessToken }) {
        const listenersPromises = this.sharedAccountIds.map(async (sharedAccountId) => {
            const account = await Account.findOne({ accountId: sharedAccountId }, { accessToken });
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
            profile = await Profile.getProfile(this.profileId, accessToken)
        } else {
            profile = await Account.getDefaultProfile({ accountId: this.accountId }, { accessToken })
        }

        return {
            accountId: this.accountId,
            libraryId: this.libraryId,
            profileId: this.profileId,
            libraryName: this.libraryName,
            sharedAccountIds: this.sharedAccountIds,
            totalStories: this.totalStories,
            totalDuration: this.totalDuration,
            createdAt: this.createdAt,
            listeners,
            profile
        };
    }

}
