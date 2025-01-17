const fs = require('fs');
const https = require('https');
const { Server } = require("socket.io");

// Charger les certificats SSL de Let's Encrypt
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/pauldecalf.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pauldecalf.fr/fullchain.pem')
};

// Créer un serveur HTTPS sécurisé
const server = https.createServer(options);
const io = new Server(server, {
    cors: {
        origin: "https://pauldecalf.fr",
        methods: ["GET", "POST"]
    }
});

let usersOnline = 0; // 🔹 Compteur global des utilisateurs en ligne

io.on("connection", (socket) => {
    usersOnline++;
    console.log(`🟢 Un utilisateur connecté. Total en ligne : ${usersOnline}`);

    io.emit("users_online", usersOnline);

    socket.on("disconnect", () => {
        usersOnline = Math.max(0, usersOnline - 1);
        console.log(`🔴 Un utilisateur déconnecté. Total en ligne : ${usersOnline}`);
        io.emit("users_online", usersOnline);
    });
});

// Lancer le serveur WebSocket sécurisé sur le port 4000
server.listen(4000, () => {
    console.log("🚀 Serveur WebSocket sécurisé sur https://pauldecalf.fr:4000");
});
