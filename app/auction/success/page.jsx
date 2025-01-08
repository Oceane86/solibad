// app/auction/succes/page.jsx

"use client";
import { useEffect, useState } from "react";
import NavBar from "@components/NavBar";
import Card from "@app/component/card";

const Home = () => {
    const [items, setItems] = useState([]);  // ✅ Stocke les données récupérées
    const [error, setError] = useState(null); // ✅ Stocke les erreurs
    const [loading, setLoading] = useState(true); // ✅ Indique si les données sont en train de charger

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/items/select`);

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des données.");
                }

                const data = await response.json();
                setItems(data);  // ✅ Met à jour l'état avec les données récupérées
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems(); // ✅ Appel de la fonction au montage du composant
    }, []);

    return (
        <>
            <div className="container mx-auto p-8">
                <p style={{color:"green"}}> L'ecnhère a bien été créée</p>
                {loading && <p>Chargement des enchères...</p>}  {/* ✅ Gestion du chargement */}
                {error && <p style={{ color: "red" }}>❌ {error}</p>}  {/* ✅ Affichage des erreurs */}

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <Card
                                key={item._id}
                                id={item._id}
                                title={item.name}
                                limitDate={item.endDate}
                                imageUrl={item.imagePath}
                                status={item.status}
                            />
                        ))
                    ) : (
                        !loading && <p>Aucune enchère disponible.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
