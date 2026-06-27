import { useLanguage } from '../../providers/LanguageProvider';
import { Button } from '../Button';

const orders = [
    { id: '#AV-1048', customer: 'أحمد محمود', product: 'باقة الأعمال', amount: '2,450 ج.م', status: 'completed' },
    { id: '#AV-1047', customer: 'سارة محمد', product: 'الباقة المتقدمة', amount: '1,890 ج.م', status: 'pending' },
    { id: '#AV-1046', customer: 'محمود علي', product: 'الباقة الأساسية', amount: '920 ج.م', status: 'completed' },
    { id: '#AV-1045', customer: 'نور خالد', product: 'باقة الأعمال', amount: '2,450 ج.م', status: 'cancelled' },
];

export function RecentOrders() {
    const { translate } = useLanguage();
    const status = {
        completed: translate({ ar: 'مكتمل', en: 'Completed' }),
        pending: translate({ ar: 'قيد المراجعة', en: 'Pending' }),
        cancelled: translate({ ar: 'ملغي', en: 'Cancelled' }),
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
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">{translate({ ar: 'أحدث الطلبات', en: 'Recent orders' })}</h2>
                    <p className="avora-muted mt-1 text-sm">{translate({ ar: 'آخر العمليات المسجلة في المتجر', en: 'Latest activity in your store' })}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" className="avora-text-primary">{translate({ ar: 'عرض الكل', en: 'View all' })}</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-start text-sm">
                    <thead className="avora-surface-muted avora-muted text-xs uppercase">
                        <tr><th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'رقم الطلب', en: 'Order' })}</th><th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'العميل', en: 'Customer' })}</th><th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'المنتج', en: 'Product' })}</th><th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'القيمة', en: 'Amount' })}</th><th className="px-6 py-3 text-start font-semibold">{translate({ ar: 'الحالة', en: 'Status' })}</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/70">
                                <td className="avora-text-primary px-6 py-4 font-semibold">{order.id}</td><td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{order.customer}</td><td className="px-6 py-4 text-slate-500">{order.product}</td><td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{order.amount}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.status as keyof typeof statusClasses]}`}>{status[order.status as keyof typeof status]}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </article>
    );
}
