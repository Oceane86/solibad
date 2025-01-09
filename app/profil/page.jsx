// app/profil/page.jsx
"use client";

import Header from "@/components/Header";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditProfileForm from "@/components/EditProfileForm";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });
  const [activeTab, setActiveTab] = useState("information");

  // Effect pour charger les données utilisateur depuis l'API
  useEffect(() => {
    if (session?.user) {
      // Récupération des données utilisateur depuis l'API
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (!response.ok) throw new Error("Erreur lors de la récupération des données.");
          const data = await response.json();
          setFormData({
            username: data.username || "",
            email: data.email || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              country: data.address?.country || "",
              postalCode: data.address?.postalCode || "",
            },
          });
        } catch (error) {
          console.error("Erreur lors du chargement des données utilisateur:", error);
        }
      };

      fetchUserData();
    }
  }, [session]);

  if (status === "loading") return <p>Chargement...</p>;

  if (!session)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
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
      const response = await fetch("/api/profil/update", {
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
    <div className="container mx-auto p-4">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      <div className="tabs">
        <ul className="flex space-x-4 border-b">
          <li
            className={`tab tab-bordered ${activeTab === "information" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("information")}
          >
            Modifier mes informations
          </li>
          <li
            className={`tab tab-bordered ${activeTab === "profil" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("profil")}
          >
            Profil
          </li>
        </ul>

        <div className="tab-content mt-6">
          {activeTab === "information" && (
            <EditProfileForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          )}
          {activeTab === "profil" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mes informations :</h2>
              <p><strong>Nom d'utilisateur:</strong> {formData.username}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <h3 className="mt-4 font-semibold">Adresse :</h3>
              {Object.entries(formData.address).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => signOut()}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Se déconnecter
      </button>
    </div>
  );
}
