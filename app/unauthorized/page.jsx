// app/unauthrized/page.jsx

'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Unauthorized = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/login");  
        }, 3000);
        return () => clearTimeout(timer); 
    }, [router]);

    return (
        <div className="container">
            <h1>Accès Interdit</h1>
            <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page. Vous allez être redirigé vers la page de connexion.</p>
        </div>
    );
};

export default Unauthorized;
