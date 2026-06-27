import type { DashboardIconName, DashboardTranslation } from '../../types/dashboard';
import { useLanguage } from '../../providers/LanguageProvider';
import { DashboardIcon } from '../DashboardIcon';

type MetricCardProps = {
    label: DashboardTranslation;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: DashboardIconName;
    color: 'blue' | 'violet' | 'emerald' | 'amber';
};

const colors = {
    blue: 'avora-bg-primary-soft avora-text-primary',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
};

export function MetricCard({ label, value, change, trend, icon, color }: MetricCardProps) {
    const { translate } = useLanguage();
    return (
        <article className="avora-surface avora-border rounded-2xl border p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="avora-muted text-sm font-medium">{translate(label)}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
                </div>
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${colors[color]}`}><DashboardIcon name={icon} /></span>
            </div>
            <p className={`mt-4 flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                <DashboardIcon name={trend === 'up' ? 'arrow-up' : 'arrow-down'} className="h-3.5 w-3.5" />
                {change}
                <span className="font-normal text-slate-400">{translate({ ar: 'مقارنة بالشهر الماضي', en: 'vs last month' })}</span>
            </p>
        </article>
    );
}
