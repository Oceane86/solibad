// app/api/user/[id]/route.js

import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDB } from "@/mongodb/database";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const { id } = params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return NextResponse.json(
      { message: 'Erreur serveur. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}
