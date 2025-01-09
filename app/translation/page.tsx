// app/translation/page.tsx
import { useTranslation } from 'react-i18next';
import '../../config/i18n';

export default function TranslationTestPage() {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('hello')}</h1>
            <p>{t('login.email')}</p>
            <p>{t('new.key.that.doesnt.exist')}</p>
        </div>
    );
}