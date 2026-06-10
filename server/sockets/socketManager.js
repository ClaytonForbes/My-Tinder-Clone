let io;
const onlineUsers = new Map();

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (userId) => {
            onlineUsers.set(userId, socket.id);
        });

        socket.on("send_message", ({ to, message }) => {
            const receiverSocket = onlineUsers.get(to);

            if (receiverSocket) {
                io.to(receiverSocket).emit("receive_message", message);
            }
        });

        socket.on("disconnect", () => {
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
        });
    });

    return io;
};

module.exports = { initSocket };