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
            return NextResponse.json(items, { status: 200 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "ID invalide." }, { status: 400 });
        }

        const item = await Item.findById(id);

        if (!item) {
            return NextResponse.json({ error: "Élément non trouvé." }, { status: 404 });
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.error("Erreur API:", error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}
