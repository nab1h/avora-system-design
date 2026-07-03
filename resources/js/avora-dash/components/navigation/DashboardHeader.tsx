import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { LanguageButton } from '../LanguageButton';
import ModeButton from '../../providers/ModeButton';
import { useLanguage } from '../../providers/LanguageProvider';
import { DashboardIcon } from '../DashboardIcon';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';

type DashboardHeaderProps = {
    desktopSidebarOpen: boolean;
    onMenuClick: () => void;
    onDesktopMenuClick: () => void;
};

export function DashboardHeader({ desktopSidebarOpen, onMenuClick, onDesktopMenuClick }: DashboardHeaderProps) {
    const { auth } = usePage<PageProps>().props;
    const { translate } = useLanguage();
    const initials = auth.user.name.trim().slice(0, 2).toUpperCase();
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const userPermissions = auth.user.permissions ?? [];

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!accountMenuRef.current?.contains(event.target as Node)) {
                setAccountMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    return (
        <header className="avora-surface avora-border sticky top-0 z-30 border-b backdrop-blur">
            <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    rounded="lg"
                    onClick={onMenuClick}
                    className="lg:hidden"
                >
                    <DashboardIcon name="menu" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    rounded="lg"
                    onClick={onDesktopMenuClick}
                    aria-label={translate({
                        ar: desktopSidebarOpen
                            ? "إغلاق القائمة الجانبية"
                            : "فتح القائمة الجانبية",
                        en: desktopSidebarOpen
                            ? "Close sidebar"
                            : "Open sidebar",
                    })}
                    aria-expanded={desktopSidebarOpen}
                    className="hidden lg:inline-flex"
                >
                    <DashboardIcon
                        name={desktopSidebarOpen ? "close" : "menu"}
                    />
                </Button>

                <label className="relative hidden max-w-md flex-1 md:block">
                    <span className="sr-only">
                        {translate({ ar: "بحث", en: "Search" })}
                    </span>
                    <DashboardIcon
                        name="search"
                        className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        placeholder={translate({
                            ar: "ابحث في لوحة التحكم...",
                            en: "Search dashboard...",
                        })}
                        className="avora-form-field w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 ps-11 pe-4 text-sm placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900"
                    />
                </label>

                <div className="ms-auto flex items-center gap-1 sm:gap-2">
                    <LanguageButton />
                    <ModeButton />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        rounded="lg"
                        className="relative"
                        aria-label={translate({
                            ar: "الإشعارات",
                            en: "Notifications",
                        })}
                    >
                        <DashboardIcon name="bell" />
                        <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
                    </Button>
                    <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-700" />
                    <div ref={accountMenuRef} className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            rounded="lg"
                            onClick={() => setAccountMenuOpen((open) => !open)}
                            aria-expanded={accountMenuOpen}
                            aria-haspopup="menu"
                            className="h-auto gap-2 p-1.5"
                        >
                            <span className="avora-bg-primary-soft avora-text-primary grid h-9 w-9 place-items-center overflow-hidden rounded-xl text-xs font-bold">
                                {auth.user.avatar_url ? (
                                    <img
                                        src={auth.user.avatar_url}
                                        alt={auth.user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </span>
                            <span className="hidden text-start sm:block">
                                <span className="block max-w-28 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    {auth.user.name}
                                </span>
                                <span className="block text-[11px] text-slate-500">
                                    {userPermissions
                                        ? translate({
                                              ar: "حساب ادمين",
                                              en: "admin",
                                          })
                                        : translate({
                                              ar: "مريض",
                                              en: "مريض",
                                          })}
                                </span>
                            </span>
                            <DashboardIcon
                                name="arrow-down"
                                className={`hidden h-4 w-4 text-slate-400 transition sm:block ${accountMenuOpen ? "rotate-180" : ""}`}
                            />
                        </Button>

                        {accountMenuOpen && (
                            <div
                                role="menu"
                                className="avora-surface avora-border absolute end-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border p-2 shadow-xl shadow-slate-900/10"
                            >
                                <div className="border-b border-slate-100 px-3 py-3 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <span className="avora-bg-primary-soft avora-text-primary grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl text-xs font-bold">
                                            {auth.user.avatar_url ? (
                                                <img
                                                    src={auth.user.avatar_url}
                                                    alt={auth.user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                initials
                                            )}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                                {auth.user.name}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-slate-500">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <Link
                                        href="/profile"
                                        role="menuitem"
                                        onClick={() =>
                                            setAccountMenuOpen(false)
                                        }
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <DashboardIcon name="profile" />
                                        {translate({
                                            ar: "الملف الشخصي",
                                            en: "Profile",
                                        })}
                                    </Link>
                                    <Link
                                        href="/dashboard/settings"
                                        role="menuitem"
                                        onClick={() =>
                                            setAccountMenuOpen(false)
                                        }
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <DashboardIcon name="settings" />
                                        {translate({
                                            ar: "الإعدادات",
                                            en: "Settings",
                                        })}
                                    </Link>
                                </div>
                                <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        role="menuitem"
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                    >
                                        <DashboardIcon name="logout" />
                                        {translate({
                                            ar: "تسجيل الخروج",
                                            en: "Log out",
                                        })}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
