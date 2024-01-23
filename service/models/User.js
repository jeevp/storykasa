const supabaseAdmin = require("../supabaseAdmin");


class User {
    constructor({
        id,
        email
    }) {
        this.id = id
        this.email = email
    }

    static async findOne({ id }) {
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(id)

        if (!data || error) {
            return null
        }

        return new User({
            id: data?.user?.id,
            email: data?.user?.email
        })
    }

    static async findAll() {
        let allUsers = [];
        let page = 0;
        const limit = 100;

        while (true) {
            try {
                const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
                    page,
                    limit,
                });

                const _users = users.users

                if (error) {
                    console.error('Error fetching users:', error);
                    break;
                }

                if (_users.length === 0) {
                    break;
                }

                allUsers = allUsers.concat(_users);
                page++;
            } catch (error) {
                break
            }
        }

        return allUsers.map((user) => new User({
            id: user.id,
            email: user.email
        }))
    }
}

module.exports = User
