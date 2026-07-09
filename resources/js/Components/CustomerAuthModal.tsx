import { Button } from '@/avora-dash/components/Button';
import { FormField } from '@/avora-dash/components/forms/FormField';
import { Modal } from '@/avora-dash/components/Modal';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useForm } from '@inertiajs/react';
import { useState, type FormEventHandler } from 'react';
import { SocialAuthButtons } from './SocialAuthButtons';

type CustomerAuthModalProps = {
    open: boolean;
    onClose: () => void;
};

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export function CustomerAuthModal({ open, onClose }: CustomerAuthModalProps) {
    const { translate } = useLanguage();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const loginForm = useForm<LoginForm>({
        email: '',
        password: '',
        remember: true,
    });
    const registerForm = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submitLogin: FormEventHandler = (event) => {
        event.preventDefault();

        loginForm.post(route('customer.login'), {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () => loginForm.reset('password'),
        });
    };

    const submitRegister: FormEventHandler = (event) => {
        event.preventDefault();

        registerForm.post(route('customer.register'), {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () =>
                registerForm.reset('password', 'password_confirmation'),
        });
    };

    const isRegister = mode === 'register';

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="lg"
            title={translate({
                ar: isRegister ? 'إنشاء حساب عميل' : 'دخول العملاء',
                en: isRegister ? 'Create customer account' : 'Client login',
            })}
            description={translate({
                ar: 'سجّل كعميل عادي. لوحة التحكم لا يدخلها إلا المستخدم الذي يمتلك صلاحيات.',
                en: 'Sign in as a customer. The dashboard is only available for users with permissions.',
            })}
            showCloseButton
            className="bg-white/95 backdrop-blur-xl dark:bg-slate-950/95"
        >
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900">
                <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                        !isRegister
                            ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    {translate({ ar: 'تسجيل دخول', en: 'Sign in' })}
                </button>
                <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                        isRegister
                            ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    {translate({ ar: 'حساب جديد', en: 'New account' })}
                </button>
            </div>

            <SocialAuthButtons />

            <div className="my-5 flex items-center gap-3 text-xs font-bold text-slate-400">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                {translate({
                    ar: 'أو استخدم البريد الإلكتروني',
                    en: 'or use email',
                })}
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            {isRegister ? (
                <form onSubmit={submitRegister} className="space-y-4">
                    <FormField
                        label={translate({ ar: 'الاسم', en: 'Name' })}
                        value={registerForm.data.name}
                        onChange={(event) =>
                            registerForm.setData('name', event.target.value)
                        }
                        error={registerForm.errors.name}
                        autoComplete="name"
                        required
                    />
                    <FormField
                        label={translate({
                            ar: 'البريد الإلكتروني',
                            en: 'Email address',
                        })}
                        type="email"
                        value={registerForm.data.email}
                        onChange={(event) =>
                            registerForm.setData('email', event.target.value)
                        }
                        error={registerForm.errors.email}
                        autoComplete="email"
                        required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            label={translate({
                                ar: 'كلمة المرور',
                                en: 'Password',
                            })}
                            type="password"
                            value={registerForm.data.password}
                            onChange={(event) =>
                                registerForm.setData(
                                    'password',
                                    event.target.value,
                                )
                            }
                            error={registerForm.errors.password}
                            autoComplete="new-password"
                            required
                        />
                        <FormField
                            label={translate({
                                ar: 'تأكيد كلمة المرور',
                                en: 'Confirm password',
                            })}
                            type="password"
                            value={registerForm.data.password_confirmation}
                            onChange={(event) =>
                                registerForm.setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                            error={registerForm.errors.password_confirmation}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        disabled={registerForm.processing}
                        className="py-3.5 text-sm font-black"
                    >
                        {registerForm.processing
                            ? translate({
                                  ar: 'جارٍ إنشاء الحساب...',
                                  en: 'Creating account...',
                              })
                            : translate({
                                  ar: 'إنشاء حساب عميل',
                                  en: 'Create customer account',
                              })}
                    </Button>
                </form>
            ) : (
                <form onSubmit={submitLogin} className="space-y-4">
                    <FormField
                        label={translate({
                            ar: 'البريد الإلكتروني',
                            en: 'Email address',
                        })}
                        type="email"
                        value={loginForm.data.email}
                        onChange={(event) =>
                            loginForm.setData('email', event.target.value)
                        }
                        error={loginForm.errors.email}
                        autoComplete="email"
                        required
                    />
                    <FormField
                        label={translate({
                            ar: 'كلمة المرور',
                            en: 'Password',
                        })}
                        type="password"
                        value={loginForm.data.password}
                        onChange={(event) =>
                            loginForm.setData('password', event.target.value)
                        }
                        error={loginForm.errors.password}
                        autoComplete="current-password"
                        required
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <input
                            type="checkbox"
                            checked={loginForm.data.remember}
                            onChange={(event) =>
                                loginForm.setData(
                                    'remember',
                                    event.target.checked,
                                )
                            }
                            className="avora-checkbox rounded border-slate-300"
                        />
                        {translate({ ar: 'تذكرني', en: 'Remember me' })}
                    </label>
                    <Button
                        type="submit"
                        fullWidth
                        disabled={loginForm.processing}
                        className="py-3.5 text-sm font-black"
                    >
                        {loginForm.processing
                            ? translate({
                                  ar: 'جارٍ الدخول...',
                                  en: 'Signing in...',
                              })
                            : translate({
                                  ar: 'دخول حساب العميل',
                                  en: 'Sign in as customer',
                              })}
                    </Button>
                </form>
            )}
        </Modal>
    );
}
