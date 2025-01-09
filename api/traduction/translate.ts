// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import en from '@/locales/en';
import fr from '@/locales/fr';

// Dictionnaires de traduction
const translations = {
    en,
    fr
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const { keys, language } = req.body;

    if (!keys || !language) {
        return res.status(400).json({ message: 'Clés ou langue manquants' });
    }

    try {
        const translatedContent: Record<string, string> = {};

        for (const key of keys) {
            const translation = findTranslation(key, language);
            translatedContent[key] = translation;
        }

        res.status(200).json(translatedContent);
    } catch (error) {
        console.error('Erreur de traduction globale:', error);
        res.status(500).json({ message: 'Erreur de traduction automatique' });
    }
}

// Fonction de recherche de traduction
function findTranslation(key: string, language: string): string {
    const languageTranslations = translations[language as keyof typeof translations] || {};
    return languageTranslations[key] || key;
}