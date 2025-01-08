"use client";
import { useEffect, useState } from "react";
import Card from "../components/card/card";

const Home = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`/api/items/select`);

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
    }, []);

    return (
        <>
            <div className="container mx-auto p-8">
                {loading && <p>Chargement des enchères...</p>}  {}
                {error && <p style={{ color: "red" }}>❌ {error}</p>}  {}

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <Card
                                key={item._id}
                                id={item._id}
                                title={item.name}
                                startDate={item.startDate}
                                endDate={item.endDate}
                                imageURL={item.imageURL}
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
