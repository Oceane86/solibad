// components/Agenda.jsx

"use client"; 

import { fr } from "date-fns/locale";
import { format } from "date-fns";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";

const Agenda = () => {
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/items/select");
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  const upcomingItems = items.filter((item) => {
    const startDate = new Date(item.startDate);
    return startDate > new Date();
  });

  const getTileClassName = ({ date }) => {
    const isAuctionDay = items.some((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      return date >= startDate && date <= endDate;
    });
    return isAuctionDay ? "bg-yellow-300 text-black font-bold rounded" : "";
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Veuillez entrer un email valide.");
      return;
    }

    const response = await fetch("/api/subscribe/", {
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
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg space-y-12">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Agenda des Enchères
      </h1>

      {/* Calendrier */}
      <div className="flex justify-center mb-8">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          locale="fr-FR"
          tileClassName={getTileClassName}
          className="calendar-custom w-full max-w-lg rounded-lg shadow-md"
        />
      </div>

      {/* Liste des enchères */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enchères à venir :</h2>
        <ul className="space-y-6">
          {upcomingItems.length > 0 ? (
            upcomingItems.map((item) => (
              <li
                key={item._id}
                className="p-4 bg-gray-100 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 ease-in-out"
              >
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-700 text-sm truncate max-w-full" title={item.description}>
                  {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                </p>
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

      {/* Formulaire de notification */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recevez une notification pour la prochaine enchère
        </h2>
        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <input
            type="email"
            className="flex-1 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            S'abonner
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-gray-700">Votre email a bien été enregistré</p>}
      </div>
    </div>
  );
};

export default Agenda;
