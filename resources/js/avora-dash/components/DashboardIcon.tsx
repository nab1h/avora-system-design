import type { SVGAttributes } from "react";
import type { DashboardIconName } from "../types/dashboard";

type DashboardIconProps = SVGAttributes<SVGElement> & {
    name: DashboardIconName;
};

const paths: Record<DashboardIconName, JSX.Element> = {
    dashboard: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
        </>
    ),
    orders: (
        <>
            <path d="M6 3h12l2 4-2 4H6L4 7l2-4Z" />
            <path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8M9 15h6" />
        </>
    ),
    products: (
        <>
            <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="m4.5 7.5 7.5 4 7.5-4M12 21v-9.5" />
        </>
    ),
    purchases: (
        <>
            <path d="M6 7h15l-2 8H8L6 7Z" />
            <path d="M6 7 5 3H2" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M9 11h7" />
        </>
    ),
    customers: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </>
    ),
    reports: (
        <>
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
        </>
    ),
    forms: (
        <>
            <path d="M4 4h16v16H4zM8 9h8M8 13h5M8 17h3" />
        </>
    ),
    tables: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18M9 4v16" />
        </>
    ),
    Components: (
        <>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M17.5 14v7M14 17.5h7" />
        </>
    ),
    payments: (
        <>
            <rect x="3" y="6" width="18" height="12" rx="2" />
            <path d="M3 10h18M7 15h4M15 15h2" />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3h4v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9c.12.36.18.73.18 1.1H21v4h-1.42c0 .31-.06.61-.18.9Z" />
        </>
    ),
    profile: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    sales: (
        <>
            <path d="M3 17 9 11l4 4 8-9" />
            <path d="M15 6h6v6" />
        </>
    ),
    menu: (
        <>
            <path d="M4 7h16M4 12h16M4 17h16" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </>
    ),
    bell: (
        <>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
        </>
    ),
    "arrow-up": (
        <>
            <path d="m18 15-6-6-6 6" />
        </>
    ),
    "arrow-down": (
        <>
            <path d="m6 9 6 6 6-6" />
        </>
    ),
    close: (
        <>
            <path d="M18 6 6 18M6 6l12 12" />
        </>
    ),
    logout: (
        <>
            <path d="M10 17l5-5-5-5M15 12H3" />
            <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
        </>
    ),
};

export function DashboardIcon({
    name,
    className = "h-5 w-5",
    ...props
}: DashboardIconProps) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {paths[name]}
        </svg>
    );
}
