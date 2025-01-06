# Plateforme d'Enchères SOLIBAD

Bienvenue sur la plateforme d'enchères de SOLIBAD, une Progressive Web App (PWA) dédiée à la collecte de fonds et de matériel pour soutenir les enfants défavorisés dans la pratique du badminton. Cette application offre une expérience utilisateur fluide, multilingue et accessible sur tous types d'appareils.

## Table des Matières

1. [À propos de SOLIBAD](#à-propos-de-solibad)
2. [Fonctionnalités](#fonctionnalités)
3. [Technologies Utilisées](#technologies-utilisées)
4. [Prérequis](#prérequis)
5. [Installation](#installation)
6. [Utilisation](#utilisation)
7. [Contribution](#contribution)
8. [Licence](#licence)

## À propos de SOLIBAD

SOLIBAD est une association fondée il y a 15 ans, dédiée à l'aide aux enfants défavorisés à travers le badminton. Avec plus de 10 000 enfants aidés, l'association organise des collectes de fonds et de matériel, notamment via des enchères d'objets et d'expériences offerts par de grands sportifs. Pour plus d'informations, visitez [solibad.fr](https://solibad.fr) ou [solibad.net](https://solibad.net).

## Fonctionnalités

- **Responsive Design** : Interface adaptée à tous types d'appareils (ordinateurs, tablettes, smartphones).
- **Multilingue** : Support de plusieurs langues pour une accessibilité internationale, implémenté avec [next-translate](https://github.com/aralroca/next-translate).
- **Paiement en Ligne** : Intégration de Stripe pour des transactions sécurisées.
- **Authentification** : Module de connexion et d'inscription pour les utilisateurs.
- **Notifications** : Système de notifications pour les enchères et les newsletters.
- **Enchères Automatiques** : Possibilité de définir un budget maximum avec incrémentation automatique des mises.
- **PWA** : Application web progressive offrant une expérience similaire à une application native.

## Technologies Utilisées

- **Framework** : [Next.js](https://nextjs.org/)
- **Base de Données** : [MongoDB](https://www.mongodb.com/)
- **Paiement** : [Stripe](https://stripe.com/)
- **Internationalisation** : [next-translate](https://github.com/aralroca/next-translate)

## Prérequis

- Node.js version 14 ou supérieure
- npm ou yarn
- Compte Stripe pour le traitement des paiements
- Instance MongoDB pour la base de données

## Installation

1. Clonez le dépôt GitHub :

```bash
git clone https://github.com/Oceane86/solibad.git
```

2. Installez les dépendances :

```bash
npm install
# ou
yarn install
```

3. Créez un fichier `.env.local` à la racine du projet et ajoutez les variables d'environnement suivantes :

```bash
# env
MONGO_URI=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

```

4. Démarrez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

5. Ouvrez votre navigateur et accédez à `http://localhost:3000`.