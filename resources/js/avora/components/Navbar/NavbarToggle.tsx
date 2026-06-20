import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { useNavbar } from './Navbar';

export interface NavbarToggleProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    menuIcon?: ReactNode;
    closeIcon?: ReactNode;
}

function DefaultMenuIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
        >
            <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

function DefaultCloseIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-6 w-6"
        >
            <path d="M6 6l12 12M18 6 6 18" />
        </svg>
    );
}

// The mobile menu button. Replace menuIcon and closeIcon in each project.
export function NavbarToggle({
    menuIcon = <DefaultMenuIcon />,
    closeIcon = <DefaultCloseIcon />,
    className = '',
    onClick,
    ...props
}: NavbarToggleProps) {
    const { open, menuId, toggle } = useNavbar();
    const { translate } = useLanguage();
    const label = open
        ? translate({ ar: 'إغلاق القائمة', en: 'Close menu' })
        : translate({ ar: 'فتح القائمة', en: 'Open menu' });

    return (
        <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current md:hidden dark:hover:bg-white/10 ${className}`}
            aria-label={label}
            title={label}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={(event) => {
                toggle();
                onClick?.(event);
            }}
            {...props}
        >
            <span className="relative block h-6 w-6">
                <span
                    className={`absolute inset-0 transition-all duration-200 ${
                        open
                            ? 'rotate-90 scale-75 opacity-0'
                            : 'rotate-0 scale-100 opacity-100'
                    }`}
                >
                    {menuIcon}
                </span>
                <span
                    className={`absolute inset-0 transition-all duration-200 ${
                        open
                            ? 'rotate-0 scale-100 opacity-100'
                            : '-rotate-90 scale-75 opacity-0'
                    }`}
                >
                    {closeIcon}
                </span>
            </span>
        </button>
    );
}
