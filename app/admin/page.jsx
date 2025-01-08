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
    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    return (
<<<<<<< Updated upstream
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
=======
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white shadow-md rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Créer une Nouvelle Enchère
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom de l'enchère
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Entrez le nom de l'enchère"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez l'enchère en détail"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 min-h-[120px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                Date de fin
                            </label>
                            <input
                                id="endDate"
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">
                                Prix de départ
                            </label>
                            <input
                                id="startingPrice"
                                type="number"
                                value={startingPrice}
                                onChange={(e) => setStartingPrice(e.target.value)}
                                placeholder="0.00 €"
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Image de l'enchère (facultatif)
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-10 h-10 text-gray-500 mb-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG ou WEBP (max. 5MB)</p>
                                    </div>
                                )}
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Erreur : </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Chargement...
                                </>
                            ) : (
                                "Créer l'enchère"
                            )}
                        </button>
                    </div>
                </form>

                {!loading && !error && (
                    <div className="mt-4">
                        <Link
                            href="/admin/auctions"
                            className="w-full block"
                        >
                        </Link>
                    </div>
                )}
            </div>
>>>>>>> Stashed changes
        </div>
    );
};

export default CreateAuction;