const {prisma} = require("../prisma/prisma-client");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");

const PostController = {
    create: async (req, res) => {

        const {content, themeId} = req.body;

        const authorId = req.user.userId;

        if (!content) {
            return res.status(400).send({error: "Все поля обязательны"});
        }

        const contentWithTag = content.replace(
            /(^|\s)(#[\wа-яА-Я]+)/g,
            (match, before, hashtag) => `${before}<a href="/search?q=${hashtag.slice(1)}" style="color: blue; text-decoration: underline;">${hashtag}</a>`
        );

        console.log(contentWithTag)

        let filePath;

        if (req.file && req.file.path) {
            filePath = req.file.path;
        }

        try {

            const post = await prisma.post.create({
                data: {
                    content: contentWithTag,
                    authorId: authorId,
                    themeId: themeId,
                    image: filePath ? `/${filePath}` : undefined,
                }
            });

            return res.status(200).send(post);
        } catch (error) {
            console.error('err', error)
            res.status(500).json({error: error});
        }
    },
    getAll: async (req, res) => {
        const userId = req.user.userId;

        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: true,
                    likes: true,
                    comments: true,
                    theme: true,
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            const postsWithLikeInfo = posts.map(post => ({
                ...post,
                likedByUser: post.likes.some(like => like.userId === userId)
            }));
            res.json(postsWithLikeInfo);
        } catch (error) {
            console.error('err', error)
            res.status(500).json({error: error});
        }
    },
    update: async (req, res) => {
        const {id} = req.params;

        console.log(req.body)

        const {content, themeId} = req.body;

        if (!content) {
            return res.status(400).send({error: "Все поля обязательны"});
        }

        const contentWithTag = content.replace(
            /(^|\s)(#[\wа-яА-Я]+)/g,
            (match, before, hashtag) => `${before}<a href="/search?q=${hashtag.slice(1)}" style="color: blue; text-decoration: underline;">${hashtag}</a>`
        );

        let filePath;

        if (req.file && req.file.path) {
            filePath = req.file.path;
        }

        try {

            const post = await prisma.post.update({
                where: {id: id},
                data: {
                    content: contentWithTag,
                    themeId: themeId,
                    image: filePath ? `/${filePath}` : undefined,
                }
            });

            res.json(post);
        } catch (error) {
            console.error('err', error)
            res.status(500).json({error: error});
        }
    },
    getById: async (req, res) => {
        const {id} = req.params;

        const userId = req.user.userId;

        try {
            const post = await prisma.post.findUnique({
                where: {id: id},
                include: {
                    author: true,
                    likes: true,
                    comments: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            if (!post) {
                return res.status(404).json({error: 'Пост не найден'})
            }

            const postWithLikeInfo = {
                ...post,
                likedByUser: post.likes.some(like => like.userId === userId)
            };

            return res.status(200).json(postWithLikeInfo);
        } catch (error) {
            console.error('err', error);
            res.status(500).json({error: error});
        }
    },
    delete: async (req, res) => {
        const {id} = req.params;

        const userId = req.user.userId;

        const post = await prisma.post.findUnique({where: {id: id}});

        if (!post) {
            return res.status(404).json({error: 'Пост не найден'})
        }

        if (post.authorId !== userId) {
            return res.status(401).json({error: 'Нет доступа'});
        }

        try {
            const transaction = await prisma.$transaction([
                prisma.comment.deleteMany({where: {postId: id}}),
                prisma.like.deleteMany({where: {postId: id}}),
                prisma.post.delete({where: {id: id}}),
            ]);

            return res.status(200).json(transaction);
        } catch (e) {
            console.error('err', e);
            res.status(500).json({error: e});
        }
    },
};

module.exports = PostController