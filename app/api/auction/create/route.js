// app/api/auction/create/route.js

import { connectToDB } from "@/mongodb/database";
import Item from "@/models/Item";
import User from "@/models/User";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import { getSession } from "next-auth/react";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        await connectToDB();

        const data = await req.formData();
        const { name, description, endDate, startDate, image } = Object.fromEntries(data.entries());

        console.log("Données du formulaire:", { name, description, endDate, startDate, image });

        const session = await getSession();
        console.log("Session récupérée :", session); 

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { message: "Utilisateur non authentifié." },
                { status: 401 }
            );
        }


        const user = await User.findOne({ email: session.user.email });
        console.log("Utilisateur trouvé :", user);

        if (!user || user.status !== "admin") {
            console.log("Utilisateur non admin ou non trouvé :", user);
            return NextResponse.json(
                { message: "Seuls les administrateurs peuvent créer des enchères." },
                { status: 403 }
            );
        }

        if (!name || !description || !endDate || !startDate) {
            return NextResponse.json(
                { message: "Tous les champs requis doivent être remplis." },
                { status: 400 }
            );
        }

        const endDateParsed = new Date(endDate);
        if (isNaN(endDateParsed)) {
            return NextResponse.json(
                { message: "Date de fin invalide." },
                { status: 400 }
            );
        }

        const initialPriceParsed = parseFloat(initialPrice);
        if (isNaN(initialPrice) || initialPriceParsed <= 0) {
            return NextResponse.json(
                { message: "Le prix de départ doit être un nombre valide." },
                { status: 400 }
            );
        }

        let imagePath = "assets/default-item-image.png"; 
        if (image && image.size > 0) {
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
                console.error("Erreur lors du téléchargement de l'image :", uploadError);
                return NextResponse.json(
                    { message: "Erreur lors de l'upload de l'image." },
                    { status: 500 }
                );
            }
        }

        const newItem = new Item({
            name,
            description,
            endDate: endDateParsed,
            initialPrice: initialPriceParsed,
            creator: user.id, 
            imageURL, 
        });

        await newItem.save();

        return NextResponse.json(
            { message: "Enchère créée avec succès." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de la création de l'enchère:", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur." },
            { status: 500 }
        );
    }
}
