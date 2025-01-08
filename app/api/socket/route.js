import { Server } from "socket.io";

let io;

export async function GET(req, { params }) {
    if (!io) {
        console.log("⚡ Initialisation de Socket.io");

        io = new Server(req.socket.server, {
            path: "/api/socket",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        let usersOnline = 0;

        io.on("connection", (socket) => {
            usersOnline++;
            io.emit("users_online", usersOnline);
            console.log("🟢 Utilisateur connecté :", usersOnline);

            socket.on("disconnect", () => {
                usersOnline--;
                io.emit("users_online", usersOnline);
                console.log("🔴 Utilisateur déconnecté :", usersOnline);
            });
        });

        req.socket.server.io = io;
    }

    return new Response("WebSocket Server Initialized", { status: 200 });
}
