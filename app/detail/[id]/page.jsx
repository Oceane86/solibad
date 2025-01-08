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
                const response = await fetch(`/api/items/select?id=${id}`);

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
                        <div className="mt-6 sm:flex sm:flex-col sm:items-center">
                            <div className="flex flex-col items-center sm:flex-row sm:gap-20 lg:gap-60 xl:gap-x-9 ">
                                <img src={item.imageURL} alt={item.name} className="w-full rounded-xl max-w-96 xl:max-w-[500px]"/>



                                <div className="sm:flex-col items-start xl:p-20">
                                    <div className=" mt-6">
                                        <p>Dernière enchère:</p>
                                        <div className=" xl:flex xl:flex-row gap-10">
                                            <p className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-red-500 text-white rounded-lg text-center">{item.initialPrice}€</p>
                                            <p className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-gray-50 border-2 rounded-lg text-center mt-6 xl:mt-0">Enchèrir</p>
                                        </div>

                                    </div>
                                    <p className="mt-4">Prix de réserve : {item.initialPrice}€</p>
                                    <p className="mt-4">Du {new Date(item.startDate).toLocaleDateString()} au {new Date(item.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-col xl:flex-row xl:gap-10">
                                <div className="flex flex-col">
                                    <div
                                        className="mt-8 p-6 bg-red-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] ">
                                        <h2 className="text-2xl font-bold text-gray-800">RÈGLEMENT :</h2>

                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p>
                                                <strong>🔄 Prolongation des enchères :</strong> À chaque nouvelle enchère
                                                dans
                                                les 5 dernières minutes, un compte à rebours de 5 minutes est
                                                réinitialisé.
                                                L’enchère est définitivement close une fois ce délai écoulé sans
                                                nouvelle
                                                mise.
                                            </p>

                                            <p>
                                                <strong>💰 Enchères minimales après un temps prolongé :</strong> Si
                                                l'enchère
                                                dépasse 30 minutes après l’heure de fin annoncée, l’incrémentation
                                                minimale
                                                passe à <span className="font-semibold">50 USD</span>.
                                            </p>

                                            <p>
                                                <strong>🎯 Enchère automatique :</strong> Les participants peuvent
                                                définir un
                                                montant maximum dès le début. Le système surenchérit automatiquement
                                                avec un
                                                incrément de leur choix (ex: +10€) jusqu’au plafond défini.
                                            </p>

                                            <p>
                                                <strong>📝 Inscription :</strong> Un formulaire simple permet de
                                                s’inscrire
                                                en
                                                vérifiant l’authenticité des participants :
                                            </p>
                                            <ul className="ml-6 list-disc">
                                                <li>Nom, Prénom</li>
                                                <li>Ville / Pays</li>
                                                <li>Email et téléphone (non visibles publiquement)</li>
                                            </ul>

                                            <p>
                                                <strong>📅 Agenda des enchères :</strong> Un calendrier des prochaines
                                                enchères
                                                est disponible. Les participants peuvent activer une notification email
                                                pour
                                                être informés des futures ventes.
                                            </p>

                                            <p>
                                                <strong>⚠️ Engagement :</strong> En validant une enchère, le participant
                                                s'engage à effectuer le paiement en cas de gain.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-8 p-6 bg-red-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] ">
                                        <h2 className="text-2xl font-bold text-gray-800">Acheter</h2>
                                        <p>En toute sécurité</p>

                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p>Soyez confiants en achetant au travers de notre place de marché. Les vendeurs sont payés une fois que vous avez validé la réception de vos commandes.</p>
                                            <p>Tous les paiements sont effectués par virement bancaire. Les instructions seront fournies immédiatement après la fin de l'enchère. Vous disposez alors de 2 jours ouvrés pour effectuer le paiement. La TVA, le cas échéant, est due sur toutes les commandes.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div
                                        className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] h-fit ">
                                    <h2 className="text-2xl font-bold text-gray-800">DESCRIPTIF :</h2>

                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p className="text-lg font-semibold">{item.name}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] h-fit ">
                                        <h2 className="text-2xl font-bold text-gray-800">Comment ça marche ?</h2>
                                        <p>100% en ligne</p>
                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p className="text-lg font-semibold">✅ Enchérissez et remportez une
                                                offre</p>
                                            <p className="text-lg font-semibold">✅ Validation de l’enchère par le
                                                vendeur</p>
                                            <p className="text-lg font-semibold">✅ Payez par virement sous 48h</p>
                                            <p className="text-lg font-semibold">✅ Enlevez ou faites-vous livrer
                                                votre lot</p>
                                            <p className="text-lg font-semibold">✅ Vérifiez votre commande à la
                                                réception</p>

                                        </div>
                                    </div>
                                </div>

                            </div>


                        </div>


                    </>
                )}
            </div>
        </Suspense>
    );
};

export default DetailPage;
