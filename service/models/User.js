const supabaseAdmin = require("../supabaseAdmin");
const supabase = require("../supabase");
const EmailService = require("../services/EmailService/EmailService").default

class User {
    constructor({
        id,
        email,
        fullName
    }) {
        this.id = id
        this.email = email
        this.fullName = fullName
    }

    static async signUp({ fullName, email, password }, options = { sendInitialCredentialEmail: false }) {
        let _password = password
        if (!_password) _password = this.generateTemporaryPassword()

        const { data, error } = await supabase.auth.signUp({
            email,
            password: _password,
            options: {
                data: {
                    full_name: fullName
                },
            },
        })

        if (error) {
            return error
        }

        if (options.sendInitialCredentialEmail) {
            await EmailService.sendInitialCredentialEmail({
                to: data.user.email,
                subject: "Welcome to StoryKasa - Access  your account"
            }, {
                userEmail: data.user.email,
                temporaryPassword: _password
            })
        }

        return {
            user: new User({
                id: data.user.id,
                email: data.user.email,
                fullName: data.user.user_metadata.full_name
            }),
            session: data.session
        }
    }

    static async findOne({ id, email }) {
        let data, error, user;
        if (id) {
            ({ data, error } = await supabaseAdmin.auth.admin.getUserById(id));
            user = new User({
                id: data.user.id,
                email: data.user.email,
                fullName: data.user.user_metadata.full_name
            })
        }
        else if (email) {
            ({ data, error } = await supabaseAdmin
                .from("visible_users")
                .select("*")
                .eq("email", email)
                .single()
            )

            if (!data) {
                return null
            }

            user = new User({
                id: data.id,
                email: data.email,
                fullName: data.raw_user_meta_data.full_name
            })
        }
        else {
            return null;
        }

        if (!data || error) {
            console.error('Error fetching user:', error);
            return null;
        }

        console.log({ user })
        return user
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

    static generateTemporaryPassword() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        const numbers = '0123456789'
        const allCharacters = letters + numbers
        const passwordLength = 8
        let password = ''

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * allCharacters.length)
            password += allCharacters[randomIndex]
        }

        return password
    }
}

module.exports = User
