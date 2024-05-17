const {prisma} = require("../prisma/prisma-client");

const CommentController = {
    create: async (req, res) => {
        try {
            const {postId, content} = req.body;
            const userId = req.user.userId;

            console.log(userId)
            //6647c186454a86ccdb1f0222

            if (!postId || !content) {
                return res.status(401).send({error: "Все поля обязательны"});
            }

            const comment = await prisma.comment.create({
                data: {
                    postId: postId,
                    userId: userId,
                    content: content
                }
            });

            return res.status(200).send(comment);
        } catch (error) {
            console.error('err', error);
            res.status(500).json({error: error});
        }
    },
    delete: async (req, res) => {
        const {id} = req.params;
        const userId = req.user.userId;

        try {
            const comment = await prisma.comment.findUnique({where: {id: id}});

            if (!comment) {
                return res.status(404).json({error: 'Комментарий не найден'})
            }

            if (comment.userId !== userId) {
                return res.status(401).send({error: "Нет доступа"});
            }

            await prisma.comment.delete({where: {id: id}});

            return res.status(200).send(comment);

        } catch (error) {
            console.error('err', error);
            res.status(500).json({error: error});
        }
    },
}

module.exports = CommentController;