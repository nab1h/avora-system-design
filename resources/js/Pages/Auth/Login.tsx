import { FormButton } from '@/avora-dash/components/forms/FormButton';
import { FormField } from '@/avora-dash/components/forms/FormField';
import { AuthLayout } from '@/Layouts/AuthLayout';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { useAppName } from '@/avora-dash/hooks/useAppName';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { translate } = useLanguage();
    const appName = useAppName();
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });
    const submit: FormEventHandler = (event) => { event.preventDefault(); post(route('login'), { onFinish: () => reset('password') }); };

    return (
        <AuthLayout title={translate({ ar: 'مرحبًا بعودتك', en: 'Welcome back' })} description={translate({ ar: `سجّل الدخول للوصول إلى لوحة تحكم ${appName}.`, en: `Sign in to access your ${appName} dashboard.` })} footer={<>{translate({ ar: 'ليس لديك حساب؟', en: "Don't have an account?" })} <Link href={route('register')} className="font-semibold" style={{ color: 'var(--avora-primary)' }}>{translate({ ar: 'أنشئ حسابًا', en: 'Create account' })}</Link></>}>
            <Head title={translate({ ar: 'تسجيل الدخول', en: 'Sign in' })} />
            {status && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">{status}</div>}
            <form onSubmit={submit} className="space-y-5">
                <FormField label={translate({ ar: 'البريد الإلكتروني', en: 'Email address' })} id="email" type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} error={errors.email} autoComplete="username" autoFocus required />
                <FormField label={translate({ ar: 'كلمة المرور', en: 'Password' })} id="password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} error={errors.password} autoComplete="current-password" required />
                <div className="flex items-center justify-between gap-3 text-sm"><label className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} className="avora-checkbox rounded border-slate-300" />{translate({ ar: 'تذكرني', en: 'Remember me' })}</label>{canResetPassword && <Link href={route('password.request')} className="avora-text-primary font-semibold">{translate({ ar: 'نسيت كلمة المرور؟', en: 'Forgot password?' })}</Link>}</div>
                <FormButton disabled={processing} className="w-full">{processing ? translate({ ar: 'جارٍ الدخول...', en: 'Signing in...' }) : translate({ ar: 'تسجيل الدخول', en: 'Sign in' })}</FormButton>
            </form>
        </AuthLayout>
    );
}
