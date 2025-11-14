import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {dictionary} from "../../public/data/dictionary";

const LanguageContext = createContext();

export const useTranslation = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }

    return context;
};

const langOptions = [
    { value: 'en', label: 'EN' },
    { value: 'ro', label: 'RO' },
    { value: 'ru', label: 'RU' },
];

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(langOptions[0].value);

    const t = useCallback(
        (key) => {
            return dictionary[language][key] || key;
        },
        [language],
    );

    const handleSetLanguage = useCallback(
        (lang) => {
            window.localStorage.setItem('language', lang);
            setLanguage(lang);
        },
        [setLanguage],
    );

    useEffect(() => {
        if (window !== undefined) {
            const localSetting = window.localStorage.getItem('language');
            if (localSetting) {
                handleSetLanguage(localSetting);
            }
        }
    }, [handleSetLanguage]);

    const value = useMemo(
        () => ({
            language,
            setLanguage: handleSetLanguage,
            t,
            dictionary: dictionary[language],
            langOptions,
        }),
        [language, t, handleSetLanguage],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};