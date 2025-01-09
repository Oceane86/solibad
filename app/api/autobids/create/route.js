import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import mongoose from "mongoose";
import Autobids from "@/models/Autobids";

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

        const { userId, itemId, maxBudget, increment, createdAt } = data;

        console.log("Données reçues:", data);

        if (!userId || !itemId || !maxBudget || !increment || !createdAt) {
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

        const autobid = new Autobids({
            userId: new mongoose.Types.ObjectId(userId),
            itemId: new mongoose.Types.ObjectId(itemId),
            maxBudget: parseFloat(maxBudget),
            increment: parseFloat(increment),
            createdAt: new Date(createdAt)
        });

        await autobid.save();

        return NextResponse.json(
            { message: "Enchère créée avec succès.", autobid },
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
