const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://pauldecalf.fr",
        methods: ["GET", "POST"]
    }
});

let usersOnline = 0; // 🔹 Compteur global des utilisateurs en ligne

io.on("connection", (socket) => {
    usersOnline++; // Incrémentation à la connexion
    console.log(`🟢 Un utilisateur connecté. Total en ligne : ${usersOnline}`);

    io.emit("users_online", usersOnline); // 🔹 Diffusion du nombre d'utilisateurs en ligne

    socket.on("disconnect", () => {
        usersOnline = Math.max(0, usersOnline - 1); // Évite les valeurs négatives
        console.log(`🔴 Un utilisateur déconnecté. Total en ligne : ${usersOnline}`);

        io.emit("users_online", usersOnline); // 🔹 Mise à jour en temps réel
    });
});

// Démarrer le serveur WebSocket sur le port 4000
server.listen(4000, () => {
    console.log("🚀 Serveur WebSocket en local sur http://localhost:4000");
});
