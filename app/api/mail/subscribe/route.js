// app/api/mail/subscribe/route.js


import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Extraire les données de la requête
    const body = await request.json();
    const { email } = body;

    // Validation basique de l'e-mail
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Email invalide. Veuillez vérifier votre saisie." },
        { status: 400 }
      );
    }

    // Simuler une action (enregistrement dans la base de données ou envoi d'e-mail)
    // Exemple : Sauvegarder dans une base de données MongoDB
    // const client = await connectToDatabase();
    // const db = client.db("yourDatabase");
    // await db.collection("subscribers").insertOne({ email });

    // Pour cet exemple, nous retournons simplement une réponse de succès
    return NextResponse.json(
      { message: "Votre abonnement a été enregistré avec succès !" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    return NextResponse.json(
      { message: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
