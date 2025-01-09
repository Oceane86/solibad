// app/admin/edit/[id]/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

  // Chargement de l'enchère
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

  // Fonction pour supprimer l'enchère
  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette enchère ?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/auction/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("L'enchère a été supprimée avec succès !");
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Gestion du formulaire
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

  // Redirection si l'utilisateur n'est pas authentifié
  if (status === "unauthenticated") {
    return <p>Vous devez être connecté pour accéder à cette page.</p>;
  }

  // Affichage du chargement
  if (loading && !item) {
    return <p>Chargement...</p>;
  }

  // Affichage du formulaire
  return (
    <div className="container mx-auto p-8">
      <h1>Modifier l'Enchère</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {item && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date de début</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Date de fin</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Prix initial</label>
            <input
              type="number"
              value={initialPrice}
              onChange={(e) => setInitialPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "En cours..." : "Mettre à jour"}
          </button>
        </form>
      )}
      
      {/* Bouton de suppression */}
      <div>
        <button onClick={handleDelete} disabled={loading}>
          {loading ? "Suppression en cours..." : "Supprimer l'enchère"}
        </button>
      </div>
    </div>
  );
};

export default EditAuction;
