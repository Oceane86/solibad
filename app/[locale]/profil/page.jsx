// app/profil/page.jsx

'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useI18n } from '@/locales/client';

export default function ProfilePage() {
  const t = useI18n();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>{t('profile.loading')}</p>;
  }

  if (!session) {
    return (
        <div className="container mx-auto p-4">
          <p>{t('profile.pleaseLogin')}</p>
          <button
              onClick={() => router.push("/login")}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {t('profile.loginButton')}
          </button>
        </div>
    );
  }

  const { user } = session;

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t('profile.title')}</h1>
        <div className="bg-white shadow-sm rounded p-6 mb-4">
          <div className="flex items-center mb-6">
            <img
                src={user.image || "/images/default-avatar.jpg"}
                alt={user.name || "Utilisateur"}
                className="w-20 h-20 object-cover rounded-full mr-6"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name || t('profile.username')}</h2>
              <p className="text-gray-600 text-sm">{user.email || t('profile.email')}</p>
            </div>
          </div>

          <button
              onClick={() => signOut()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {t('profile.signOut')}
          </button>
        </div>

        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t('profile.myInfo')}</h2>
          <form className="form_informations">
            <div className="form-group">
              <label className="form-label" htmlFor="username">{t('profile.username')}</label>
              <input type="text" />
              <label className="form-label" htmlFor="email">{t('profile.email')}</label>
              <input type="text" />
              <label className="form-label" htmlFor="address">{t('profile.address')}</label>
              <input type="text" />
              <label className="form-label" htmlFor="city">{t('profile.city')}</label>
              <input type="text" />
              <label className="form-label" htmlFor="state">{t('profile.state')}</label>
              <input type="text" />
              <label className="form-label" htmlFor="country">{t('profile.country')}</label>
              <input type="text" />
              <label className="form-label" htmlFor="postalCode">{t('profile.postalCode')}</label>
              <input type="text" />
            </div>
          </form>
        </div>
      </div>
  );
}
