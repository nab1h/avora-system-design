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

// Provides theme colors and light or dark mode to the application.
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' ? 'dark' : 'light';
    });
    const colors = getColors(theme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        root.style.backgroundColor = colors.background;
        root.style.color = colors.text;
        document.body.style.backgroundColor = colors.background;
        document.body.style.color = colors.text;
        localStorage.setItem('theme', theme);
    }, [colors.background, colors.text, theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors }}>
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
