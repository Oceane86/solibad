import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Item from "@/models/Item";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectToDB();

        const searchParams = new URL(req.url).searchParams;
        const id = searchParams.get("id");

        if (!id) {
            const items = await Item.find(); // Récupère tous les items
            return createCorsResponse(NextResponse.json(items, { status: 200 }));
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createCorsResponse(NextResponse.json({ error: "ID invalide." }, { status: 400 }));
        }

        const item = await Item.findById(id);

        if (!item) {
            return createCorsResponse(NextResponse.json({ error: "Élément non trouvé." }, { status: 404 }));
        }

        return createCorsResponse(NextResponse.json(item, { status: 200 }));
    } catch (error) {
        console.error("Erreur API:", error);
        return createCorsResponse(NextResponse.json({ error: "Erreur serveur." }, { status: 500 }));
    }
}

// 🔹 Fonction pour gérer les headers CORS
function createCorsResponse(response) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines (⚠️ à restreindre en prod)
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
}

// 🔹 Gestion de la requête OPTIONS (prévol CORS)
export function OPTIONS() {
    return createCorsResponse(new NextResponse(null, { status: 204 }));
}
