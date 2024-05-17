const {prisma} = require("../prisma/prisma-client");

const FollowController = {
    follow: async (req, res) => {
        const {followingId} = req.body;
        const userId = req.user.userId;

        if (followingId === userId) {
            return res.status(401).send({error: "Вы не можете подписаться на самого себя"});
        }

        try {
            const existingSubscription = await prisma.follows.findFirst({
                where: {
                    AND: [
                        {followerId: userId},
                        {followingId: followingId}

                    ]
                }
            });

            if (existingSubscription) {
                return res.status(400).json({ message: 'Подписка уже существует' });
            }

            await prisma.follows.create({
                data: {
                    follower: { connect: { id: userId } },
                    following: { connect: { id: followingId } },
                },
            });

            res.status(200).json({ message: 'Подписка успешно создана' });
        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }
    },
    unfollow: async (req, res) => {
        const {followingId} = req.body;
        const userId = req.user.userId;

        try {
            const follows = await prisma.follows.findFirst({
                where:{
                    AND: [
                        {followerId: userId},
                        {followingId: followingId}
                    ]
                }
            });

            if (!follows) {
                return res.status(404).json({ error: "Запись не найдена" });
            }

            await prisma.follows.delete({
                where: { id: follows.id },
            });

            res.status(200).json({ message: 'Отписка успешно выполнена' });
        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }
    }
}

module.exports = FollowController;