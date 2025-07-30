import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Setting up socket.io server...');
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

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
          console.error("Error saving message:", error);
        }
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
