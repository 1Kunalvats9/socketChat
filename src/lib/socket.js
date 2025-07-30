import { io } from "socket.io-client";
let socket;

if (typeof window !== 'undefined') {
    if (!socket) {
        socket = io({
            path: "/api/socket",
            autoConnect: false
        });
    }
}

// Helper function to authenticate socket with JWT token
export const authenticateSocket = (token) => {
    if (socket && token) {
        socket.emit('authenticate', token);
    }
};

// Helper function to connect socket
export const connectSocket = () => {
    if (socket && !socket.connected) {
        socket.connect();
    }
};

export default socket;
