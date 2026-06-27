import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { MetricCard } from '@/avora-dash/components/dashboard/MetricCard';
import { RecentOrders } from '@/avora-dash/components/dashboard/RecentOrders';
import { SalesOverview } from '@/avora-dash/components/dashboard/SalesOverview';
import { DashboardLayout } from '@/Layouts/DashboardLayout';
import { DashboardIcon } from '@/avora-dash/components/DashboardIcon';

export function DashboardHomeInclude() {
    const { auth, dashboardStats } = usePage<PageProps<{ dashboardStats?: { usersCount: number; rolesCount: number } }>>().props;
    const { language, translate } = useLanguage();
    const userPermissions = auth.user.permissions ?? [];
    const managementCards = [
        {
            title: { ar: 'إدارة المستخدمين', en: 'User management' },
            description: {
                ar: 'أضف وعدّل المستخدمين وتحكم في حالة كل حساب من مكان واحد.',
                en: 'Add, edit, and control user accounts from one place.',
            },
            href: '/dashboard/users',
            permission: 'users.manage',
            icon: 'customers' as const,
            stats: { ar: `${dashboardStats?.usersCount ?? 0} مستخدم`, en: `${dashboardStats?.usersCount ?? 0} users` },
        },
        {
            title: { ar: 'إدارة الصلاحيات', en: 'Permission management' },
            description: {
                ar: 'نظّم الأدوار والصلاحيات وحدد من يستطيع الوصول لكل جزء.',
                en: 'Organize roles and permissions, and control access across modules.',
            },
            href: '/dashboard/permissions',
            permission: 'permissions.manage',
            icon: 'settings' as const,
            stats: { ar: `${dashboardStats?.rolesCount ?? 0} أدوار`, en: `${dashboardStats?.rolesCount ?? 0} roles` },
        },
        {
            title: { ar: 'إعدادات الموقع', en: 'Website settings' },
            description: {
                ar: 'تحكم في اسم الموقع واللوجو والأيقونات والتواصل والسوشيال وSMTP.',
                en: 'Manage website name, logo, icons, contact, social links, and SMTP.',
            },
            href: '/dashboard/settings',
            permission: 'settings.manage',
            icon: 'settings' as const,
            stats: { ar: 'هوية الموقع', en: 'Website identity' },
        },
    ].filter((card) => userPermissions.includes(card.permission));

    return (
        <DashboardLayout>
            <section className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="avora-text-primary text-sm font-medium">{translate({ ar: 'لوحة التحكم', en: 'Dashboard' })}</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                        {translate({ ar: `أهلًا، ${auth.user.name}`, en: `Welcome, ${auth.user.name}` })}
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">{translate({ ar: 'إليك ملخص سريع لأداء نشاطك اليوم.', en: "Here's a quick summary of your business today." })}</p>
                </div>
                <p className="avora-surface avora-border avora-muted rounded-xl border px-4 py-2 text-sm font-medium">
                    {new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'long' }).format(new Date())}
                </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label={{ ar: 'إجمالي المبيعات', en: 'Total sales' }} value="48,200 ج.م" change="18.4%" trend="up" icon="sales" color="blue" />
                <MetricCard label={{ ar: 'إجمالي الطلبات', en: 'Total orders' }} value="1,248" change="12.1%" trend="up" icon="orders" color="violet" />
                <MetricCard label={{ ar: 'عملاء جدد', en: 'New customers' }} value="356" change="8.7%" trend="up" icon="customers" color="emerald" />
                <MetricCard label={{ ar: 'معدل الاسترداد', en: 'Refund rate' }} value="2.4%" change="0.6%" trend="down" icon="reports" color="amber" />
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-2">
                {managementCards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="group avora-surface avora-border relative overflow-hidden rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/20"
                    >
                        <div className="absolute end-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-[var(--avora-primary)]/10 transition group-hover:scale-125" />
                        <div className="relative flex items-start gap-4">
                            <span className="avora-bg-primary-soft avora-text-primary grid h-14 w-14 shrink-0 place-items-center rounded-2xl">
                                <DashboardIcon name={card.icon} className="h-7 w-7" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-lg font-black text-slate-950 dark:text-white">{translate(card.title)}</h2>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {translate(card.stats)}
                                    </span>
                                </div>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{translate(card.description)}</p>
                                <p className="avora-text-primary mt-5 inline-flex items-center gap-2 text-sm font-bold">
                                    {translate({ ar: 'فتح الإدارة', en: 'Open management' })}
                                    <span className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2"><SalesOverview /></div>
                <article className="avora-goal-card avora-border rounded-2xl border p-6 text-white shadow-sm">
                    <p className="text-sm text-white/70">{translate({ ar: 'الهدف الشهري', en: 'Monthly target' })}</p>
                    <p className="mt-2 text-3xl font-bold">78%</p>
                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="avora-progress-primary h-full w-[78%] rounded-full" /></div>
                    <p className="mt-5 text-sm leading-6 text-slate-300">{translate({ ar: 'أنت قريب جدًا من تحقيق هدف هذا الشهر. استمر على نفس الأداء!', en: "You're very close to this month's target. Keep it going!" })}</p>
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                        <div><p className="text-xs text-slate-400">{translate({ ar: 'المحقق', en: 'Achieved' })}</p><p className="mt-1 font-bold">78,000 ج.م</p></div>
                        <div><p className="text-xs text-slate-400">{translate({ ar: 'المتبقي', en: 'Remaining' })}</p><p className="mt-1 font-bold">22,000 ج.م</p></div>
                    </div>
                </article>
            </section>

            <section className="mt-6"><RecentOrders /></section>
        </DashboardLayout>
    );
}
