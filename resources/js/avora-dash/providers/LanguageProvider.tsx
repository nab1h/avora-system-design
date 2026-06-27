import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

type TranslatedText = Record<Language, string>;

type LanguageContextType = {
    language: Language;
    direction: Direction;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
    translate: (text: TranslatedText) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

const browserLanguage = (): Language => {
    const languages =
        typeof navigator !== 'undefined'
            ? [navigator.language, ...(navigator.languages ?? [])]
            : [];

    return languages.some((languageCode) =>
        languageCode?.toLowerCase().startsWith('ar'),
    )
        ? 'ar'
        : 'en';
};

const defaultLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    const configuredLanguage =
        document.documentElement.dataset.defaultLanguage;

    if (savedLanguage === 'ar' || savedLanguage === 'en') {
        return savedLanguage;
    }

    if (configuredLanguage === 'ar' || configuredLanguage === 'en') {
        return configuredLanguage;
    }

    return browserLanguage();
};

// Provides the current language and page direction to the whole application.
export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        const root = document.documentElement;
        root.lang = language;
        root.dir = direction;
    }, [direction, language]);

    const updateLanguage = (newLanguage: Language) => {
        localStorage.setItem('language', newLanguage);
        setLanguage(newLanguage);
    };

    const toggleLanguage = () => {
        updateLanguage(
            language === 'ar' ? 'en' : 'ar',
        );
    };

    const translate = (text: TranslatedText) => text[language];

    return (
        <LanguageContext.Provider
            value={{
                language,
                direction,
                setLanguage: updateLanguage,
                toggleLanguage,
                translate,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

// Use this hook in any component that needs translated text.
export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used inside LanguageProvider');
    }

    return context;
}
