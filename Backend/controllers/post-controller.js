const {prisma} = require("../prisma/prisma-client");

const PostController = {
    create: async (req, res) => {

        const {content} = req.body;

        const authorId = req.user.userId;

        if (!content) {
            return res.status(400).send({error: "Все поля обязательны"});
        }

        try {

            const post = await prisma.post.create({
                data: {
                    content: content,
                    authorId: authorId
                }
            });

            return res.status(200).send(post);
        } catch (error) {
            console.error('err', error)
            res.status(500).json({error: error});
        }
    },
    getAll: async (req, res) => {
        const authorId = req.user.userId;

        try {
            const posts = await prisma.post.findMany({
                include: {
                    author: true,
                    likes: true,
                    comments: true,
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
    getById: async (req, res) => {
        const {id} = req.params ;

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

            if (!post){
                return res.status(404).json({error: 'Пост не найден'})
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error('err', error);
            res.status(500).json({error: error});
        }
    },
    delete: async (req, res) => {
        res.status(200).send({"message": "delete"});
    },
};

module.exports = PostController