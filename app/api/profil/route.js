// app/api/profil/route.js


import { connectToDB } from "@/mongodb/database"; 
import User from "@/models/User";

export default async function handler(req, res) {
  const { method } = req;

  await connectToDB();

  if (method === "GET") {
    try {
      const user = await User.findOne({ email: req.query.email });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "Méthode non autorisée." });
  }
}
