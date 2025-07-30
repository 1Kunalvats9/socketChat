import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"], // Your Next.js app URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on('send-message', async (messageData) => {
        try {
            const newMessage = await prisma.message.create({
                data: {
                    content: messageData.content,
                    senderId: messageData.senderId,
                    receiverId: messageData.receiverId,
                },
            });
            io.emit('receive-message', newMessage);
        } catch (error) {
            console.error("❌ Error saving message:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`⭕ Socket disconnected: ${socket.id}`);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.IO server is running on http://localhost:${PORT}`);
});