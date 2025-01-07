"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";

const DetailPage = ({ params }) => {
    const { id } = params;
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!id) {
            return <p>❌ Aucun ID trouvé. Vérifiez l'URL ou la configuration.</p>;
        }


        const fetchItem = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/items/select?id=${id}`);

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des données.");
                }

                const data = await response.json();
                setItem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

    return (
        <Suspense>
            <div>
                <h1>Page de détail</h1>
                <p><strong>ID reçu :</strong> {id}</p>
                {item && (
                    <>
                        <h2>{item.name}</h2>
                        <p><strong>Description :</strong> {item.description}</p>
                        <p><strong>Prix de départ :</strong> {item.startingPrice}</p>
                        <p><strong>Statut :</strong> {item.status}</p>
                        <p><strong>Date de début :</strong> {item.startDate}</p>
                        <p><strong>Date de fin :</strong> {item.endDate}</p>
                    </>
                )}
            </div>
        </Suspense>
    );
};

export default DetailPage;
