'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    status: "",
    username: "",
    profileImage: null,
    description: "",
  });
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Handles form changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const stepConfig = {
    1: {
      title: "Créez votre compte",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Mot de passe", type: "password", required: true },
        { name: "confirmPassword", label: "Confirmation du mot de passe", type: "password", required: true },
      ],
      validate: () => {
        const stepErrors = {};
        if (!formData.email) stepErrors.email = "L'adresse e-mail est obligatoire.";
        if (!formData.password) stepErrors.password = "Le mot de passe est obligatoire.";
        if (formData.password !== formData.confirmPassword) {
          stepErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
        }
        return stepErrors;
      },
    },
    2: {
      title: "Informations",
      fields: [
        {
          name: "status",
          label: "Statut",
          type: "select",
          options: [
            { value: "", label: "Sélectionnez" },
            { value: "admin", label: "Admin" },
            { value: "visiteur", label: "Visiteur" },
          ],
          required: true,
        },
        { name: "username", label: "Nom d'utilisateur", type: "text", required: true },
      ],
      validate: () => {
        const stepErrors = {};
        if (!formData.status) stepErrors.status = "Le statut est obligatoire.";
        if (!formData.username) stepErrors.username = "Le nom d'utilisateur est obligatoire.";
        return stepErrors;
      },
    },
    3: {
      title: "Profil",
      fields: [
        { name: "profileImage", label: "Image de profil (optionnel)", type: "file" },
        { name: "description", label: "Description (optionnel)", type: "textarea" },
      ],
      validate: () => ({}), // No validation for step 3
    },
  };

  const validateStep = () => {
    const stepErrors = stepConfig[step]?.validate() || {};
    return stepErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === "profileImage" && formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key] || "");
      }
    }

    const response = await fetch("/api/register", {
      method: "POST",
      body: formDataToSend,
    });
    const result = await response.json();

    if (response.ok) {
      const loginResponse = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (!loginResponse.error) {
        router.push("/register/success");
      } else {
        console.error("Erreur lors de la connexion :", loginResponse.error);
      }
    } else {
      console.error(result.message || "Une erreur est survenue.");
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
            <select
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </select>
        );
      case "textarea":
        return (
            <textarea
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
        );
      default:
        return (
            <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={field.type === "file" ? undefined : formData[field.name]}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
        );
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {stepConfig[step]?.title}
          </h1>
          <form
              className="space-y-6"
              onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}
          >
            {stepConfig[step]?.fields.map((field) => (
                <div key={field.name}>
                  <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                      <p className="text-red-500 text-sm">{errors[field.name]}</p>
                  )}
                </div>
            ))}
            <button
                type={step === 3 ? "submit" : "button"}
                onClick={step === 3 ? handleSubmit : handleNextStep}
                className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
            >
              {step === 3 ? "Finaliser" : "Suivant"}
            </button>
          </form>
        </div>
      </div>
  );
};

export default RegisterPage;
