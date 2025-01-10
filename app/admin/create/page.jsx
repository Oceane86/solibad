// app/admin/create/page.jsx

'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import Header from "@/components/Header";

const CreateAuction = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [initialPrice, setInitialPrice] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); 

  const isAuthenticated = status === "authenticated"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(""); 

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour créer une enchère.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("endDate", endDate);
    formData.append("startDate", startDate);
    formData.append("initialPrice", initialPrice);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/auction/create", {
        method: "POST",
        body: formData,
        headers: {
          "user-id": localStorage.getItem("user-id"),
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("L'enchère a été créée avec succès !");
        setLoading(false);
        setTimeout(() => {
          router.push("/"); // Redirection vers la page d'enchères après un délai
        }, 2000); // 2 secondes pour afficher le message de succès
      } else {
        setError(data.message || "Une erreur est survenue.");
        setLoading(false);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      setLoading(false);
    }
  };

  return (
  <><Header />
  <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Créer une Enchère</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Nom de l'enchère</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">Date de début</label>
          <input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">Date de fin</label>
          <input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="initialPrice" className="block text-sm font-semibold text-gray-700">Prix de départ</label>
          <input
            id="initialPrice"
            type="number"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">Ajouter une image (facultatif)</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Chargement..." : "Créer l'enchère"}
          </button>
        </div>
      </form>

      {!loading && !error && !successMessage && (
        <div className="mt-6 text-center">
          <Link href="/">
            <button className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg shadow-sm hover:bg-gray-400 transition duration-300">
              Voir les enchères
            </button>
          </Link>
        </div>
      )}
    </div></>
  );
};

export default CreateAuction;
