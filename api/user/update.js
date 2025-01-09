// app/api/user/update.js

import { connectToDB } from "@mongodb/database";
import User from "@models/User";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { userId, username, email, address, city, state, country, postalCode } = req.body;

    try {
    await connectToDB();

      const user = await User.findByIdAndUpdate(
        userId,
        { username, email, address, city, state, country, postalCode },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur du serveur" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
