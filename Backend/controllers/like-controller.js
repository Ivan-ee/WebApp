const {prisma} = require("../prisma/prisma-client");

const LikeController = {
    like: async (req, res) => {
         const {postId} = req.body;
         const userId = req.user.userId;

         if (!postId){
             return res.status(401).send({error: "Пост отсутвует"});
         }

         try {
             const existingLike = await prisma.like.findFirst({
                 where: {postId: postId, userId: userId}});

             if (existingLike) {
                 return res.status(400).json({error: 'Вы уже поставили лайк'})
             }

             const like = await prisma.like.create({
                 data: {
                     postId: postId,
                     userId: userId
                 }
             });

             res.status(200).send(like);
         } catch (e) {
             console.error(e);
             return res.status(500).json({error: e});
         }
    },
    unlike: async (req, res) => {
        const {id} = req.params;
        const userId = req.user.userId;

        if (!id){
            return res.status(400).json({error: 'Вы уже поставили лайк'})
        }

        try {
            const existingLike = await prisma.like.findFirst({
                where: {postId: id, userId: userId}
            });

            if(!existingLike) {
                return res.status(400).json({ error: 'Лайк уже существует' });
            }

            const like = await prisma.like.deleteMany({
                where: { postId: id, userId },
            });

            res.status(200).json(like);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: e});
        }
    }

}

module.exports = LikeController