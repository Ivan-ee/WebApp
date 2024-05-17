const { prisma } = require("../prisma/prisma-client");
const jdenticon = require('jdenticon')
const bcrypt = require('bcryptjs')
const path = require("path");
const fs = require('fs');

const UserController = {
    register: async (req, res) => {
        const {name, email, password} = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({error: 'Все поля обязатеьны.'});
        }

        try {
            const existingUser = await prisma.user.findUnique({where: {email: email}});

            if (existingUser) {
                return res.status(400).json({error: 'Пользователь с таким email уже существует.'});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const png = jdenticon.toPng(name, 200);
            const avatarName = `${name}_${Date.now()}.png`;
            const avatarPath = path.join(__dirname, '/../uploads', avatarName);
            fs.writeFileSync(avatarPath, png);

            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword,
                    avatarUrl: `/uploads/${avatarPath}`,
                }
            });

            return res.status(200).json({user});

        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }
    },
    login: async (req, res) => {
        res.send('login')
    },
    getUserById: async (req, res) => {
        res.send('getUserById')
    },
    update: async (req, res) => {
        res.send('update')
    },
    current: async (req, res) => {
        res.send('current')
    },
}

module.exports = UserController;