// app/api/auth/[...nextauth].js

import { connectToDB } from "@/mongodb/database";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        await connectToDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Email ou mot de passe incorrect.");
        }

        // Vérification du mot de passe
        const isMatch = await compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Email ou mot de passe incorrect.");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        console.log("Session callback:", session);
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.profileImagePath = sessionUser.profileImagePath || null;
          session.user.role = sessionUser.role || "visiteur";
        } else {
          session.user.id = null;
          session.user.profileImagePath = null;
          session.user.role = "invité";
        }

        return session;
      } catch (error) {
        console.error("Erreur dans le callback de session:", error);
        return session;
      }
    },

    async signIn({ account, profile }) {
      if (account.provider === "google") {
        try {
          await connectToDB();

          // Vérification si l'utilisateur existe
          let user = await User.findOne({ email: profile.email });
          if (!user) {
            // Création d'un nouvel utilisateur Google
            user = await User.create({
              email: profile.email,
              username: profile.name,
              profileImagePath: profile.picture,
              isGoogleUser: true,
              role: "visiteur",
            });
          }

          return true;
        } catch (error) {
          console.error("Erreur lors de la connexion avec Google:", error.message);
          return false;
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
