'use client';

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";

const DetailPage = () => {
    const params = useParams();
    const [id, setId] = useState(null);
    const [item, setItem] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // State pour gérer l'affichage de la popup

    useEffect(() => {
        const resolveParamsAndFetchItem = async () => {
            try {
                const resolvedId = await params.id;
                setId(resolvedId);

                // Récupérer les données liées à l'ID
                const response = await fetch(`/api/items/select?id=${resolvedId}`);
                const data = await response.json();
                setItem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        resolveParamsAndFetchItem();
    }, [params]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

    const getMessageDate = () => {
        if (!item || !item.startDate || !item.endDate) {
            return "❌ Les dates fournies ne sont pas valides.";
        }

        const estDateValide = (date) => !isNaN(Date.parse(date));
        const debut = new Date(item.startDate);
        const fin = new Date(item.endDate);

        if (!estDateValide(debut) || !estDateValide(fin)) {
            return "❌ Les dates fournies ne sont pas valides.";
        }

        if (debut > Date.now()) {
            return "⚫ Cette enchère n'est pas encore disponible.";
        } else if (fin < Date.now()) {
            return "🔴 Cette enchère est terminée.";
        } else {
            return `🟢 Du ${debut.toLocaleDateString()} au ${fin.toLocaleDateString()}`;
        }
    };

    const messageDate = getMessageDate();

    // Fonction pour afficher ou masquer la popup
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <Suspense>
            <div className="m-4">
                <a href="/" className="underline mb-3">Revenir à la liste</a>
                {item && (
                    <>
                        <div className="mt-6 sm:flex sm:flex-col sm:items-center">
                            <div className="flex flex-col items-center sm:flex-row sm:gap-20 lg:gap-60 xl:gap-x-9 ">
                                <img src={item.imageURL} alt={item.name} className="w-full rounded-xl max-w-96 xl:max-w-[500px]"/>

                                <div className="sm:flex-col items-start xl:p-20">
                                    <div className=" mt-6">
                                        <p>Dernière enchère:</p>
                                        <div className=" xl:flex xl:flex-row gap-10">
                                            <p className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-red-500 text-white rounded-lg text-center">{item.initialPrice}€</p>
                                            <p 
                                                onClick={togglePopup} // Afficher la popup lorsqu'on clique
                                                className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-gray-50 border-2 rounded-lg text-center mt-6 xl:mt-0 cursor-pointer"
                                            >
                                                Enchèrir
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4">Prix de réserve : {item.initialPrice}€</p>
                                    <p className="mt-4">{ messageDate }</p>
                                </div>
                            </div>

                            <div className="flex flex-col xl:flex-row xl:gap-10">
                                <div className="flex flex-col">
                                    <div className="mt-8 p-6 bg-red-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] ">
                                        <h2 className="text-2xl font-bold text-gray-800">RÈGLEMENT :</h2>
                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p><strong>🔄 Prolongation des enchères :</strong> À chaque nouvelle enchère dans les 5 dernières minutes, un compte à rebours de 5 minutes est réinitialisé.</p>
                                            <p><strong>💰 Enchères minimales après un temps prolongé :</strong> Si l'enchère dépasse 30 minutes après l’heure de fin annoncée, l’incrémentation minimale passe à <span className="font-semibold">50 USD</span>.</p>
                                            <p><strong>🎯 Enchère automatique :</strong> Les participants peuvent définir un montant maximum dès le début. Le système surenchérit automatiquement avec un incrément de leur choix (ex: +10€) jusqu’au plafond défini.</p>
                                            <p><strong>📝 Inscription :</strong> Un formulaire simple permet de s’inscrire en vérifiant l’authenticité des participants :</p>
                                            <ul className="ml-6 list-disc">
                                                <li>Nom, Prénom</li>
                                                <li>Ville / Pays</li>
                                                <li>Email et téléphone (non visibles publiquement)</li>
                                            </ul>
                                            <p><strong>📅 Agenda des enchères :</strong> Un calendrier des prochaines enchères est disponible.</p>
                                            <p><strong>⚠️ Engagement :</strong> En validant une enchère, le participant s'engage à effectuer le paiement en cas de gain.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] h-fit ">
                                        <h2 className="text-2xl font-bold text-gray-800">DESCRIPTIF :</h2>
                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p className="text-lg font-semibold">{item.name}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Popup */}
                        {showPopup && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                                    <h2 className="text-xl font-bold mb-4">Confirmation de l'enchère</h2>
                                    <p>Voulez-vous vraiment enchérir pour {item.name} à {item.initialPrice}€ ?</p>
                                    <div className="mt-4 flex justify-between">
                                        <button 
                                            onClick={togglePopup}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg">Annuler</button>
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Confirmer</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Suspense>
    );
};

export default DetailPage;
