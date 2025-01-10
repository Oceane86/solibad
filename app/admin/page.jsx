// app/admin/edit/[id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const EditAuction = ({ params }) => {
  const { data: session, status } = useSession();
  const [item, setItem] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [initialPrice, setInitialPrice] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/items/select?id=${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'enchère.");
        }
        const data = await response.json();
        setItem(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setStartDate(new Date(data.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(data.endDate).toISOString().slice(0, 16));
        setInitialPrice(data.initialPrice || 0);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchItem();
  }, [id, status]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette enchère ?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/auction/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("L'enchère a été supprimée avec succès !");
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const data = {
      name,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      initialPrice: Number(initialPrice),
    };

    try {
      const response = await fetch(`/api/auction/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue.");
      }

      setSuccessMessage("L'enchère a été mise à jour avec succès !");
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated") {
    return <p className="text-center text-red-500">Vous devez être connecté pour accéder à cette page.</p>;
  }

  if (loading && !item) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold text-left mb-6">Modifier l'Enchère</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        {item && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="font-medium">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border rounded px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border rounded px-4 py-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-medium">Date de début</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="border rounded px-4 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Date de fin</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="border rounded px-4 py-2"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Prix initial</label>
              <input
                type="number"
                value={initialPrice}
                onChange={(e) => setInitialPrice(e.target.value)}
                required
                className="border rounded px-4 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "En cours..." : "Mettre à jour"}
            </button>
          </form>
        )}
        <div className="mt-6">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Suppression en cours..." : "Supprimer l'enchère"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditAuction;
