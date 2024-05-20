const { prisma } = require("../prisma/prisma-client");

const MessageController = {
    send: async (req, res) => {
        const { id: receiverId } = req.params;
        const senderId = req.user.userId;
        const { message } = req.body;

        console.log(message)

        try {
            // Поиск существующей комнаты с обоими участниками
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

            // Если комната не найдена, создать новую
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

            // Создание нового сообщения
            const newMessage = await prisma.message.create({
                data: {
                    message: message, // исправлено с content на message для соответствия модели
                    senderId: senderId,
                    receiverId: receiverId,
                    roomId: room.id, // исправлено с conversationId на roomId
                },
            });

            // Обновление комнаты, чтобы включить новое сообщение
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
};

module.exports = MessageController;
