// components/NavBar.jsx

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Logo
        </Link>

        {/* Navigation */}
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Accueil
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            À propos
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>

          {/* Profil (Visible si connecté) */}
          {session && (
            <Link href="/profil" className="hover:text-gray-300">
              Profil
            </Link>
          )}
        </div>

        {/* Bouton Connexion/Déconnexion */}
        <div>
          {!session ? (
            <Link href="/login" passHref>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Connexion
            </button>
          </Link>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
