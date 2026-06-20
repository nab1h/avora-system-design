import { useLanguage } from '../providers/LanguageProvider';
import { Button } from './Button';

export function LanguageButton() {
    const { language, toggleLanguage, translate } = useLanguage();
    const label = translate({
        ar: 'التبديل إلى الإنجليزية',
        en: 'Switch to Arabic',
    });

    return (
        <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={toggleLanguage}
            aria-label={label}
            title={label}
            className="gap-2"
        >
            {/* Language icon. Change its size using this className. */}
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
            </svg>

            <span>{language === 'ar' ? 'EN' : 'AR'}</span>
        </Button>
    );
}
