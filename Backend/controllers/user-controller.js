const {prisma} = require("../prisma/prisma-client");
const jdenticon = require('jdenticon')
const bcrypt = require('bcryptjs')
const path = require("path");
const fs = require('fs');
const jwt = require('jsonwebtoken');

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
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Все поля обязатеьны'});
        }

        try {
            const user = await prisma.user.findUnique({where: {email: email}});

            if (!user) {
                return res.status(400).json({error: 'Такого пользователя не существует'});
            }

            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(400).json({error: 'Неверный логин или пароль'});
            }

            const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET)

            return res.status(200).json({token});

        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }
    },

    getUserById: async (req, res) => {
        const {id} = req.params;
        const userId = req.user.id;

        try {
            const user = await prisma.user.findUnique({
                where: {id: id},
                include: {
                    followwers: true,
                    following: true
                }
            });

            if (!user) {
                res.status(404).json({error: "Пользователь не найден"})
            }

            const isFollowing = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId: id }
                    ]
                }
            });
            
            res.status(200).json({...user, isFollowing: Boolean(isFollowing)});
        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }
    },
    update: async (req, res) => {
        res.send('update')
    },
    current: async (req, res) => {
        res.send('current')
    },
}

module.exports = UserController;