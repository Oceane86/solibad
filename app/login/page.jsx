// app/login/page.jsx


"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            setIsLoading(false);

            if (response.ok) {
                router.push("/");
            } else {
                setError("Email ou mot de passe invalide.");
            }
        } catch (err) {
            setIsLoading(false);
            console.error("Error logging in: ", err);
        }
    };

    return (
        <div className="login-page">
            <div className="login">
                <div className="login_content">
                    <h1 className="gradient-color">Connectez-vous</h1>
                    <form className="login_content_form" onSubmit={handleSubmit}>
                        <label>Adresse mail</label>
                        <input
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Mot de passe</label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="error">{error}</p>}
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Connexion en cours..." : "Se connecter"}
                        </button>
                    </form>
                    <div className="login_content_rs">
                        <p>Ou continuez avec</p>
                        <div className="d-flex column-gap-3">
                            <button className="rs" onClick={() => signIn("google")}>
                                <img src="../assets/icone-google.svg" alt="Icon Google" />
                            </button>
                        </div>
                        <a href="/register">Vous n'avez pas de compte ? S'inscrire</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
