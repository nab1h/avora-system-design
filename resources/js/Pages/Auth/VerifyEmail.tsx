import { FormButton } from '@/avora-dash/components/forms/FormButton';
import { AuthLayout } from '@/Layouts/AuthLayout';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { translate } = useLanguage();
    const { post, processing } = useForm({});
    const submit: FormEventHandler = (event) => { event.preventDefault(); post(route('verification.send')); };
    return (
        <AuthLayout title={translate({ ar: 'تحقق من بريدك', en: 'Verify your email' })} description={translate({ ar: 'أرسلنا رابط تحقق إلى بريدك الإلكتروني. افتحه قبل الدخول إلى لوحة التحكم.', en: 'We sent a verification link to your email. Open it before accessing the dashboard.' })}>
            <Head title={translate({ ar: 'التحقق من البريد', en: 'Email verification' })} />
            {status === 'verification-link-sent' && <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{translate({ ar: 'تم إرسال رابط تحقق جديد.', en: 'A new verification link has been sent.' })}</div>}
            <form onSubmit={submit}><FormButton disabled={processing} className="w-full">{translate({ ar: 'إعادة إرسال رابط التحقق', en: 'Resend verification email' })}</FormButton></form>
            <Link href={route('logout')} method="post" as="button" className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">{translate({ ar: 'تسجيل الخروج', en: 'Log out' })}</Link>
        </AuthLayout>
    );
}
