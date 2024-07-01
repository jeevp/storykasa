import axios from "axios"

const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default class MailchimpService {
    static async getDefaultList() {
        const mailchimpLists = await MailchimpService.getLists()
        if (mailchimpLists?.length > 0) {
            return mailchimpLists[0]
        }

        return null
    }

    static async getLists() {
        try {
            const response = await mailchimp.lists.getAllLists();

            return response.lists.map((list) => ({ id: list.id, name: list.name }))
        } catch (error) {
            console.error('Error fetching Mailchimp lists:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    static async addMemberToList({ email, fullName }) {
        try {
            const defaultList = await this.getDefaultList()

            const response = await mailchimp.lists.addListMember(defaultList?.id, {
                email_address: email,
                merge_fields: {
                    FNAME: fullName
                },
                status: "subscribed",
                tags: ["Welcome", "free"]
            });

            return response;
        } catch (error) {
            console.error('Error adding contact to Mailchimp:', error.response ? error.response.data : error.message);
            throw error;
        }
    }


    static async updateListMemberTags({ memberId }, { tags }) {
        try {
            const defaultList = await this.getDefaultList()

            const response = await mailchimp.lists.updateListMemberTags(defaultList?.id, memberId, {
                tags
            });

            return response;
        } catch (error) {
            console.error('Error adding contact to Mailchimp:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}
