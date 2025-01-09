// app/admin/create/page.jsx

'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 

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
    <div className="container">
      <h1>Créer une Enchère</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom de l'enchère</label>
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
          <label>Prix de départ</label>
          <input
            type="number"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Ajouter une image (facultatif)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Créer l'enchère"}
        </button>
      </form>
      {!loading && !error && !successMessage && (
        <Link href="/">
          <button>Voir les enchères</button>
        </Link>
      )}
    </div>
  );
};

export default CreateAuction;
