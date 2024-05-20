const {prisma} = require("../prisma/prisma-client");

const MessageController = {
    send: async (req, res) => {
        const {id: receiverId} = req.params;
        const senderId = req.user.id;
        const {message} = req.body;

        try {
            let conversation = await prisma.conversation.findFirst({
                where: {
                    participants: {
                        every: {
                            userId: {
                                in: [senderId, receiverId],
                            },
                        },
                    },
                },
            });

            if (!conversation) {
                conversation = await prisma.conversation.create({
                    data: {
                        participants: {
                            create: [
                                {userId: senderId},
                                {userId: receiverId},
                            ],
                        },
                    },
                });
            }

            const newMessage = await prisma.message.create({
                data: {
                    content: message,
                    senderId: senderId,
                    receiverId: receiverId,
                    conversationId: conversation.id, // Assign conversation ID to the message
                },
            });

            // 3. Update the conversation to include the new message
            const updatedConversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        push: newMessage.id,
                    },
                },
            });

            return res.status(200).send(newMessage);
        } catch (error) {
            console.error("err", error);
            res.status(500).json({error: error});
        }
    },
};

module.exports = MessageController;