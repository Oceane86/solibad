// app/layout.jsx
// import "@styles/globals.css";
import Provider from "@components/Provider";
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
