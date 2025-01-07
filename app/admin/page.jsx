// app/admin/page.jsx

'use client';

import { useState } from "react";
import Link from "next/link";
import NavBar from "@components/NavBar";

const CreateAuction = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startingPrice, setStartingPrice] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("endDate", endDate);
        formData.append("startingPrice", startingPrice);
        if (image) formData.append("image", image);

        try {
            const response = await fetch("/api/auction/create", {
                method: "POST",
                body: formData,
                headers: {
                    "user-id": localStorage.getItem("user-id"),
                },
            });

            const data = await response.json();
            if (response.ok) {
                setLoading(false);
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
            <NavBar/>
            <h1>Créer une Enchère</h1>
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
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
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
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Chargement..." : "Créer l'enchère"}
                </button>
            </form>
            {/* Redirection */}
            {!loading && !error && (
                <Link href="/admin/auctions">
                    <button>Voir les enchères</button>
                </Link>
            )}
        </div>
    );
};

export default CreateAuction;
