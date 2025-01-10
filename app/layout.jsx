// app/layout.jsx
"use client";
import Provider from "../components/Provider";

import "./i18n";

import "./globals.css";

const layout = ({ children }) => {
  return (
    <html lang="fr">
      <head>
      </head>
      <body>
      <Provider>
          <main>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default layout;
