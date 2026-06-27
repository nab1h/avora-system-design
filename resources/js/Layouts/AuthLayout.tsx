import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { LanguageButton } from '@/avora-dash/components/LanguageButton';
import ModeButton from '@/avora-dash/providers/ModeButton';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useAppName } from '@/avora-dash/hooks/useAppName';
import { useWebsiteSettings } from '@/avora-dash/hooks/useWebsiteSettings';

type AuthLayoutProps = {
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
    const { translate } = useLanguage();
    const appName = useAppName();
    const websiteSettings = useWebsiteSettings();
    const logoUrl = websiteSettings?.logo_url;

    return (
        <main className="grid min-h-screen bg-white lg:grid-cols-2 dark:bg-slate-950">
            <section className="avora-brand-gradient relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-24 -start-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
                <Link href="/" className="relative flex items-center gap-3">
                    {logoUrl ? (
                        <img src={logoUrl} alt={appName} className="h-11 w-11 rounded-2xl bg-white object-contain p-1" />
                    ) : (
                        <span className="avora-text-primary grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl font-black">{appName.charAt(0).toUpperCase()}</span>
                    )}
                    <span className="text-2xl font-black tracking-tight">{appName}</span>
                </Link>
                <div className="relative max-w-lg">
                    <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7"><path d="M12 3 4 7v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>
                    </span>
                    <h2 className="text-4xl font-black leading-tight">{translate({ ar: 'إدارة أعمالك تبدأ من مكان واحد.', en: 'Run your business from one beautiful place.' })}</h2>
                    <p className="mt-5 text-base leading-8 text-white/75">{translate({ ar: 'لوحة تحكم سريعة وآمنة، مصممة لتساعدك على متابعة كل التفاصيل واتخاذ قرارات أفضل.', en: 'A fast, secure workspace designed to help you track every detail and make better decisions.' })}</p>
                </div>
                <p className="relative text-xs text-white/65">
                    © {new Date().getFullYear()} {appName}. {translate({ ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' })}
                    {websiteSettings?.contact_email && <span className="ms-2">{websiteSettings.contact_email}</span>}
                </p>
            </section>

            <section className="flex min-h-screen flex-col">
                <header className="flex h-20 items-center justify-between px-5 sm:px-8">
                    <Link href="/" className="flex items-center gap-2 lg:hidden">
                        {logoUrl ? (
                            <img src={logoUrl} alt={appName} className="h-9 w-9 rounded-xl object-contain" />
                        ) : (
                            <span className="avora-button-primary grid h-9 w-9 place-items-center rounded-xl font-black text-white">{appName.charAt(0).toUpperCase()}</span>
                        )}
                        <span className="font-black">{appName}</span>
                    </Link>
                    <div className="ms-auto flex items-center gap-1"><LanguageButton /><ModeButton /></div>
                </header>
                <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8"><h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p></div>
                        {children}
                        {footer && <div className="mt-7 text-center text-sm text-slate-500">{footer}</div>}
                    </div>
                </div>
            </section>
        </main>
    );
}
