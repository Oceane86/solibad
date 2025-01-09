// app/admin/page.jsx

'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
          router.push("/");
        }, 3000); // Redirige après 3 secondes
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
