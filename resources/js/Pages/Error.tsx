import { Button } from '@/avora-dash/components/Button';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { Head, Link } from '@inertiajs/react';

type ErrorPageProps = {
    status: 403 | 404 | 500;
};

const errorContent = {
    403: {
        title: { ar: 'غير مسموح', en: 'Forbidden' },
        description: {
            ar: 'ليس لديك صلاحية للوصول إلى هذه الصفحة.',
            en: "You don't have permission to access this page.",
        },
    },
    404: {
        title: { ar: 'الصفحة غير موجودة', en: 'Page not found' },
        description: {
            ar: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
            en: 'The page you are looking for does not exist or has been moved.',
        },
    },
    500: {
        title: { ar: 'حدث خطأ في السيرفر', en: 'Server error' },
        description: {
            ar: 'حدث خطأ غير متوقع. حاول مرة أخرى بعد قليل.',
            en: 'An unexpected error occurred. Please try again later.',
        },
    },
} as const;

export default function Error({ status }: ErrorPageProps) {
    const { translate } = useLanguage();
    const content = errorContent[status] ?? errorContent[500];

    return (
        <>
            <Head title={`${status} - ${translate(content.title)}`} />

            <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-12 dark:bg-slate-950">
                <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                    <p className="avora-text-primary text-8xl font-black tracking-tight">{status}</p>
                    <h1 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">
                        {translate(content.title)}
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                        {translate(content.description)}
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/dashboard">
                            <Button rounded="lg">
                                {translate({ ar: 'العودة للداشبورد', en: 'Back to dashboard' })}
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" rounded="lg">
                                {translate({ ar: 'الصفحة الرئيسية', en: 'Home page' })}
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
