// components/AuctionForm.jsx
import { useState, useEffect } from 'react';

const AuctionForm = ({ initialData = {}, onSubmit }) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [startDate, setStartDate] = useState(initialData.startDate || '');
  const [endDate, setEndDate] = useState(initialData.endDate || '');
  const [initialPrice, setInitialPrice] = useState(initialData.initialPrice || '');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, startDate, endDate, initialPrice, image });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} required />

      <label>Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} required />

      <label>Date de début</label>
      <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required />

      <label>Date de fin</label>
      <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required />

      <label>Prix de départ</label>
      <input type="number" value={initialPrice} onChange={e => setInitialPrice(e.target.value)} required />

      <label>Ajouter une image</label>
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />

      <button type="submit">Soumettre</button>
    </form>
  );
};

export default AuctionForm;
