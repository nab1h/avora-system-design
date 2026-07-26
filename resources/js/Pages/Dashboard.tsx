import { DashboardHomeInclude, DashboardModuleInclude } from '@/includes';
import { CartAnalyticsPage } from '@/Pages/dashboard/CartAnalyticsPage';
import { Head } from '@inertiajs/react';

type DashboardProps = {
    section?: string;
};

export default function Dashboard({ section = 'overview' }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            {section === 'overview' ? (
                <DashboardHomeInclude />
            ) : section === 'carts' ? (
                <CartAnalyticsPage />
            ) : (
                <DashboardModuleInclude section={section} />
            )}
        </>
    );
}
