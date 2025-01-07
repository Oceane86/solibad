import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Item from "@/models/Item";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectToDB();

        let data;

        const contentType = req.headers.get("content-type") || "";

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

        const { name, description, imagePath, startingPrice, status, startDate, endDate, creator } = data;

        console.log("Données du formulaire reçues:", data);

        if (!name || !description || !imagePath || !startingPrice || !status || !startDate || !endDate || !creator) {
            return NextResponse.json(
                { message: "Tous les champs requis doivent être remplis." },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(creator)) {
            return NextResponse.json(
                { message: "L'ID du créateur est invalide." },
                { status: 400 }
            );
        }
        const creatorId = new mongoose.Types.ObjectId(creator);

        const item = new Item({
            name,
            description,
            imagePath,
            startingPrice,
            status,
            startDate,
            endDate,
            creator: creatorId,
        });

        await item.save();

        return NextResponse.json(
            { message: "Enchère créée avec succès.", item },
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
