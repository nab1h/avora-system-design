import { useLanguage } from '../../providers/LanguageProvider';

export type MonthlySale = {
    month: string;
    amount: number;
};

type SalesOverviewProps = {
    values?: MonthlySale[];
};

export function SalesOverview({ values = [] }: SalesOverviewProps) {
    const { language, translate } = useLanguage();
    const fallbackMonths = language === 'ar'
        ? ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const months = values.length > 0
        ? values.map((item, index) => language === 'ar' ? fallbackMonths[index] : item.month)
        : fallbackMonths;
    const amounts = values.length > 0 ? values.map((item) => item.amount) : fallbackMonths.map(() => 0);
    const maxAmount = Math.max(...amounts, 1);

    return (
        <article className="avora-surface avora-border rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                        {translate({ ar: 'نظرة عامة على المبيعات', en: 'Sales overview' })}
                    </h2>
                    <p className="avora-muted mt-1 text-sm">
                        {translate({ ar: 'المبيعات المدفوعة خلال السنة الحالية من قاعدة البيانات', en: 'Paid sales during the current year from the database' })}
                    </p>
                </div>
                <select className="avora-form-field avora-surface avora-border rounded-lg border py-2 text-xs font-medium">
                    <option>{translate({ ar: 'هذا العام', en: 'This year' })}</option>
                </select>
            </div>
            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-3">
                {amounts.map((amount, index) => {
                    const height = Math.max(4, Math.round((amount / maxAmount) * 100));

                    return (
                        <div key={`${months[index]}-${index}`} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
                            <div className="avora-surface-muted group relative flex flex-1 items-end rounded-t-md">
                                <div style={{ height: `${height}%` }} className="avora-sales-bar w-full rounded-t-md transition hover:brightness-90">
                                    <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-1 text-[10px] text-white group-hover:block">
                                        {amount.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                    </span>
                                </div>
                            </div>
                            <span className="truncate text-center text-[10px] text-slate-400 sm:text-xs">{months[index]}</span>
                        </div>
                    );
                })}
            </div>
        </article>
    );
}
