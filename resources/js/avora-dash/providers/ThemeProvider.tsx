import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import { getColors } from '../tokens/getColors';

type Theme = 'light' | 'dark';

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    colors: ReturnType<typeof getColors>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const browserTheme = (): Theme =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

const defaultTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme');
    const configuredTheme = document.documentElement.dataset.defaultTheme;

    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }

    if (configuredTheme === 'dark' || configuredTheme === 'light') {
        return configuredTheme;
    }

    return browserTheme();
};

// Provides theme colors and light or dark mode to the application.
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const colors = getColors(theme);

    const updateTheme = (newTheme: Theme) => {
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        root.style.backgroundColor = colors.background;
        root.style.color = colors.text;
        root.style.setProperty('--avora-primary', colors.primary);
        root.style.setProperty('--avora-secondary', colors.secondary);
        root.style.setProperty('--avora-danger', colors.danger);
        root.style.setProperty('--avora-success', colors.success);
        root.style.setProperty('--avora-warning', colors.warning);
        root.style.setProperty('--avora-text', colors.text);
        root.style.setProperty('--avora-muted', colors.muted);
        root.style.setProperty('--avora-background', colors.background);
        root.style.setProperty('--avora-surface', colors.surface);
        root.style.setProperty('--avora-surface-muted', colors.surfaceMuted);
        root.style.setProperty('--avora-border', colors.border);
        document.body.style.backgroundColor = colors.background;
        document.body.style.color = colors.text;
    }, [colors.background, colors.text, theme]);

    useEffect(() => {
        const configuredTheme = document.documentElement.dataset.defaultTheme;

        if (localStorage.getItem('theme') || configuredTheme !== 'system') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => setTheme(browserTheme());

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider');
    }

    return context;
}
