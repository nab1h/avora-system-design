import { Button } from "../components/Button";
import { useLanguage } from "./LanguageProvider";
import { useTheme } from "./ThemeProvider";

export function ModeButton() {
    const { theme, setTheme } = useTheme();
    const { translate } = useLanguage();
    const isDark = theme === "dark";
    const label = isDark
        ? translate({ ar: "الوضع الفاتح", en: "Light mode" })
        : translate({ ar: "الوضع الداكن", en: "Dark mode" });

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={label}
            title={label}
        >
            {/* This icon changes between the sun and the moon. */}
            {isDark ? (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
                </svg>
            ) : (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z" />
                </svg>
            )}
        </Button>
    );
}

export default ModeButton;
