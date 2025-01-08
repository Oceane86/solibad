import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-4 mt-8 shadow-inner">
      <nav className="flex justify-center space-x-4">
        <a href="https://www.facebook.com/solibad.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Facebook</a>
        <a href="https://www.youtube.com/user/solibadnet" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">YouTube</a>
        <a href="https://www.instagram.com/solibad_france/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Instagram</a>
        <a href="https://x.com/SolibadFr" target="_blank" rel="noopenmp rner noreferrer" className="text-blue-600 hover:text-blue-800">Twitter</a>
      </nav>
      <p className="text-center mt-2">  
        <a href="https://gdpr.eu/" className="text-gray-500">Règles de protection des données RGPD</a>
        <p className="text-center mb-2">&copy; 2020 by Solibad</p>
      </p>
    </footer>
  );
};

export default Footer;
