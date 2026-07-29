import { DashboardLayout } from '@/Layouts/DashboardLayout';
import { Button } from '@/avora-dash/components/Button';
import { FormField } from '@/avora-dash/components/forms/FormField';
import { Select } from '@/avora-dash/components/forms/Select';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import type { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Analytics = {
    total_items: number;
    customers_count: number;
    products_count: number;
    top_products: { id: number; name_ar: string; name_en: string; favorites_count: number; customers_count: number; image: string | null }[];
    items: { id: number; created_at: string; customer_name: string; customer_email: string; name_ar: string; name_en: string; price: string; image: string | null }[];
    filters: { period: string; from: string | null; to: string | null };
};

export function FavoriteAnalyticsPage() {
    const { translate, direction } = useLanguage();
    const { favoriteAnalytics } = usePage<PageProps<{ favoriteAnalytics: Analytics }>>().props;
    const [period, setPeriod] = useState(favoriteAnalytics.filters.period);
    const [from, setFrom] = useState(favoriteAnalytics.filters.from ?? '');
    const [to, setTo] = useState(favoriteAnalytics.filters.to ?? '');
    const updatePeriod = (value: string) => {
        setPeriod(value);
        if (value !== 'custom') router.get(route('dashboard.favorites'), { period: value }, { preserveState: true });
    };
    const stats = [
        [translate({ ar: 'إجمالي الإضافات للمفضلة', en: 'Total favorites' }), favoriteAnalytics.total_items],
        [translate({ ar: 'عملاء لديهم مفضلة', en: 'Customers with favorites' }), favoriteAnalytics.customers_count],
        [translate({ ar: 'منتجات مفضلة', en: 'Favorited products' }), favoriteAnalytics.products_count],
    ];

    return (
        <DashboardLayout>
            <header className="mb-6">
                <p className="text-sm font-semibold text-rose-600">Store insights</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">{translate({ ar: 'المنتجات المفضلة', en: 'Favorite products' })}</h1>
                <p className="mt-2 text-sm text-slate-500">{translate({ ar: 'تابع المنتجات التي يهتم بها عملاؤك أكثر.', en: 'Track the products your customers care about most.' })}</p>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                    <Select label={translate({ ar: 'الفترة', en: 'Period' })} value={period} onChange={(value) => value && updatePeriod(value)} className="w-52" options={[
                        { value: 'today', label: translate({ ar: 'اليوم', en: 'Today' }) },
                        { value: 'week', label: translate({ ar: 'هذا الأسبوع', en: 'This week' }) },
                        { value: 'month', label: translate({ ar: 'هذا الشهر', en: 'This month' }) },
                        { value: 'all', label: translate({ ar: 'كل الوقت', en: 'All time' }) },
                        { value: 'custom', label: translate({ ar: 'فترة مخصصة', en: 'Custom range' }) },
                    ]} />
                    {period === 'custom' && <><FormField label="From" value={from} onChange={(event) => setFrom(event.target.value)} type="date" /><FormField label="To" value={to} onChange={(event) => setTo(event.target.value)} type="date" /><Button type="button" onClick={() => router.get(route('dashboard.favorites'), { period: 'custom', from, to }, { preserveState: true })}>Apply</Button></>}
                </div>
            </header>

            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p></article>)}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[.85fr_1.15fr]" dir={direction}>
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800"><h2 className="font-bold text-slate-950 dark:text-white">{translate({ ar: 'الأكثر إضافة للمفضلة', en: 'Most favorited' })}</h2></div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {favoriteAnalytics.top_products.length ? favoriteAnalytics.top_products.map((product, index) => <div key={product.id} className="flex items-center gap-3 p-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-rose-100 text-sm font-black text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{index + 1}</span>{product.image ? <img src={`/storage/${product.image}`} alt="" className="h-11 w-11 rounded-xl object-cover" /> : <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800" />}<div className="min-w-0 flex-1"><p className="truncate font-bold">{direction === 'rtl' ? product.name_ar : product.name_en}</p><p className="mt-1 text-xs text-slate-500">{product.customers_count} {translate({ ar: 'عملاء', en: 'customers' })}</p></div><strong>{product.favorites_count}</strong></div>) : <p className="p-8 text-center text-sm text-slate-500">{translate({ ar: 'لا توجد منتجات مفضلة بعد.', en: 'No favorite activity yet.' })}</p>}
                    </div>
                </section>
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800"><h2 className="font-bold text-slate-950 dark:text-white">{translate({ ar: 'أحدث نشاط في المفضلة', en: 'Latest favorite activity' })}</h2></div>
                    <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-sm"><thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/70"><tr><th className="px-5 py-4 text-start">{translate({ ar: 'العميل', en: 'Customer' })}</th><th className="px-5 py-4 text-start">{translate({ ar: 'المنتج', en: 'Product' })}</th><th className="px-5 py-4 text-start">{translate({ ar: 'السعر', en: 'Price' })}</th><th className="px-5 py-4 text-start">{translate({ ar: 'تاريخ الإضافة', en: 'Added at' })}</th></tr></thead><tbody>{favoriteAnalytics.items.length ? favoriteAnalytics.items.map((item) => <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-5 py-4"><p className="font-bold">{item.customer_name}</p><p className="text-xs text-slate-500">{item.customer_email}</p></td><td className="px-5 py-4 font-semibold">{direction === 'rtl' ? item.name_ar : item.name_en}</td><td className="px-5 py-4">{item.price}</td><td className="px-5 py-4 text-slate-500">{item.created_at}</td></tr>) : <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-500">{translate({ ar: 'لا يوجد نشاط حتى الآن.', en: 'No activity yet.' })}</td></tr>}</tbody></table></div>
                </section>
            </div>
        </DashboardLayout>
    );
}
