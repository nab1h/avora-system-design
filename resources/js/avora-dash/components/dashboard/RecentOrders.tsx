import { Link } from '@inertiajs/react';
import { useLanguage } from '../../providers/LanguageProvider';
import { Button } from '../Button';

export type RecentOrder = {
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: string;
    gateway?: string | null;
};

type RecentOrdersProps = {
    orders?: RecentOrder[];
};

function normalizeStatus(status: string) {
    if (['paid', 'paid_waiting_webhook'].includes(status)) {
        return 'completed';
    }

    if (['failed', 'cancelled'].includes(status)) {
        return 'cancelled';
    }

    return 'pending';
}

export function RecentOrders({ orders = [] }: RecentOrdersProps) {
    const { translate } = useLanguage();
    const status = {
        completed: translate({ ar: 'مكتمل', en: 'Completed' }),
        pending: translate({ ar: 'قيد المراجعة', en: 'Pending' }),
        cancelled: translate({ ar: 'ملغي / فشل', en: 'Cancelled / failed' }),
    };
    const statusClasses = {
        completed: 'avora-status-success',
        pending: 'avora-status-warning',
        cancelled: 'avora-status-danger',
    };

    return (
        <article className="avora-surface avora-border overflow-hidden rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                        {translate({ ar: 'أحدث عمليات الشراء', en: 'Recent purchases' })}
                    </h2>
                    <p className="avora-muted mt-1 text-sm">
                        {translate({ ar: 'آخر العمليات المسجلة من قاعدة البيانات', en: 'Latest database transactions' })}
                    </p>
                </div>
                <Link href="/dashboard/purchases">
                    <Button type="button" variant="ghost" size="sm" className="avora-text-primary">
                        {translate({ ar: 'عرض الكل', en: 'View all' })}
                    </Button>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-start text-sm">
                    <thead className="avora-surface-muted avora-muted text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'رقم العملية', en: 'Transaction' })}</th>
                            <th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'العميل', en: 'Customer' })}</th>
                            <th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'المنتج', en: 'Product' })}</th>
                            <th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'البوابة', en: 'Gateway' })}</th>
                            <th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'القيمة', en: 'Amount' })}</th>
                            <th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'الحالة', en: 'Status' })}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                                    {translate({ ar: 'لا توجد عمليات شراء حتى الآن.', en: 'No purchases yet.' })}
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const normalizedStatus = normalizeStatus(order.status);

                                return (
                                    <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/70">
                                        <td className="avora-text-primary px-6 py-4 font-semibold">{order.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{order.customer}</td>
                                        <td className="px-6 py-4 text-slate-500">{order.product}</td>
                                        <td className="px-6 py-4 text-slate-500">{order.gateway ?? '-'}</td>
                                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[normalizedStatus]}`}>
                                                {status[normalizedStatus]}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
