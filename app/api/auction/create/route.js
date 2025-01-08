// app/api/auction/create/route.js

import { getServerSession } from "next-auth";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import { connectToDB } from "@/mongodb/database";
import Item from "@/models/Item";
import User from "@/models/User";
import { NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Connexion à la base de données
    await connectToDB();

    // Récupération de la session de l'utilisateur
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Utilisateur non authentifié." }, { status: 401 });
    }

    // Vérification si l'utilisateur existe dans la base de données
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    // Récupération des données du formulaire
    const data = await req.formData();
    const { name, description, endDate, startDate, image, initialPrice } = Object.fromEntries(data.entries());

    // Validation des champs requis
    if (!name || !description || !endDate || !startDate || !initialPrice) {
      return NextResponse.json({ message: "Tous les champs requis doivent être remplis." }, { status: 400 });
    }

    // Validation des dates
    const startDateParsed = new Date(startDate);
    const endDateParsed = new Date(endDate);
    if (isNaN(startDateParsed)) {
      return NextResponse.json({ message: "Date de début invalide." }, { status: 400 });
    }
    if (isNaN(endDateParsed)) {
      return NextResponse.json({ message: "Date de fin invalide." }, { status: 400 });
    }
    if (endDateParsed <= startDateParsed) {
      return NextResponse.json({ message: "La date de fin doit être ultérieure à la date de début." }, { status: 400 });
    }

    // Validation du prix initial
    const initialPriceParsed = parseFloat(initialPrice);
    if (isNaN(initialPriceParsed) || initialPriceParsed <= 0) {
      return NextResponse.json({ message: "Le prix de départ doit être un nombre valide." }, { status: 400 });
    }

    // Gestion de l'image
    let imagePath = "/assets/No_Image_Available.jpg";
    if (image && typeof image.size === "number" && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const stream = Readable.from(buffer);

      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "auction_items" },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });

        if (uploadResult?.secure_url) {
          imagePath = uploadResult.secure_url;
        } else {
          throw new Error("Échec de l'upload de l'image.");
        }
      } catch (uploadError) {
        console.error("Erreur lors de l'upload de l'image:", uploadError);
        return NextResponse.json({ message: "Erreur lors de l'upload de l'image." }, { status: 500 });
      }
    }

    // Création de l'enchère
    const newItem = new Item({
      name,
      description,
      startDate: startDateParsed,
      endDate: endDateParsed,
      initialPrice: initialPriceParsed,
      createdBy: user._id,
      imageURL: imagePath,
    });

    await newItem.save();
    return NextResponse.json({ message: "Enchère créée avec succès." }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'enchère:", error);
    return NextResponse.json({ error: error.message || "Erreur interne du serveur." }, { status: 500 });
  }
}
