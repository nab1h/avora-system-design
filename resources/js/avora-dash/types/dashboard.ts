export type DashboardTranslation = {
    ar: string;
    en: string;
};

export type DashboardIconName =
    | 'dashboard'
    | 'orders'
    | 'products'
    | 'customers'
    | 'reports'
    | 'calendar'
    | 'forms'
    | 'tables'
    | 'components'
    | 'settings'
    | 'profile'
    | 'sales'
    | 'menu'
    | 'search'
    | 'bell'
    | 'arrow-up'
    | 'arrow-down'
    | 'close'
    | 'logout';

export type DashboardNavItem = {
    label: DashboardTranslation;
    icon: DashboardIconName;
    href?: string;
    badge?: DashboardTranslation;
};
