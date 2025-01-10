// app/api/mail/subscribe/route.js

import { NextResponse } from "next/server";
import { connectToDB } from "../../../utils/mongodb";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // Extraire les données de la requête
    const body = await request.json();
    const { email, auctionId } = body; 

    // Validation basique de l'e-mail
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Email invalide. Veuillez vérifier votre saisie." },
        { status: 400 }
      );
    }

    // Connexion à la base de données
    const { db } = await connectToDB();

    await db.collection("subscribers").insertOne({ email, auctionId });

    // Message de succès immédiat
    return NextResponse.json(
      { message: "Votre abonnement a été enregistré avec succès !" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    return NextResponse.json(
      // { message: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
