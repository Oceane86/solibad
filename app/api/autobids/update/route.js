import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Autobids from "@/models/Autobids";
import mongoose from "mongoose";

export async function PUT(req) {
    try {
        await connectToDB();

        let searchParams = new URL(req.url, "http://localhost").searchParams;
        let idUser = searchParams.get("idUser");
        let idItem = searchParams.get("idItem");
        let budgetMax = Number(searchParams.get("budgetMax"));
        let increment = Number(searchParams.get("increment"));

        if (!mongoose.Types.ObjectId.isValid(idUser)) {
            throw new Error("L'ID utilisateur fourni n'est pas valide");
        }
        if (!mongoose.Types.ObjectId.isValid(idItem)) {
            throw new Error("L'ID de l'article fourni n'est pas valide");
        }

        // Vérifier si une enchère automatique existe déjà
        let autobid = await Autobids.findOne({ userId: idUser, itemId: idItem });

        if (autobid) {
            // Mise à jour de l'enchère automatique existante
            autobid.maxBudget = budgetMax;
            autobid.increment = increment;
            await autobid.save();

            return createCorsResponse(NextResponse.json({ success: true, message: "Enchère mise à jour", autobid }, { status: 200 }));
        } else {
            // Création d'une nouvelle enchère automatique si elle n'existe pas
            let newAutobid = new Autobids({
                userId: idUser,
                itemId: idItem,
                maxBudget: budgetMax,
                increment: increment,
                createdAt: new Date(),
            });

            await newAutobid.save();

            return createCorsResponse(NextResponse.json({ success: true, message: "Nouvelle enchère automatique créée", autobid: newAutobid }, { status: 201 }));
        }
    }
    catch (error) {
        console.error("Erreur dans PUT /api/autobids/update:", error);
        return createCorsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
    }
}

// Gestion des CORS
function createCorsResponse(response) {
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true"
    });

    return new Response(response.body, {
        status: response.status,
        headers: headers
    });
}

// Répondre aux requêtes OPTIONS (CORS)
export function OPTIONS() {
    return createCorsResponse(new Response(null, { status: 204 }));
}
