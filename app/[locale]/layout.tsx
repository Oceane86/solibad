import { I18nProviderClient } from "@/locales/client";

const supportedLocales = ["en", "fr"];
const defaultLocale = "en";

export default function LocaleLayout({
    children,
    params: { locale }
}: {

    children: React.ReactNode,
    params: { locale: string }
}) {
    if (!supportedLocales.includes(locale)) {
        return null;
    }

    return (
        <I18nProviderClient locale={locale}>
            <main>{children}</main>
        </I18nProviderClient>
    );
}