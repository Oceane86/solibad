const fs = require('fs');
const https = require('https');
const { Server } = require("socket.io");

// Charger le certificat SSL de Let's Encrypt
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/pauldecalf.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pauldecalf.fr/fullchain.pem')
};

// Créer un serveur HTTPS
const server = https.createServer(options);
const io = new Server(server, {
    cors: {
        origin: "https://pauldecalf.fr",
        methods: ["GET", "POST"]
    }
});

// Gestion des connexions WebSocket
io.on("connection", (socket) => {
    console.log("🟢 Un utilisateur connecté");

    socket.on("disconnect", () => {
        console.log("🔴 Un utilisateur déconnecté");
    });
});

// Lancer le serveur sécurisé sur le port 4000
server.listen(4000, () => {
    console.log("🚀 Serveur WebSocket sécurisé sur https://pauldecalf.fr:4000");
});