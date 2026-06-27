import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useState,
    type HTMLAttributes,
} from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import {
    navbarVariants,
    type NavbarVariants,
} from '../../styles/navbarVariants';

type NavbarContextType = {
    open: boolean;
    menuId: string;
    foregroundColor: string;
    activeColor: string;
    setOpen: (open: boolean) => void;
    toggle: () => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
    position?: NavbarVariants['position'];
    background?: NavbarVariants['background'];
    shadow?: NavbarVariants['shadow'];
    bordered?: NavbarVariants['bordered'];
    rounded?: NavbarVariants['rounded'];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnEscape?: boolean;
}

// The main navbar. Change its global styles in styles/navbarVariants.ts.
export function Navbar({
    position,
    background,
    shadow,
    bordered,
    rounded,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    className,
    style,
    children,
    ...props
}: NavbarProps) {
    const { colors } = useTheme();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const menuId = useId();
    const open = controlledOpen ?? internalOpen;
    const isPrimary = background === 'primary';

    const setOpen = useCallback(
        (nextOpen: boolean) => {
            if (controlledOpen === undefined) {
                setInternalOpen(nextOpen);
            }
            onOpenChange?.(nextOpen);
        },
        [controlledOpen, onOpenChange],
    );

    const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

    useEffect(() => {
        if (!closeOnEscape || !open) return;

        const closeMenu = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        window.addEventListener('keydown', closeMenu);
        return () => window.removeEventListener('keydown', closeMenu);
    }, [closeOnEscape, open, setOpen]);

    const backgroundColor = (() => {
        switch (background) {
            case 'transparent':
                return 'transparent';
            case 'muted':
                return `${colors.muted}14`;
            case 'primary':
                return colors.primary;
            case 'glass':
                return `${colors.background}db`;
            default:
                return colors.background;
        }
    })();

    const foregroundColor = isPrimary ? '#ffffff' : colors.text;
    const activeColor = isPrimary ? '#ffffff' : colors.primary;

    return (
        <NavbarContext.Provider
            value={{
                open,
                menuId,
                foregroundColor,
                activeColor,
                setOpen,
                toggle,
            }}
        >
            <nav
                className={navbarVariants({
                    position,
                    background,
                    shadow,
                    bordered,
                    rounded,
                    className,
                })}
                style={{
                    backgroundColor,
                    borderColor: `${colors.muted}2b`,
                    color: foregroundColor,
                    ...style,
                }}
                {...props}
            >
                {children}
            </nav>
        </NavbarContext.Provider>
    );
}

// Used internally by all navbar parts to share the mobile menu state.
export function useNavbar() {
    const context = useContext(NavbarContext);

    if (!context) {
        throw new Error('Navbar parts must be used inside Navbar');
    }

    return context;
}
