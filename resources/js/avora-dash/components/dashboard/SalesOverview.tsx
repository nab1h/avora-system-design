import { useLanguage } from '../../providers/LanguageProvider';

const monthlyValues = [42, 55, 48, 70, 62, 78, 68, 86, 73, 92, 82, 96];

export function SalesOverview() {
    const { language, translate } = useLanguage();
    const months = language === 'ar'
        ? ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <article className="avora-surface avora-border rounded-2xl border p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">{translate({ ar: 'نظرة عامة على المبيعات', en: 'Sales overview' })}</h2>
                    <p className="avora-muted mt-1 text-sm">{translate({ ar: 'أداء المبيعات خلال العام الحالي', en: 'Sales performance during the current year' })}</p>
                </div>
                <select className="avora-form-field avora-surface avora-border rounded-lg border py-2 text-xs font-medium">
                    <option>{translate({ ar: 'هذا العام', en: 'This year' })}</option>
                </select>
            </div>
            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-3">
                {monthlyValues.map((value, index) => (
                    <div key={months[index]} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
                        <div className="avora-surface-muted group relative flex flex-1 items-end rounded-t-md">
                            <div style={{ height: `${value}%` }} className="avora-sales-bar w-full rounded-t-md transition hover:brightness-90">
                                <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-1 text-[10px] text-white group-hover:block">{value}K</span>
                            </div>
                        </div>
                        <span className="truncate text-center text-[10px] text-slate-400 sm:text-xs">{months[index]}</span>
                    </div>
                ))}
            </div>
        </article>
    );
}
