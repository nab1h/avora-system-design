import { FormButton } from '@/avora-dash/components/forms/FormButton';
import { FormField } from '@/avora-dash/components/forms/FormField';
import { useAppName } from '@/avora-dash/hooks/useAppName';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { AuthLayout } from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

type SocialProviders = {
    google?: boolean;
    facebook?: boolean;
};

type LoginProps = {
    status?: string;
    canResetPassword: boolean;
    socialProviders?: SocialProviders;
};

export default function Login({
    status,
    canResetPassword,
    socialProviders = {},
}: LoginProps) {
    const { translate } = useLanguage();
    const appName = useAppName();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const hasSocialLogin = socialProviders.google || socialProviders.facebook;

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title={translate({ ar: 'مرحبًا بعودتك', en: 'Welcome back' })}
            description={translate({
                ar: `سجّل الدخول للوصول إلى لوحة تحكم ${appName}.`,
                en: `Sign in to access your ${appName} dashboard.`,
            })}
            footer={
                <>
                    {translate({
                        ar: 'ليس لديك حساب؟',
                        en: "Don't have an account?",
                    })}{' '}
                    <Link
                        href={route('register')}
                        className="font-semibold"
                        style={{ color: 'var(--avora-primary)' }}
                    >
                        {translate({ ar: 'أنشئ حسابًا', en: 'Create account' })}
                    </Link>
                </>
            }
        >
            <Head title={translate({ ar: 'تسجيل الدخول', en: 'Sign in' })} />

            {status && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {status}
                </div>
            )}

            {hasSocialLogin && (
                <div className="mb-6 space-y-3">
                    {socialProviders.google && (
                        <a
                            href={route('social.redirect', 'google')}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-base font-black text-[#4285f4]">
                                G
                            </span>
                            {translate({
                                ar: 'الدخول بحساب جوجل',
                                en: 'Continue with Google',
                            })}
                        </a>
                    )}

                    {socialProviders.facebook && (
                        <a
                            href={route('social.redirect', 'facebook')}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877f2] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#166fe5]"
                        >
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-black text-[#1877f2]">
                                f
                            </span>
                            {translate({
                                ar: 'الدخول بحساب فيسبوك',
                                en: 'Continue with Facebook',
                            })}
                        </a>
                    )}

                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        {translate({ ar: 'أو', en: 'or' })}
                        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <FormField
                    label={translate({
                        ar: 'البريد الإلكتروني',
                        en: 'Email address',
                    })}
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(event) => setData('email', event.target.value)}
                    error={errors.email}
                    autoComplete="username"
                    autoFocus
                    required
                />

                <FormField
                    label={translate({
                        ar: 'كلمة المرور',
                        en: 'Password',
                    })}
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(event) =>
                        setData('password', event.target.value)
                    }
                    error={errors.password}
                    autoComplete="current-password"
                    required
                />

                <div className="flex items-center justify-between gap-3 text-sm">
                    <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(event) =>
                                setData('remember', event.target.checked)
                            }
                            className="avora-checkbox rounded border-slate-300"
                        />
                        {translate({ ar: 'تذكرني', en: 'Remember me' })}
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="avora-text-primary font-semibold"
                        >
                            {translate({
                                ar: 'نسيت كلمة المرور؟',
                                en: 'Forgot password?',
                            })}
                        </Link>
                    )}
                </div>

                <FormButton disabled={processing} className="w-full">
                    {processing
                        ? translate({
                              ar: 'جارٍ الدخول...',
                              en: 'Signing in...',
                          })
                        : translate({
                              ar: 'تسجيل الدخول',
                              en: 'Sign in',
                          })}
                </FormButton>
            </form>
        </AuthLayout>
    );
}
