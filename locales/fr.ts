// locales/fr.ts
export default {
    hello: 'Bonjour',
    login: {
        title: "Connexion",
        email: "Adresse e-mail",
        password: "Mot de passe",
        submit: "Se connecter",
        loading: "Connexion en cours...",
        error: "Email ou mot de passe invalide.",
        continueWith: "Ou continuer avec",
        noAccount: "Vous n'avez pas de compte ? Inscrivez-vous",
        google: "Google"
    },
    register: {
        title: "Inscription",
        username: "Nom d'utilisateur",
        email: "Adresse e-mail",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        submit: "S'inscrire",
        loading: "Inscription en cours...",
        error: "Une erreur est survenue lors de l'inscription.",
        success: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        alreadyRegistered: "Déjà inscrit ? Connectez-vous"
    },
    profile: {
        title: "Mon Profil",
        loading: "Chargement...",
        pleaseLogin: "Veuillez vous connecter pour voir votre profil.",
        loginButton: "Se connecter",
        username: "Nom d'utilisateur",
        email: "Adresse e-mail",
        address: "Adresse",
        city: "Ville",
        state: "État",
        country: "Pays",
        postalCode: "Code postal",
        signOut: "Se déconnecter",
        myInfo: "Mes informations",
    },
    detail: {
        backToList: "Revenir à la liste",
        lastBid: "Dernière enchère",
        bid: "Enchérir",
        reservePrice: "Prix de réserve",
        from: "Du",
        to: "au",
        rules: "RÈGLEMENT",
        rulesList: [
            "Prolongation des enchères : À chaque nouvelle enchère dans les 5 dernières minutes, un compte à rebours de 5 minutes est réinitialisé. L’enchère est définitivement close une fois ce délai écoulé sans nouvelle mise.",
            "Enchères minimales après un temps prolongé : Si l'enchère dépasse 30 minutes après l’heure de fin annoncée, l’incrémentation minimale passe à 50 USD.",
            "Enchère automatique : Les participants peuvent définir un montant maximum dès le début. Le système surenchérit automatiquement avec un incrément de leur choix (ex: +10€) jusqu’au plafond défini.",
            "Inscription : Un formulaire simple permet de s’inscrire en vérifiant l’authenticité des participants : Nom, Prénom, Ville / Pays, Email et téléphone (non visibles publiquement).",
            "Agenda des enchères : Un calendrier des prochaines enchères est disponible. Les participants peuvent activer une notification email pour être informés des futures ventes.",
            "Engagement : En validant une enchère, le participant s'engage à effectuer le paiement en cas de gain."
        ],
        buy: "Acheter",
        safely: "En toute sécurité",
        buyDescription: [
            "Soyez confiants en achetant au travers de notre place de marché. Les vendeurs sont payés une fois que vous avez validé la réception de vos commandes.",
            "Tous les paiements sont effectués par virement bancaire. Les instructions seront fournies immédiatement après la fin de l'enchère. Vous disposez alors de 2 jours ouvrés pour effectuer le paiement. La TVA, le cas échéant, est due sur toutes les commandes."
        ],
        description: "DESCRIPTIF",
        howItWorks: "Comment ça marche ?",
        howItWorksSteps: [
            "Enchérissez et remportez une offre",
            "Validation de l’enchère par le vendeur",
            "Payez par virement sous 48h",
            "Enlevez ou faites-vous livrer votre lot",
            "Vérifiez votre commande à la réception"
        ],
    },
    admin: {
        createAuction: "Créer une Enchère",
        auctionName: "Nom de l'enchère",
        description: "Description",
        endDate: "Date de fin",
        startingPrice: "Prix de départ",
        addImage: "Ajouter une image (facultatif)",
        createAuctionButton: "Créer l'enchère",
        loading: "Chargement...",
        viewAuctions: "Voir les enchères",
        error: "Une erreur est survenue."
    },
    nav: {
        home: "Accueil",
        profile: "Profil",
        login: "Connexion",
        register: "Inscription",
        admin: "Panneau d'administration",
        logout: "Déconnexion"
    },
    home: {
        welcome: "Bienvenue sur notre site !",
        description: "Ceci est un exemple d'application Next.js avec gestion des langues.",
        features: "Fonctionnalités",
        feature1: "Traductions gérées avec next-international",
        feature2: "Routage côté client avec Next.js",
        feature3: "Styles avec Tailwind CSS"
    },
    common: {
        loading: "Chargement...",
        error: "Une erreur est survenue",
        success: "Succès",
        save: "Sauvegarder",
        cancel: "Annuler",
        delete: "Supprimer",
        edit: "Modifier",
        back: "Retour"
    }
} as const;