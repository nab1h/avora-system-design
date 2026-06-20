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

// Provides the current language and page direction to the whole application.
export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage === 'ar' || savedLanguage === 'en'
            ? savedLanguage
            : 'ar';
    });

    const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        const root = document.documentElement;
        root.lang = language;
        root.dir = direction;
        localStorage.setItem('language', language);
    }, [direction, language]);

    const toggleLanguage = () => {
        setLanguage((currentLanguage) =>
            currentLanguage === 'ar' ? 'en' : 'ar',
        );
    };

    const translate = (text: TranslatedText) => text[language];

    return (
        <LanguageContext.Provider
            value={{
                language,
                direction,
                setLanguage,
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
