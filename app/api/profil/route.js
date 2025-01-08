// app/api/profil/route.js

import { connectToDB } from "@/mongodb/database";
import User from "@/models/User";
export const dynamic = "force-dynamic";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: "Utilisateur non trouvé." }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
