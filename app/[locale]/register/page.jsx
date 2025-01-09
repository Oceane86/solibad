'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useI18n } from '@/locales/client';

export default function RegisterPage() {
    const t = useI18n();
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        status: "visiteur",
        description: "",
        profileImage: null
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.username) errors.username = t('register.mandatoryUsername');
        if (!formData.email) errors.email = t('register.mandatoryEmail');
        if (!formData.password) errors.password = t('register.mandatoryPassword');
        if (formData.password.length < 6) errors.password = t('register.passwordMinLength');
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('register.passwordMismatch');
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    status: "visiteur",
                    description: formData.description
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(t('register.success'));
                setTimeout(() => {
                    router.push('/register/success');
                }, 2000);
            } else {
                setErrors({ form: data.message });
            }
        } catch (err) {
            console.error("Erreur:", err);
            setErrors({ form: t('register.serverError') });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {t('register.title')}
                </h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            {t('register.username')}
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t('register.email')}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t('register.password')}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            {t('register.confirmPassword')}
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            {t('register.description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {errors.form && (
                        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                            {errors.form}
                        </div>
                    )}
                    {successMessage && (
                        <div className="text-green-500 text-sm text-center p-2 bg-green-50 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md transition-colors duration-200"
                    >
                        {t('register.submit')}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        {t('register.alreadyRegistered')} <a href="/login" className="hover:text-blue-500">{t('register.login')}</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
