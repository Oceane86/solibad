import React from 'react';

const Footer = () => {
  return (
      <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
          <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                  <a href="/"
                     className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                      <img src="https://static.wixstatic.com/media/20ece8_aab1d120121d4cf6b38413aaad1bc3b6~mv2.png/v1/fill/w_181,h_68,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/solibad_fr-1.png" className="h-8" alt="Flowbite Logo"/>
                      </a>
                  <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                      <li>
                          <a href="#" className="hover:underline me-4 md:me-6">Mentions légales</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline me-4 md:me-6">CGU</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline me-4 md:me-6">CGV</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline">Contact</a>
                      </li>
                  </ul>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"/>
              <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a
                  href="/" className="hover:underline">SOLIBAD™</a>. Tous droits réservés.</span>
          </div>
      </footer>


  );
};

export default Footer;
