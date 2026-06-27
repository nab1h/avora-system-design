import { DashboardLayout } from '@/Layouts/DashboardLayout';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useAppName } from '@/avora-dash/hooks/useAppName';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { translate } = useLanguage();
    const appName = useAppName();
    return (
        <DashboardLayout>
            <Head title={translate({ ar: 'الملف الشخصي', en: 'Profile' })} />
            <header className="mb-6"><p className="text-sm font-semibold" style={{ color: 'var(--avora-primary)' }}>{appName} Admin</p><h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">{translate({ ar: 'إعدادات الحساب', en: 'Account settings' })}</h1><p className="mt-2 text-sm text-slate-500">{translate({ ar: 'حدّث بياناتك وكلمة المرور وإعدادات الأمان.', en: 'Update your details, password, and account security.' })}</p></header>
            <div className="grid gap-6 xl:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"><UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} /></article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"><UpdatePasswordForm /></article>
                <article className="rounded-2xl border border-rose-200 bg-white p-6 xl:col-span-2 dark:border-rose-500/20 dark:bg-slate-950"><DeleteUserForm /></article>
            </div>
        </DashboardLayout>
    );
}
