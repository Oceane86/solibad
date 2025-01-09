import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Autobids from "@/models/Autobids";
import mongoose from "mongoose";

export async function DELETE(req) {
    try {
        await connectToDB();

        let searchParams = new URL(req.url, "http://localhost").searchParams;
        let idUser = searchParams.get("idUser");
        let idItem = searchParams.get("idItem");

        if (!mongoose.Types.ObjectId.isValid(idUser)) {
            throw new Error("L'ID utilisateur fourni n'est pas valide");
        }
        if (!mongoose.Types.ObjectId.isValid(idItem)) {
            throw new Error("L'ID de l'article fourni n'est pas valide");
        }

        const result = await Autobids.deleteOne({ userId: idUser, itemId: idItem });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Aucune enchère automatique trouvée pour suppression." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Enchère automatique supprimée." }, { status: 200 });
    } catch (error) {
        console.error("Erreur dans DELETE /api/autobids/delete:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
