// app/api/auction/edit/[id]/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/mongodb/database";
import Item from "@/models/Item";
import mongoose from "mongoose";

function transformRequestData(data) {
  return {
    name: data.name,
    description: data.description,
    imageURL: data.imageURL,
    initialPrice: data.initialPrice?.$numberInt
      ? parseInt(data.initialPrice.$numberInt, 10)
      : data.initialPrice,
    startDate: data.startDate?.$date?.$numberLong
      ? new Date(parseInt(data.startDate.$date.$numberLong, 10))
      : data.startDate,
    endDate: data.endDate?.$date?.$numberLong
      ? new Date(parseInt(data.endDate.$date.$numberLong, 10))
      : data.endDate,
    createdBy: data.createdBy?.$oid
      ? new mongoose.Types.ObjectId(data.createdBy.$oid)
      : data.createdBy,
  };
}

export async function PATCH(req, { params }) {
  const { id } = params;

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return createCorsResponse(
      NextResponse.json({ error: "Corps de la requête invalide." }, { status: 400 })
    );
  }

  // Validation de l'ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return createCorsResponse(
      NextResponse.json({ error: "ID invalide." }, { status: 400 })
    );
  }

  try {
    await connectToDB(); // Connexion à la base de données

    // Transformation des données reçues
    const transformedData = transformRequestData(requestBody);

    // Exécution de la mise à jour
    const result = await Item.updateOne({ _id: id }, { $set: transformedData });

    if (result.matchedCount === 0) {
      return createCorsResponse(
        NextResponse.json({ error: "Item non trouvé." }, { status: 404 })
      );
    }

    return createCorsResponse(
      NextResponse.json({ message: "Item mis à jour avec succès !" }, { status: 200 })
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'item:", error);
    return createCorsResponse(
      NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
    );
  }
}

// Fonction utilitaire pour gérer les CORS (Cross-Origin Resource Sharing)
function createCorsResponse(response) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Autorise toutes les origines (⚠️ à restreindre en production)
  response.headers.set("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// Fonction OPTIONS pour gérer les requêtes CORS
export function OPTIONS() {
  return createCorsResponse(new NextResponse(null, { status: 204 }));
}
