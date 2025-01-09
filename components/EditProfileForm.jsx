// Composant pour le formulaire d'édition

const EditProfileForm = ({ formData, handleInputChange, handleSubmit }) => {
    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm rounded p-6 mt-6"
        aria-labelledby="edit-profile-form"
      >
        <h2 id="edit-profile-form" className="text-xl font-semibold mb-4">
          Modifier mon profil
        </h2>
  
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
            aria-label="Nom d'utilisateur"
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
            aria-label="Adresse email"
          />
        </div>
  
        {/* Champs d'adresse */}
        {["street", "city", "state", "country", "postalCode"].map((field) => (
          <div className="mb-4" key={field}>
            <label
              htmlFor={`address.${field}`}
              className="block mb-1 capitalize"
            >
              {field}
            </label>
            <input
              type="text"
              id={`address.${field}`}
              name={`address.${field}`}
              value={formData.address?.[field] || ""}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              aria-label={`Adresse ${field}`}
            />
          </div>
        ))}
  
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          aria-label="Sauvegarder les modifications"
        >
          Sauvegarder
        </button>
      </form>
    );
  };
  
export default EditProfileForm;
  