const {prisma} = require("../prisma/prisma-client");

const CommentController = {
    create: async (req, res) => {
        try {
            const {postId, content} = req.body;
            const userId = req.user.userId;

            console.log(userId)
            console.log(req.body)

            if (!postId || !content) {
                return res.status(400).send({error: "Все поля обязательны"});
            }

            const comment = await prisma.comment.create({
                data: {
                    postId: postId,
                    userId: userId,
                    content: content
                }
            });

            return res.status(200).send("true");
        } catch (error) {
            console.error('err', error);
            res.status(500).json({error: error});
        }
    },
    delete: async (req, res) => {

    },
}

module.exports = CommentController;