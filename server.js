const fs = require('fs');
const https = require('https');
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Bids = require("./models/Bids");
const AutoBids = require("./models/Autobids");
const Item = require("./models/Item");

// Charger le certificat SSL de Let's Encrypt
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/pauldecalf.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pauldecalf.fr/fullchain.pem')
};

// Connexion à MongoDB
mongoose.connect("mongodb+srv://ocerakotomalala:vUACq9V4fmFiudZ1@cluster0.9n5av.mongodb.net/solibad", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ Connexion à MongoDB réussie");
}).catch((err) => {
    console.error("❌ Erreur de connexion à MongoDB:", err.message);
});

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

    socket.on("join_auction", (auctionId) => {
        socket.join(auctionId);
        console.log(`👥 Utilisateur rejoint l'enchère ${auctionId}`);
    });

    socket.on("place_bid", async ({ userId, itemId, amount }) => {
        try {
            // Vérifier si l'enchère est valide
            const item = await Item.findById(itemId);
            if (!item) {
                socket.emit("bid_error", { message: "Article introuvable." });
                return;
            }

            const lastBid = await Bids.findOne({ itemId }).sort({ amount: -1 });

            if (lastBid && amount <= lastBid.amount) {
                socket.emit("bid_error", { message: "Votre enchère doit être supérieure à l'enchère actuelle." });
                return;
            }

            // Enregistrer la nouvelle enchère
            const newBid = new Bids({ userId, itemId, amount, status: "accepted", autoBid: false });
            await newBid.save();

            console.log(`🔥 Nouvelle enchère : ${amount}€ par ${userId} pour l'article ${itemId}`);
            io.to(itemId).emit("new_bid", newBid);

            // Vérifier et activer les enchères automatiques
            await handleAutoBid(itemId);

        } catch (error) {
            console.error("❌ Erreur lors de l'enchère :", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Un utilisateur déconnecté");
    });
});

// 🔄 Gestion automatique des enchères
async function handleAutoBid(itemId) {
    const lastBid = await Bids.findOne({ itemId }).sort({ amount: -1 });
    if (!lastBid) return;

    const autoBidders = await AutoBids.find({ itemId });

    for (const autoBid of autoBidders) {
        if (autoBid.userId.toString() === lastBid.userId.toString()) continue;

        const nextBidAmount = lastBid.amount + autoBid.increment;
        if (nextBidAmount > autoBid.maxBudget) continue;

        console.log(`🤖 Auto-bid activé : ${autoBid.userId} surenchérit à ${nextBidAmount}€`);

        const newBid = new Bids({
            userId: autoBid.userId,
            itemId,
            amount: nextBidAmount,
            status: "accepted",
            autoBid: true
        });

        await newBid.save();
        io.to(itemId).emit("new_bid", newBid);

        // Appeler récursivement pour continuer l'auto-bid
        await handleAutoBid(itemId);
    }
}

// 🔔 Prolongation automatique si une enchère est placée dans les dernières minutes
async function extendAuctionIfNeeded(itemId) {
    const item = await Item.findById(itemId);
    if (!item) return;

    const now = new Date();
    const endTime = new Date(item.endDate);

    // Vérifier si l'enchère est dans les 5 dernières minutes
    if (endTime - now <= 5 * 60 * 1000) {
        const newEndTime = new Date(endTime.getTime() + 5 * 60 * 1000);
        await Item.updateOne({ _id: itemId }, { endDate: newEndTime });

        io.to(itemId).emit("auction_extended", { newEndTime });
        console.log(`⏳ L'enchère ${itemId} a été prolongée jusqu'à ${newEndTime}`);
    }
}

// 🏆 Déterminer le gagnant et terminer les enchères
async function closeAuctions() {
    const now = new Date();
    const auctions = await Item.find({ endDate: { $lte: now } });

    for (const auction of auctions) {
        const highestBid = await Bids.findOne({ itemId: auction._id }).sort({ amount: -1 });

        if (highestBid) {
            console.log(`🎉 Enchère terminée pour ${auction.name}. Gagnant: ${highestBid.userId}`);
            await Item.updateOne({ _id: auction._id }, { winner: highestBid.userId });
            io.to(auction._id).emit("auction_ended", { winner: highestBid.userId });
        }
    }
}

// Exécuter `closeAuctions` toutes les minutes
setInterval(closeAuctions, 60 * 1000);

// Lancer le serveur sécurisé sur le port 4000
server.listen(4000, () => {
    console.log("🚀 Serveur WebSocket sécurisé sur https://pauldecalf.fr:4000");
});
