import { DashboardHomeInclude, DashboardModuleInclude } from '@/includes';
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
            ) : (
                <DashboardModuleInclude section={section} />
            )}
        </>
    );
}
