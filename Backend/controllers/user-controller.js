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
                    followers: true,
                    following: true
                }
            });

            if (!user) {
                res.status(404).json({error: "Пользователь не найден"})
            }

            const isFollowing = await prisma.follows.findFirst({
                where: {
                    AND: [
                        {followerId: userId},
                        {followingId: id}
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
        const {id} = req.params;
        const {email, name, dateOfBirth, bio, location} = req.body;

        let filePath;

        if (req.file && req.file.path) {
            filePath = req.file.path;
        }

        if (id !== req.user.userId) {
            return res.status(401).json({error: "Нет доступа"});
        }

        try {

            if (email) {
                const existingUser = await prisma.user.findFirst({where: {email: email}})

                if (existingUser && existingUser.id !== parseInt(id)) {
                    return res.status(400).json({error: "Почта уже используется"});
                }
            }

            const user = await prisma.user.update({
                where: {id: id},
                data: {
                    email: email || undefined,
                    name: name || undefined,
                    avatarUrl: filePath ? `/${filePath}` : undefined,
                    dateOfBirth: dateOfBirth || undefined,
                    bio: bio || undefined,
                    location: location || undefined,
                }
            });

            res.json(user);
        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }

    },
    current: async (req, res) => {
        const userId = req.user.userId;

        try {
            const user = await prisma.user.findUnique({
                where: {id: userId},
                include: {
                    followers: {
                        include: {
                            follower: true
                        }
                    },
                    following: {
                        include: {
                            following: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(400).json({error: "Не удалось найти пользователя"});
            }

            return res.status(200).json(user)
        } catch (error) {
            console.log('err', error)
            res.status(500).json({error: "Что-то пошло не так"});
        }
    },
}

module.exports = UserController;