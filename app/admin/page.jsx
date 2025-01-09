// app/admin/page.jsx

'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (status === "loading") return;

      if (status !== "authenticated") {
        router.push("/login");
        return;
      }

      // Vérification si l'utilisateur a le rôle "admin"
      if (session.user.role !== "admin") {
        setRedirectMessage("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");
        setTimeout(() => {
          router.push("/"); // Redirige après 3 secondes
        }, 3000);
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
  }, [status, session, router]);

  if (redirectMessage) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-500 text-lg">{redirectMessage}</p>
        <p>Vous serez redirigé vers l'accueil dans quelques secondes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Mes Enchères</h1>

      {/* Bouton de création d'enchère en haut */}
      {!loading && !error && (
        <Link href="/admin/create">
          <button className="bg-green-500 text-white px-4 py-2 rounded mb-6 hover:bg-green-600 transition duration-300">
            Créer une nouvelle enchère
          </button>
        </Link>
      )}

      {loading && <p>Chargement des enchères...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg shadow-lg bg-white">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              
              {/* Limitation de la description à 3 lignes avec troncage */}
              <p className="text-gray-600 mt-2 line-clamp-3">{item.description}</p>
              
              <p className="mt-4 text-gray-800">
                <strong>Prix de départ:</strong> {item.initialPrice}€
              </p>
              <p className="text-gray-800">
                <strong>Début:</strong> {new Date(item.startDate).toLocaleString()}
              </p>
              <p className="text-gray-800">
                <strong>Fin:</strong> {new Date(item.endDate).toLocaleString()}
              </p>

              <div className="mt-4">
                <Link href={`/admin/edit/${item._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
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
    </div>
  );
};

export default AdminPage;
