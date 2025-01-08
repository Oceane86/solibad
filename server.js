const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(4000, {
    cors: {
        origin: "*",  // Autorise toutes les origines (à adapter en production)
    }
});

let auctions = {}; // Stocke le nombre d'utilisateurs par enchère

io.on("connection", (socket) => {
    console.log(`✅ Un utilisateur connecté: ${socket.id}`);

    socket.on("join_auction", (auctionId) => {
        console.log(`📢 L'utilisateur ${socket.id} a rejoint l'enchère ${auctionId}`);

        // Assure-toi que l'objet de l'enchère existe
        if (!auctions[auctionId]) {
            auctions[auctionId] = 0;
        }

        auctions[auctionId]++;

        // Envoie le nombre d'utilisateurs à tous les clients de l'enchère
        io.emit("users_online", auctions[auctionId]);

        console.log(`👥 Enchérisseurs en ligne pour ${auctionId}: ${auctions[auctionId]}`);

        // Gère la déconnexion
        socket.on("disconnect", () => {
            console.log(`❌ Utilisateur déconnecté: ${socket.id}`);

            if (auctions[auctionId]) {
                auctions[auctionId] = Math.max(0, auctions[auctionId] - 1);
            }

            // Mise à jour du nombre d'enchérisseurs
            io.emit("users_online", auctions[auctionId]);
        });
    });
});
