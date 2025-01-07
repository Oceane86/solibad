// app/register/page.jsx
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
    // Clear specific error when user starts editing
    setErrors({ ...errors, [name]: "" });
  };

  // Validation logic for each step
  const validateStep = () => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.email) stepErrors.email = "L'adresse e-mail est obligatoire.";
      if (!formData.password) stepErrors.password = "Le mot de passe est obligatoire.";
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      }
    }
    if (step === 2) {
      if (!formData.status) stepErrors.status = "Le statut est obligatoire.";
      if (!formData.username) stepErrors.username = "Le nom d'utilisateur est obligatoire.";
    }
    return stepErrors;
  };

  // Handles form submission for step transitions
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
      // Inscription réussie, connectez immédiatement l'utilisateur
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

  return (
    <>
      <div className="login">
        <div className="login_content">
          <form className="login_content_form" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h1 className="gradient-color">Créez votre compte</h1>
                <div>
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                  <label>Mot de passe</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} />
                  {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div>
                  <label>Confirmation du mot de passe</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>
                <button type="button" onClick={handleNextStep}>Suivant</button>
                <div className="login_content_form_rs">
                  <div>
                    <p>Ou continuez avec</p>
                    <div className="d-flex align-items-center justify-content-center column-gap-3">
                      <button className="rs" onClick={() => signIn('google')}>
                        <img src="/assets/icon-google.svg" alt="Icon Google" />
                      </button>
                      <button className="rs">
                        <img src="/assets/icon-facebook.svg" alt="Icon Facebook" />
                      </button>
                    </div>
                  </div>
                  <a href="/login">Vous avez déjà un compte ? Se connecter</a>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="gradient-color">Informations</h1>
                <div>
                  <label>Statut</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="">Sélectionnez</option>
                    <option value="admin">Admin</option>
                    <option value="visiteur">Visiteur</option>
                  </select>
                  {errors.status && <p className="error">{errors.status}</p>}
                </div>
                <div>
                  <label>Nom d'utilisateur</label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} />
                  {errors.username && <p className="error">{errors.username}</p>}
                </div>
                <button type="button" onClick={handleNextStep}>Suivant</button>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="gradient-color">Profil</h1>
                <div>
                  <label>Image de profil (optionnel)</label>
                  <input type="file" name="profileImage" onChange={handleChange} />
                </div>
                <div>
                  <label>Description (optionnel)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <button type="submit">Finaliser</button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
