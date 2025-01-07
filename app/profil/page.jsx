// app/profil/page.jsx

'use client';

import NavBar from "@components/NavBar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <p>Veuillez vous connecter pour voir votre profil.</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="container mx-auto p-4">
      <NavBar/>
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <div className="bg-white shadow-sm rounded p-6 mb-4">
        <div className="flex items-center mb-6">
          <img
            src={user.image || "/images/default-avatar.jpg"}
            alt={user.name || "Utilisateur"}
            className="w-20 h-20 object-cover rounded-full mr-6"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name || "Nom de l'utilisateur"}</h2>
            <p className="text-gray-600 text-sm">{user.email || "Email non disponible"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
