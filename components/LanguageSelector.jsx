import React, { useState } from "react";

const LanguageSelector = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="bg-gray-700 p-2 rounded">
        🇫🇷
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <ul>
             
            <li className="p-2 hover:bg-gray-200 cursor-pointer">ENG</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">DE</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">NL</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer">AR</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
