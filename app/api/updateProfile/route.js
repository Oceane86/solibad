// app/api/updateProfile/route.js
import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // Connexion à la base de données
    await connectToDB();

    // Vérification que la requête contient un corps valide
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { message: "Aucune donnée envoyée dans la requête." },
        { status: 400 }
      );
    }

    console.log("Données reçues :", data);

    const { username, email, address, city, state, country, postalCode } = data;

    // Vérification que les champs nécessaires sont présents
    if (!username || !email) {
      return NextResponse.json(
        { message: "Nom d'utilisateur et email sont obligatoires." },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Mise à jour des informations de l'utilisateur
    user.username = username;
    user.address = {
      street: address.street || user.address?.street || "",
      city: address.city || user.address?.city || "",
      state: address.state || user.address?.state || "",
      country: address.country || user.address?.country || "",
      postalCode: address.postalCode || user.address?.postalCode || "",
    };
    
    // Sauvegarde des modifications dans la base de données
    await user.save({ validateModifiedOnly: true });

    // Réponse de succès
    return NextResponse.json(
      { message: "Profil mis à jour avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur:", error.message);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}
