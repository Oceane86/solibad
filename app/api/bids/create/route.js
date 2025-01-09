import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Bids from "@/models/Bids";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectToDB();

        const contentType = req.headers.get("content-type") || "";
        let data;

        if (contentType.includes("application/json")) {
            data = await req.json();
        } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            data = Object.fromEntries(formData.entries());
        } else {
            return NextResponse.json(
                { message: "Type de contenu non supporté." },
                { status: 415 }
            );
        }

        const { userId, itemId, amount, status, autoBid } = data;

        console.log("Données reçues:", data);

        if (!userId || !itemId || !amount || !status) {
            return NextResponse.json(
                { message: "Tous les champs requis doivent être remplis." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { message: "L'ID de l'utilisateur est invalide." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return NextResponse.json(
                { message: "L'ID de l'objet est invalide." },
                { status: 400 }
            );
        }

        const bid = new Bids({
            userId: new mongoose.Types.ObjectId(userId),
            itemId: new mongoose.Types.ObjectId(itemId),
            amount,
            bidDate: new Date(),
            status,
            autoBid: autoBid || false, // Par défaut, false
            createdAt: new Date(),
        });

        await bid.save();

        return NextResponse.json(
            { message: "Enchère créée avec succès.", bid },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur API:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue lors de la création de l'enchère.", error: error.message },
            { status: 500 }
        );
    }
}
