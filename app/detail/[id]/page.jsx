// app/detail/[id]/page.jsx

'use client';

import {Suspense, useEffect, useRef, useState} from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import Header from "@/components/Header";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

const DetailPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showCtaEncherir, setshowCtaEncherir] = useState(false);

    const { data: session } = useSession();
    const params = useParams();
    const [id, setId] = useState(null);
    const [item, setItem] = useState(null);
    const [bids, setBids] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usersOnline, setUsersOnline] = useState(0);
    const socketRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [bidAmount, setBidAmount] = useState(0);
    const [isAutoBids, setAutoBids] = useState(false);
    const [maxBid, setMaxBid] = useState(0);
    const [increment, setIncrement] = useState(0);

    // Récupération des données de l'enchère
    useEffect(() => {
        const fetchItem = async () => {
            if (!params.id) return; // Vérification de la présence d'un ID

            setId(params.id);
            try {
                const response = await fetch(`/api/items/select?id=${params.id}`);
                if (!response.ok) throw new Error("Erreur lors de la récupération des données");
                const data = await response.json();
                setItem(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [params.id]);

    // Récupération des bids de l'enchère
    useEffect(() => {
        const fetchBids = async () => {
            if (!params.id) return;

            setId(params.id);
            try {
                const response = await fetch(`/api/bids/select?id=${params.id}`);
                if (!response.ok) throw new Error("Erreur lors de la récupération des données");
                const data = await response.json();
                setBids(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, [params.id]);

    // Gestion du WebSocket avec Socket.io
    useEffect(() => {
        if (!id) return;

        console.log(`🛠 Initialisation du socket pour l'enchère ${id}`);

        if (!socketRef.current) {
            socketRef.current = io("wss://pauldecalf.fr", {
                path: "/socket.io/",
                transports: ["websocket", "polling"]
            });

            socketRef.current.emit("join_auction", id);
            console.log(`✅ Socket.io émis: join_auction ${id}`);

            socketRef.current.on("users_online", (count) => {
                console.log(`👥 Nombre d'enchérisseurs en ligne pour ${id}:`, count);
                setUsersOnline(count);
            });
        }

        return () => {
            console.log(`❌ Déconnexion du socket pour l'enchère ${id}`);
            if (socketRef.current) {
                socketRef.current.off("users_online");
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [id]);

    // Récupération des données de l'enchère automatique concernant l'utilisateur
    useEffect(() => {
        const fetchAutoBids = async () => {
            if (!session?.user.id) return;

            try {
                const response = await fetch(`/api/autobids/select?id=${session?.user.id}`);
                if (!response.ok) throw new Error("Erreur lors de la récupération des enchères automatiques.");
                const data = await response.json();

                if (data && data.length > 0) {
                    const autoBid = data.find((bid) => bid.itemId === id);
                    if (autoBid) {
                        setAutoBids(true);
                        setMaxBid(autoBid.maxBudget);
                        setIncrement(autoBid.increment);
                    }
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAutoBids();
    }, [session?.user.id, id]);

    // Vérification si l'utilisateur est connecté & si l'enchère est disponible
    useEffect(() => {
        if (item && session) {
            const debut = new Date(item.startDate);
            const fin = new Date(item.endDate);
            if (debut < Date.now() && fin > Date.now()) {
                setshowCtaEncherir(true);
            }
        }
    }, [item, session]);

    // Gestion des enchères en temps réel
    useEffect(() => {
        if (!id || !socketRef.current) return;

        socketRef.current.on("new_bid", (newBid) => {
            console.log("🔥 Nouvelle enchère reçue via WebSocket:", newBid);
            setBids((prevBids) => [...prevBids, newBid]);
        });

        return () => {
            socketRef.current.off("new_bid");
        };
    }, [id]);

    let nbBids = 0;
    if (bids) {
        nbBids = bids.length;
    }

    let enchereActuelle = 0;
    if (bids && bids.length > 0) {
        enchereActuelle = bids.reduce((max, bid) => bid.amount > max ? bid.amount : max, 0);
    } else if (item) {
        enchereActuelle = item.initialPrice;
    }

    const handleSubmitBid = async () => {
        if (!isChecked) return alert("Vous devez cocher la case pour enchérir.");
        if (isSubmitting) return;
        if (bidAmount <= enchereActuelle) return alert("L'enchère doit être supérieure à la précédente.");

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/bids/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session?.user.id,
                    itemId: id,
                    amount: bidAmount,
                    status: "pending",
                    autoBid: false
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Erreur lors de la soumission de l'enchère.");
            }

            alert("Votre enchère a été soumise avec succès !");
            setShowModal(false);
            setBids([...bids, { amount: bidAmount, userId: session?.user.id }]);

        } catch (error) {
            console.error("Erreur lors de la soumission de l'enchère:", error);
            alert(`Une erreur est survenue: ${error.message}`);
        }

        setIsSubmitting(false);
    };

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

        let statusButton = false;
        if (debut > Date.now()) {
            return "⚫ Cette enchère n'est pas encore disponible.";
        } else if (fin < Date.now()) {
            return "🔴 Cette enchère est terminée.";
        } else {
            return `🟢 Du ${debut.toLocaleDateString()} au ${fin.toLocaleDateString()} à ${fin.toLocaleTimeString()}`;
        }
    };

    const handleSaveAutoBid = async () => {
        if (!session?.user.id) {
            alert("Vous devez être connecté pour activer l'enchère automatique.");
            return;
        }

        try {
            const response = await fetch(`/api/autobids/update?idUser=${session.user.id}&idItem=${id}&budgetMax=${maxBid}&increment=${increment}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Erreur lors de la mise à jour des enchères automatiques.");
            }

            alert("Votre enchère automatique a été mise à jour !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'enchère automatique :", error);
            alert(`Une erreur est survenue: ${error.message}`);
        }
    };

    const handleToggleAutoBid = async (e) => {
        const isChecked = e.target.checked;
        setAutoBids(isChecked);

        if (!session?.user.id || !id) {
            alert("Vous devez être connecté pour activer/désactiver l'enchère automatique.");
            return;
        }

        if (isChecked) {
            handleSaveAutoBid();
        } else {
            try {
                const response = await fetch(`/api/autobids/delete?idUser=${session.user.id}&idItem=${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Erreur lors de la suppression de l'enchère automatique.");
                }

                alert("Votre enchère automatique a été supprimée !");
                setMaxBid(0);
                setIncrement(0);
            } catch (error) {
                console.error("Erreur lors de la suppression de l'enchère automatique :", error);
                alert(`Une erreur est survenue: ${error.message}`);
            }
        }
    };

    const messageDate = getMessageDate();

    return (
        <Suspense>
            <Header/>
            <div className="m-4">
                <a href="/" className="underline mb-3">Revenir à la liste</a>
                {item && (
                    <>
                        <div className="mt-6 sm:flex sm:flex-col sm:items-center">
                            <div className="flex flex-col items-center sm:flex-row sm:gap-20 lg:gap-60 xl:gap-x-9 ">
                                <img src={item.imageURL} alt={item.name} className="w-full rounded-xl max-w-96 xl:max-w-[500px]"/>
                                <div className="sm:flex-col items-start xl:p-20">
                                    <h1 className="text-2xl mt-6 sm:mt-0 font-bold max-w-[300px]">{item.name}</h1>
                                    <div className="mt-6">
                                        <p>Dernière enchère :</p>
                                        <div className=" flex  flex-col xl:flex-row gap-2">
                                            <p className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-red-500 text-white rounded-lg text-center">{enchereActuelle}€</p>
                                            {session && (
                                                <button onClick={() => setShowModal(true)}
                                                        className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-gray-50 border-2 rounded-lg text-center mt-6 xl:mt-0">Enchèrir</button>
                                            )}
                                            {!session && (
                                                <Link href="/login"
                                                      className="font-bold px-5 py-3 sm:px-10 sm:py-5 bg-gray-50 border-2 rounded-lg text-center mt-6 xl:mt-0">Connectez-vous pour enchérir</Link>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-4">Prix de réserve : {item.initialPrice}€</p>
                                    <p className="mt-4">{messageDate}</p>
                                    <p className="mt-4">👤 <b>{usersOnline}</b> acheteurs en ligne</p>
                                    <p className="mt-4">🔥 <b>{nbBids}</b> Enchères</p>
                                </div>
                            </div>

                            {/* Modal */}
                            {showModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-10">
                                    <div className="bg-white p-6 rounded-lg shadow-lg">
                                        <h2 className="text-lg font-bold">Confirmer votre enchère</h2>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(Number(e.target.value))}
                                            placeholder="Montant de l'enchère"
                                            min={enchereActuelle + 1}
                                            defaultValue={enchereActuelle + 1}
                                            className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />

                                        <p className="mt-4 text-sm text-gray-500">Votre enchère doit être supérieure à {enchereActuelle}€</p>
                                        <div className="mt-5">
                                            <input
                                                type="checkbox"
                                                id="autoBids"
                                                name="autoBids"
                                                defaultChecked={isAutoBids}
                                                className="mr-2"
                                                onChange={(e) => setAutoBids(e.target.checked)}
                                            />
                                            <label htmlFor="autoBids" className="text-sm text-gray-500">Activez l'enchère automatique</label>
                                        </div>
                                        {isAutoBids && (
                                            <>
                                                <div className="mx-5 my-3">
                                                    <label htmlFor="increment" className="text-sm text-gray-500 mr-3">Budget Max:</label>
                                                    <input
                                                        type="number"
                                                        value={maxBid}
                                                        onChange={(e) => setMaxBid(Number(e.target.value))}
                                                        placeholder="Budget max"
                                                        className="mr-2 w-fit"
                                                    />
                                                </div>
                                                <div className="mx-5">
                                                    <label htmlFor="increment" className="text-sm text-gray-500 mr-3">Incrément:</label>
                                                    <input
                                                        type="number"
                                                        value={increment}
                                                        onChange={(e) => setIncrement(Number(e.target.value))}
                                                        placeholder="Incrément"
                                                        className="mr-2"
                                                    />
                                                </div>
                                                <button onClick={handleSaveAutoBid} className="mx-5 mt-4 px-2 py-1 bg-blue-400 text-white rounded-lg">Sauvegarder</button>
                                            </>
                                        )}
                                        <div className="mt-5">
                                            <input
                                                type="checkbox"
                                                id="verify"
                                                name="verify"
                                                className="mr-2"
                                                onChange={(e) => setIsChecked(e.target.checked)}
                                            />
                                            <label htmlFor="verify" className="text-sm text-gray-500">
                                                En validant une enchère, le participant s'engage à effectuer le paiement en cas de gain.
                                            </label>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <button onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded-lg">Fermer</button>
                                            <button disabled={!isChecked || isSubmitting} onClick={handleSubmitBid} className={`px-4 py-2 rounded-lg ${isChecked ? "bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"}`}>Suivant</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col xl:flex-row xl:gap-10">
                                <div className="flex flex-col">
                                    <div className="mt-8 p-6 bg-red-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] ">
                                        <h2 className="text-2xl font-bold text-gray-800">RÈGLEMENT :</h2>

                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p>
                                                <strong>🔄 Prolongation des enchères :</strong> À chaque nouvelle enchère dans les 5 dernières minutes, un compte à rebours de 5 minutes est réinitialisé. L'enchère est définitivement close une fois ce délai écoulé sans nouvelle mise.
                                            </p>

                                            <p>
                                                <strong>💰 Enchères minimales après un temps prolongé :</strong> Si l'enchère dépasse 30 minutes après l'heure de fin annoncée, l'incrémentation minimale passe à <span className="font-semibold">50 USD</span>.
                                            </p>

                                            <p>
                                                <strong>🎯 Enchère automatique :</strong> Les participants peuvent définir un montant maximum dès le début. Le système surenchérit automatiquement avec un incrément de leur choix (ex: +10€) jusqu'au plafond défini.
                                            </p>

                                            <p>
                                                <strong>📝 Inscription :</strong> Un formulaire simple permet de s'inscrire en vérifiant l'authenticité des participants :
                                            </p>
                                            <ul className="ml-6 list-disc">
                                                <li>Nom, Prénom</li>
                                                <li>Ville / Pays</li>
                                                <li>Email et téléphone (non visibles publiquement)</li>
                                            </ul>

                                            <p>
                                                <strong>📅 Agenda des enchères :</strong> Un calendrier des prochaines enchères est disponible. Les participants peuvent activer une notification email pour être informés des futures ventes.
                                            </p>

                                            <p>
                                                <strong>⚠️ Engagement :</strong> En validant une enchère, le participant s'engage à effectuer le paiement en cas de gain.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-red-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] ">
                                        <h2 className="text-2xl font-bold text-gray-800">Acheter</h2>
                                        <p>En toute sécurité</p>

                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p>Soyez confiants en achetant au travers de notre place de marché. Les vendeurs sont payés une fois que vous avez validé la réception de vos commandes.</p>
                                            <p>Tous les paiements sont effectués par virement bancaire. Les instructions seront fournies immédiatement après la fin de l'enchère. Vous disposez alors de 2 jours ouvrés pour effectuer le paiement. La TVA, le cas échéant, est due sur toutes les commandes.</p>
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

                                    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md sm:max-w-[677px] lg:max-w-[837px] xl:max-w-[500px] h-fit ">
                                        <h2 className="text-2xl font-bold text-gray-800">Comment ça marche ?</h2>
                                        <p>100% en ligne</p>
                                        <div className="mt-4 space-y-4 text-gray-700">
                                            <p className="text-lg font-semibold">✅ Enchérissez et remportez une offre</p>
                                            <p className="text-lg font-semibold">✅ Validation de l'enchère par le vendeur</p>
                                            <p className="text-lg font-semibold">✅ Payez par virement sous 48h</p>
                                            <p className="text-lg font-semibold">✅ Enlevez ou faites-vous livrer votre lot</p>
                                            <p className="text-lg font-semibold">✅ Vérifiez votre commande à la réception</p>
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