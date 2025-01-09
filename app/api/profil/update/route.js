// app/api/profil/update/route.js
import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // Connexion à la base de données
    await connectToDB();

    // Extraction des données envoyées dans la requête
    const data = await req.json();
    console.log("Données reçues :", data);

    const { username, email, address } = data;

    // Vérification que les champs nécessaires sont présents
    if (!username || !email) {
      return NextResponse.json(
        { message: "Nom d'utilisateur et email sont obligatoires." },
        { status: 400 }
      );
    }

    // Validation de l'email (ajoute une vérification simple de l'email)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "L'email fourni n'est pas valide." },
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

    // Mise à jour du nom d'utilisateur et de l'adresse
    user.username = username;

    if (address) {
      // Mise à jour de l'adresse (ajoute des vérifications pour chaque champ)
      user.address = {
        street: address.street || user.address?.street || "",
        city: address.city || user.address?.city || "",
        state: address.state || user.address?.state || "",
        country: address.country || user.address?.country || "",
        postalCode: address.postalCode || user.address?.postalCode || "",
      };
    }

    // Sauvegarde des modifications dans la base de données
    await user.save({ validateModifiedOnly: true });

    // Réponse de succès
    return NextResponse.json(
      { message: "Profil mis à jour avec succès." },
      { status: 200 }
    );
  } catch (error) {
    // En cas d'erreur serveur
    console.error("Erreur serveur:", error.message, error.stack);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}
