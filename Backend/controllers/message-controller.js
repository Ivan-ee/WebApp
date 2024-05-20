const { prisma } = require("../prisma/prisma-client");

const MessageController = {
    send: async (req, res) => {
        const { id: receiverId } = req.params;
        const senderId = req.user.userId;
        const { message } = req.body;

        console.log(message)

        try {
            let room = await prisma.room.findFirst({
                where: {
                    participants: {
                        some: {
                            userId: senderId,
                        },
                        some: {
                            userId: receiverId,
                        },
                    },
                },
            });

            if (!room) {
                room = await prisma.room.create({
                    data: {
                        participants: {
                            create: [
                                { userId: senderId },
                                { userId: receiverId },
                            ],
                        },
                    },
                });
            }

            const newMessage = await prisma.message.create({
                data: {
                    message: message,
                    senderId: senderId,
                    receiverId: receiverId,
                    roomId: room.id,
                },
            });

            await prisma.room.update({
                where: {
                    id: room.id,
                },
                data: {
                    messages: {
                        connect: { id: newMessage.id },
                    },
                },
            });

            return res.status(200).send(newMessage);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: error.message });
        }
    },
    get: async (req, res) => {
        const { id: userToChatId } = req.params;
        const senderId = req.user.userId;

        try {
            let room = await prisma.room.findFirst({
                where: {
                    participants: {
                        some: {
                            userId: senderId,
                        },
                        some: {
                            userId: userToChatId,
                        },
                    },
                },
                include: {
                    messages: true,
                }
            });

            if (!room) {
                return res.status(404).send('Диалог не найден');
            }

            const messages = room.messages;

            return res.status(200).send(messages);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = MessageController;
