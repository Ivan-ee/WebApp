const {prisma} = require("../prisma/prisma-client");
const jdenticon = require('jdenticon')
const bcrypt = require('bcryptjs')
const path = require("path");
const fs = require('fs');
const jwt = require('jsonwebtoken');

const UserController = {
    register: async (req, res) => {
        const {name, nickname, email, password} = req.body;

        if (!email || !password || !name || !nickname) {
            return res.status(400).json({error: 'Все поля обязатеьны.'});
        }

        try {
            const existingEmail = await prisma.user.findUnique({where: {email: email}});

            if (existingEmail) {
                return res.status(400).json({error: 'Пользователь с таким email уже существует.'});
            }

            const existingNickname = await prisma.user.findUnique({where: {nickname: nickname}});

            if (existingNickname) {
                return res.status(400).json({error: 'Пользователь с таким nickname уже существует.'});
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
                    nickname: nickname,
                    password: hashedPassword,
                    avatarUrl: `/uploads/${avatarName}`,
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

            const token = jwt.sign({userId: user.id}, '123')

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
    all: async (req, res) => {
        const userId = req.user.userId;

        try {
            const users = await prisma.user.findMany({
                where: {
                    id: {
                        not: userId,
                    },
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatarUrl: true,
                    dateOfBirth: true,
                    createdAt: true,
                    updatedAt: true,
                    bio: true,
                    location: true,
                },
            });

            return res.status(200).json(users)
        } catch (error) {
            console.log('err', error)
            res.status(500).json({error: "Что-то пошло не так"});
        }
    },
    // search: async (req, res) => {
    //     const {query} = req.query;
    //
    //     try {
    //         const users = await prisma.user.findMany({
    //             where: {
    //                 nickname: {
    //                     contains: query,
    //                     mode: 'insensitive'
    //                 }
    //             },
    //             select: {
    //                 nickname: true
    //             }
    //         });
    //
    //         res.json(users);
    //     } catch (error) {
    //         console.error('err', error)
    //         res.status(500).json({error: error});
    //     }
    // }
}

module.exports = UserController;