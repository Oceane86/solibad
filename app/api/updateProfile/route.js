// app/api/updateProfile/route.js

import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const { username, email, address, city, state, country, postalCode } = data;

    if (!username || !email) {
      return NextResponse.json(
        { message: "Nom d'utilisateur et email sont obligatoires." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    user.username = username;
    user.address = {
      street: address || user.address?.street || "",
      city: city || user.address?.city || "",
      state: state || user.address?.state || "",
      country: country || user.address?.country || "",
      postalCode: postalCode || user.address?.postalCode || "",
    };

    await user.save({ validateModifiedOnly: true });

    return NextResponse.json(
      { message: "Profil mis à jour avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du profil." },
      { status: 500 }
    );
  }
}
