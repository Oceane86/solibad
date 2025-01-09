// components/Agenda.jsx


"use client";

import { fr } from "date-fns/locale";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";

// Ajouter un état pour la gestion des notifications par e-mail
const Agenda = () => {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Charger les enchères depuis l'API
  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/items/select");
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  // Filtrer les items pour obtenir les enchères à venir
  const upcomingItems = items.filter((item) => {
    const startDate = new Date(item.startDate);
    return startDate > new Date();
  });

  // Fonction pour afficher un indicateur dans les cases du calendrier
  const getTileClassName = ({ date }) => {
    const isAuctionDay = items.some((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      return date >= startDate && date <= endDate;
    });
    return isAuctionDay ? "bg-yellow-300 text-black font-bold rounded-full" : "";
  };

  // Fonction pour envoyer un e-mail de notification (simulé)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Veuillez entrer un email valide.");
      return;
    }

    // Simuler l'envoi d'un e-mail
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setMessage("Vous serez notifié lors de la prochaine enchère !");
    } else {
      setMessage("Une erreur s'est produite. Essayez à nouveau.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Agenda des Enchères</h1>
      
      {/* Calendrier */}
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        locale="fr-FR"
        tileClassName={getTileClassName}
        className="shadow-lg rounded-lg"
      />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Enchères à venir :</h2>
        <ul className="space-y-4">
          {upcomingItems.length > 0 ? (
            upcomingItems.map((item) => (
              <li key={item._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-gray-700">{item.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Début : {format(new Date(item.startDate), "PPpp", { locale: fr })} - Fin :{" "}
                  {format(new Date(item.endDate), "PPpp", { locale: fr })}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Aucune enchère à venir pour le moment.</p>
          )}
        </ul>
      </div>

      {/* Formulaire de notification par e-mail */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recevez une notification pour la prochaine enchère</h2>
        <form onSubmit={handleEmailSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            className="p-2 border rounded-md"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
            S'abonner aux notifications
          </button>
          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Agenda;
