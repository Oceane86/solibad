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
            <div className="m-4">
                <a href="/" className="underline mb-3">Revenir à la liste</a>
                {item && (
                    <>
                        <img src={item.imageURL} alt={item.name} className="w-full rounded-xl" />
                        <div className="mt-4 flex flex-col">
                            <p className="px-4 py-2 bg-red-600 w-fit">Enchère actuelle: 236 €</p>
                            <h1 className="text-2xl font-bold">Mise à prix: {item.initialPrice} €</h1>
                        </div>
                        </>
                        )}
                    </div>
                    </Suspense>
                    );
                };

                export default DetailPage;
