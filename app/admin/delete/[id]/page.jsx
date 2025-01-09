// app/admin/delete/[id]/page.jsx


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DeleteAuction = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

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

  return (
    <div className="container mx-auto p-8">
      <h1>Supprimer l'Enchère</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      
      <p>Êtes-vous sûr de vouloir supprimer cette enchère ?</p>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Suppression..." : "Supprimer l'enchère"}
      </button>
    </div>
  );
};

export default DeleteAuction;
