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
            className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${className}`}
            style={{
                color: isActive ? activeColor : foregroundColor,
                backgroundColor: isActive
                    ? `${activeColor}14`
                    : 'transparent',
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
