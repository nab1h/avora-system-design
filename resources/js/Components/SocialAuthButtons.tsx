import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import type { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { FaFacebookF } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';

type SocialAuthButtonsProps = {
    className?: string;
};

export function SocialAuthButtons({ className = '' }: SocialAuthButtonsProps) {
    const { translate } = useLanguage();
    const { websiteSettings } = usePage<PageProps>().props;
    const hasGoogle = websiteSettings.google_login_ready;
    const hasFacebook = websiteSettings.facebook_login_ready;

    if (!hasGoogle && !hasFacebook) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            {hasGoogle && (
                <a
                    href={route('social.redirect', 'google')}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:scale-110">
                        <FcGoogle className="h-5 w-5" />
                    </span>
                    {translate({
                        ar: 'الدخول بحساب جوجل',
                        en: 'Continue with Google',
                    })}
                </a>
            )}

            {hasFacebook && (
                <a
                    href={route('social.redirect', 'facebook')}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1877f2] px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-[#166fe5] hover:shadow-blue-600/30"
                >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#1877f2] transition group-hover:scale-110">
                        <FaFacebookF className="h-4 w-4" />
                    </span>
                    {translate({
                        ar: 'الدخول بحساب فيسبوك',
                        en: 'Continue with Facebook',
                    })}
                </a>
            )}
        </div>
    );
}
