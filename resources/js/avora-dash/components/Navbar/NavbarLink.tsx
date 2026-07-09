import { useEffect, useState, type AnchorHTMLAttributes } from 'react';
import { useNavbar } from './Navbar';

export interface NavbarLinkProps
    extends AnchorHTMLAttributes<HTMLAnchorElement> {
    active?: boolean;
    closeMenuOnClick?: boolean;
}

function isCurrentHref(href?: string) {
    if (!href || typeof window === 'undefined') return false;

    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(href, currentUrl);

    if (
        targetUrl.origin !== currentUrl.origin ||
        targetUrl.pathname !== currentUrl.pathname
    ) {
        return false;
    }

    // Hash links are active only when their page section is selected.
    if (href.startsWith('#')) {
        return href === '#'
            ? currentUrl.hash === ''
            : targetUrl.hash === currentUrl.hash;
    }

    return targetUrl.search === currentUrl.search;
}

// A navigation link. It detects the current URL automatically.
export function NavbarLink({
    active,
    closeMenuOnClick = true,
    className = '',
    style,
    onClick,
    href,
    ...props
}: NavbarLinkProps) {
    const { foregroundColor, activeColor, setOpen } = useNavbar();
    const [automaticActive, setAutomaticActive] = useState(() =>
        isCurrentHref(href),
    );
    const isActive = active ?? automaticActive;

    useEffect(() => {
        const updateActiveLink = () => setAutomaticActive(isCurrentHref(href));

        updateActiveLink();
        window.addEventListener('hashchange', updateActiveLink);
        window.addEventListener('popstate', updateActiveLink);

        return () => {
            window.removeEventListener('hashchange', updateActiveLink);
            window.removeEventListener('popstate', updateActiveLink);
        };
    }, [href]);

    return (
        <a
            className={`relative px-3 py-2 text-sm font-medium transition after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-[calc(100%-1.5rem)] after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 after:ease-out hover:opacity-70 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${isActive ? 'after:scale-x-100' : ''} ${className}`}
            style={{
                color: isActive ? activeColor : foregroundColor,
                backgroundColor: 'transparent',
                ...style,
            }}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            onClick={(event) => {
                if (closeMenuOnClick) setOpen(false);
                onClick?.(event);
            }}
            {...props}
        />
    );
}
