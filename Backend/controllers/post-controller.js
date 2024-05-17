const {prisma} = require("../prisma/prisma-client");

const PostController = {
    create: async (req, res) => {

        const {content} = req.body;

        const authorId = req.user.userId;

        console.log(authorId)

        if (!content){
            return res.status(400).send({error: "Все поля обязательны"});
        }

        try{

            const post = await prisma.post.create({
                data: {
                    content: content,
                    authorId: authorId
                }
            });

            return res.status(200).send(post);
        } catch (error) {
            console.error('err', error)
            res.status(500).json({error:error});
        }
    },
    getAll: async (req, res) => {
        res.status(200).send({"message": "get all"});
    },
    getById: async (req, res) => {
        res.status(200).send({"message": "get by id"});
    },
    delete: async (req, res) => {
        res.status(200).send({"message": "delete"});
    },
};

module.exports = PostController