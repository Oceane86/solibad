// app/api/auction/delete/[id]/route.js


import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Item from "@/models/Item";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  const { id } = params;

  // Validation de l'ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  try {
    await connectToDB(); // Connexion à la base de données

    // Suppression de l'item
    const result = await Item.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item non trouvé." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item supprimé avec succès !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'item:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
