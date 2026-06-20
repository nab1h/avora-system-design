import type { ButtonHTMLAttributes } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { useNavbar } from './Navbar';

export interface NavbarOverlayProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    opacity?: 'light' | 'medium' | 'dark';
}

const opacityClasses = {
    light: 'bg-black/15',
    medium: 'bg-black/35',
    dark: 'bg-black/60',
};

// Layer below the mobile menu. It starts under the navbar, not over it.
export function NavbarOverlay({
    opacity = 'medium',
    className = '',
    onClick,
    ...props
}: NavbarOverlayProps) {
    const { open, setOpen } = useNavbar();
    const { translate } = useLanguage();

    return (
        <button
            type="button"
            tabIndex={open ? 0 : -1}
            aria-hidden={!open}
            className={`absolute inset-x-0 top-full z-50 h-[calc(100vh-4rem)] cursor-default transition-all duration-300 md:hidden ${opacityClasses[opacity]} ${
                open
                    ? 'visible pointer-events-auto opacity-100'
                    : 'invisible pointer-events-none opacity-0'
            } ${className}`}
            aria-label={translate({
                ar: 'إغلاق قائمة التنقل',
                en: 'Close navigation menu',
            })}
            onClick={(event) => {
                setOpen(false);
                onClick?.(event);
            }}
            {...props}
        />
    );
}
