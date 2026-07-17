import { Link, usePage } from '@inertiajs/react';
import { dashboardAccountNavigation, dashboardNavigation, dashboardProperties } from '../../data/navigation';
import { useLanguage } from '../../providers/LanguageProvider';
import type { DashboardNavItem } from '../../types/dashboard';
import { DashboardIcon } from '../DashboardIcon';
import { useAppName } from '../../hooks/useAppName';
import { Button } from '../Button';
import { useWebsiteSettings } from '../../hooks/useWebsiteSettings';

type DashboardSidebarProps = {
    open: boolean;
    desktopOpen: boolean;
    onClose: () => void;
};

export function DashboardSidebar({ open, desktopOpen, onClose }: DashboardSidebarProps) {
    const { url } = usePage();
    const { direction, translate } = useLanguage();
    const isRtl = direction === 'rtl';
    const appName = useAppName();
    const websiteSettings = useWebsiteSettings();
    const logoUrl = websiteSettings?.logo_url;

    const renderItems = (items: DashboardNavItem[]) => items.map((item) => {
        const active = item.href ? url.startsWith(item.href) : false;
        const content = (
            <>
                <DashboardIcon name={item.icon} className="h-5 w-5 shrink-0" />
                <span className="flex-1">{translate(item.label)}</span>
                {item.badge && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {translate(item.badge)}
                    </span>
                )}
            </>
        );
        const classes = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'avora-button-primary text-white shadow-sm' : item.href ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white' : 'cursor-not-allowed text-slate-400 dark:text-slate-600'}`;

        return item.href ? (
            <li key={item.label.en}>
                <Link href={item.href} className={classes} onClick={onClose}>{content}</Link>
            </li>
        ) : (
            <li key={item.label.en}><span className={classes}>{content}</span></li>
        );
    });

    return (
        <>
            <button
                type="button"
                aria-label={translate({
                    ar: "إغلاق القائمة",
                    en: "Close menu",
                })}
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />
            <aside
                className={`avora-surface avora-border fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 ${
                    isRtl ? "right-0 border-l" : "left-0 border-r"
                } ${
                    open
                        ? "translate-x-0"
                        : isRtl
                          ? "translate-x-full"
                          : "-translate-x-full"
                } ${
                    desktopOpen
                        ? "lg:translate-x-0"
                        : isRtl
                          ? "lg:translate-x-full"
                          : "lg:-translate-x-full"
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                        onClick={onClose}
                    >
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={appName}
                                className="h-10 w-10 rounded-xl object-contain"
                            />
                        ) : (
                            <span className="avora-button-primary grid h-10 w-10 place-items-center rounded-xl text-lg font-black text-white">
                                {appName.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <span>
                            <span className="block text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                                {appName}
                            </span>
                            <span className="block text-[11px] text-slate-500">
                                {translate({
                                    ar: "مساحة الإدارة",
                                    en: "Admin workspace",
                                })}
                            </span>
                        </span>
                    </Link>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        rounded="no"
                        onClick={onClose}
                        className="lg:hidden"
                    >
                        <DashboardIcon name="close" />
                    </Button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {translate({ ar: "القائمة الرئيسية", en: "Main menu" })}
                    </p>
                    <ul className="space-y-1">
                        {renderItems(dashboardNavigation)}
                    </ul>
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {translate({ ar: "مواصفات المنتج", en: "Main menu" })}
                    </p>
                    <ul className="space-y-1">
                        {renderItems(dashboardProperties)}
                    </ul>
                    <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {translate({ ar: "الحساب", en: "Account" })}
                    </p>
                    <ul className="space-y-1">
                        {renderItems(dashboardAccountNavigation)}
                    </ul>
                </nav>

                <div className="avora-brand-gradient m-4 rounded-2xl p-4 text-white">
                    <p className="text-sm font-semibold">
                        {translate({
                            ar: "تحتاج مساعدة؟",
                            en: "Need some help?",
                        })}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/70">
                        {translate({
                            ar: "فريق الدعم جاهز لمساعدتك في أي وقت.",
                            en: "Our support team is ready whenever you need us.",
                        })}
                    </p>
                    {websiteSettings?.contact_email && (
                        <p className="mt-2 break-all text-xs font-semibold text-white/80">
                            {websiteSettings.contact_email}
                        </p>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        rounded="no"
                        className="mt-3 bg-white/15 text-white hover:bg-white/25 hover:text-white"
                    >
                        {translate({ ar: "تواصل معنا", en: "Contact us" })}
                    </Button>
                </div>
            </aside>
        </>
    );
}
