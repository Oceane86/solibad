// app/components/Header.jsx

import React from "react";
import LanguageSelector from "./LanguageSelector";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-100 p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center">
            <span className="mr-2">Langues:</span>
            <LanguageSelector /> {/* LanguageSelector.jsx */}
            <div></div>
            <div className="flex articles-centre"></div>
            <span className="mr-2">Filtre:</span>
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="FR"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              <svg
                className="w-1.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <span className="mr-2">Filtre:</span>
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="Touts Les Enchéres"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Touts Les Enchéres
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
        </div>
      </div>
      <nav className="flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>Menu</li>
        </ul>
        <div className="flex items-center space-x-4">
          <img
            src="/assets/Solibad.jpg"
            alt="logo solibad"
            className="h-8"
          /> {/* Logo ajouté */}
        </div>
        <ul className="flex space-x-4">
          <Link href="/login" passHref>
            <li>Connexion</li>
          </Link>

          <Link href="/register" passHref>
            <li>Inscription</li>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
