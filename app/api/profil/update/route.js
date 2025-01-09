// app/api/profil/update/route.js
import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Méthode GET : Récupérer les informations d'un utilisateur
export async function GET(req) {
  try {
    // Connexion à la base de données
    await connectToDB();

    // Récupération des paramètres de la requête (email)
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email est obligatoire pour récupérer les informations." },
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

    // Réponse avec les données utilisateur
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des informations :", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des informations." },
      { status: 500 }
    );
  }
}

// Méthode PUT : Mettre à jour les informations d'un utilisateur
export async function PUT(req) {
  try {
    // Connexion à la base de données
    await connectToDB();

    // Extraction des données envoyées dans la requête
    const data = await req.json();
    console.log("Données reçues :", data);

    const { username, email, address, firstname, lastname } = data;

    // Vérification que les champs nécessaires sont présents
    if (!username || !email) {
      return NextResponse.json(
        { message: "Nom d'utilisateur et email sont obligatoires." },
        { status: 400 }
      );
    }

    // Validation de l'email
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

    // Mise à jour des champs utilisateur
    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;

    if (address) {
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
    console.error("Erreur serveur :", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}
