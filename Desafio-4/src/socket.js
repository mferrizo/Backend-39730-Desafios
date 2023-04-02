import { Server } from "socket.io";

const socket = {};

socket.connect = (httpServer) => {
    socket.io = new Server(httpServer);

    socket.io.on("connection", (socket) => {
        console.log(`New client id: ${socket.id} connected`);

        socket.on("disconnect", () => {
            console.log(`Client id: ${socket.id} disconnected`);
        });
    });
};

export default socket;

