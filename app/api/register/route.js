// app/api/register/route.js
import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { hash } from "bcrypt"; // Import de bcrypt
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDB();

        const data = await req.json();
        const { username, email, password, status = "visiteur" } = data;

        // Validation de base
        if (!username || !email || !password) {
            return NextResponse.json({
                message: "Tous les champs sont obligatoires"
            }, { status: 400 });
        }

        // Vérification si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                message: "Cet email est déjà utilisé"
            }, { status: 400 });
        }

        // Hashage du mot de passe avec bcrypt (10 tours)
        const hashedPassword = await hash(password, 10);

        // Création du nouvel utilisateur avec le mot de passe hashé
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Utilisation du mot de passe hashé
            status
        });

        await newUser.save();

        return NextResponse.json({
            message: "Inscription réussie !"
        }, { status: 201 });

    } catch (error) {
        console.error("Erreur serveur:", error);
        return NextResponse.json({
            message: "Erreur lors de l'inscription"
        }, { status: 500 });
    }
}