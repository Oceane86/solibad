import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Autobids from "@/models/Autobids";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectToDB();

        const searchParams = new URL(req.url).searchParams;
        const id = searchParams.get("id");



        if (!mongoose.Types.ObjectId.isValid(id)) {
            return createCorsResponse(NextResponse.json({ error: "ID invalide." }, { status: 400 }));
        }


        const autobids = await Autobids.find({ userId: id }).sort({ amount: -1 });

        if (!autobids) {
            return createCorsResponse(NextResponse.json({ error: "Élément non trouvé." }, { status: 404 }));
        }

        return createCorsResponse(NextResponse.json(autobids, { status: 200 }));
    } catch (error) {
        console.error("Erreur API:", error);
        return createCorsResponse(NextResponse.json({ error: "Erreur serveur." }, { status: 500 }));
    }
}

function createCorsResponse(response) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines (⚠️ à restreindre en prod)
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
}

export function OPTIONS() {
    return createCorsResponse(new NextResponse(null, { status: 204 }));
}
