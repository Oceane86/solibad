// app/admin/page.jsx

'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      // Vérifier si l'utilisateur est authentifié
      if (status === "loading") {
        return; // Attendre que le statut soit "authenticated" ou "unauthenticated"
      }

      if (status !== "authenticated") {
        setError("Vous devez être connecté pour voir vos enchères.");
        setLoading(false);
        return;
      }

      try {
        const userId = session.user?.id;
        const response = await fetch(`/api/items/select?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [status, session]); // Relancer la requête lorsque le statut ou la session change

  return (
    <div className="container mx-auto p-8">
      <h1>Mes Enchères</h1>
      {loading && <p>Chargement des enchères...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="border p-4">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Prix de départ: {item.initialPrice}€</p>
              <p>Début: {new Date(item.startDate).toLocaleString()}</p>
              <p>Fin: {new Date(item.endDate).toLocaleString()}</p>

              <div className="mt-4">
                <Link href={`/admin/edit/${item._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Modifier
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>Aucune enchère disponible.</p>
        )}
      </div>

      {!loading && !error && (
        <Link href="/admin/create">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Créer une nouvelle enchère</button>
        </Link>
      )}
    </div>
  );
};

export default AdminPage;
