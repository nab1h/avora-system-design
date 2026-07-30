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
        <div className={`grid grid-cols-2 gap-3 ${className}`}>
            {hasGoogle && (
                <a
                    href={route('social.redirect', 'google')}
                    className="avora-surface avora-border group flex w-full items-center justify-center gap-2 border px-3 py-3.5 text-sm font-semibold transition hover:border-[var(--avora-primary)] hover:text-[var(--avora-primary)]"
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
                    className="avora-surface avora-border group flex w-full items-center justify-center gap-2 border px-3 py-3.5 text-sm font-semibold transition hover:border-[var(--avora-primary)] hover:text-[var(--avora-primary)]"
                >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1877f2] text-white transition group-hover:scale-110">
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
