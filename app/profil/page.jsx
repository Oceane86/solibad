// app/profil/page.jsx
'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour.");
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite.");
    }
  };

  return (
      <>
        <Header page={"mon-compte"} />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
          <div className="flex items-center mb-6">
            <img
                src={user.image || "/assets/user_default.svg"}
                alt={user.username || "Utilisateur"}
                className="w-20 h-20 object-cover rounded-full mr-6"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.username || "Nom de l'utilisateur"}</h2>
              <p className="text-gray-600 text-sm">{user.email || "Email non disponible"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            <div className="mb-4">
              <label className="block mb-1">Nom d'utilisateur</label>
              <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={user.username || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Prénom</label>
              <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder={user.firstname || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Nom</label>
              <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder={user.lastname || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={user.email || ""}
                  className="w-full border rounded p-2"
              />
            </div>

            <h2 className="text-xl font-semibold mb-4">Adresse</h2>
            <div className="mb-4">
              <label className="block mb-1">Rue</label>
              <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder={user.address?.street || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Ville</label>
              <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder={user.address?.city || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">État</label>
              <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder={user.address?.state || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Pays</label>
              <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  placeholder={user.address?.country || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Code postal</label>
              <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                  placeholder={user.address?.postalCode || ""}
                  className="w-full border rounded p-2"
              />
            </div>
            <button
                type="submit"
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sauvegarder
            </button>
          </form>
          <button
              onClick={() => signOut()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Se déconnecter
          </button>
        </div>
      </>
  );
}
