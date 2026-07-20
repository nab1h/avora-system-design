import type { DashboardNavItem } from '../types/dashboard';

export const dashboardNavigation: DashboardNavItem[] = [
    {
        label: { ar: 'لوحة التحكم', en: 'Dashboard' },
        icon: 'dashboard',
        href: '/dashboard',
    },
    {
        label: { ar: 'الطلبات', en: 'Orders' },
        icon: 'orders',
        href: '/dashboard/orders',
    },
    {
        label: { ar: 'المشتريات', en: 'Purchases' },
        icon: 'purchases',
        href: '/dashboard/purchases',
    },
    {
        label: { ar: 'المنتجات', en: 'Products' },
        icon: 'products',
        href: '/dashboard/products',
    },
    {
        label: { ar: 'العملاء', en: 'Customers' },
        icon: 'customers',
        href: '/dashboard/customers',
    },
    {
        label: { ar: 'التقارير', en: 'Reports' },
        icon: 'reports',
        href: '/dashboard/reports',
    },
    {
        label: { ar: 'التقويم', en: 'Calendar' },
        icon: 'calendar',
        href: '/dashboard/calendar',
    },
    {
        label: { ar: 'النماذج', en: 'Forms' },
        icon: 'forms',
        href: '/dashboard/forms',
    },
    {
        label: { ar: 'الجداول', en: 'Tables' },
        icon: 'tables',
        href: '/dashboard/tables',
    },
    {
        label: { ar: 'عناصر الواجهة', en: 'UI elements' },
        icon: 'components',
        href: '/dashboard/ui-elements',
    },
    {
        label: { ar: 'المدفوعات', en: 'Payments' },
        icon: 'payments',
        href: '/dashboard/payments',
    },
];

export const dashboardProperties: DashboardNavItem[] = [
    {
        label: { ar: "خصائص المنتجات", en: "Products Properties" },
        icon: "orders",
        href: "/dashboard/attributes",
    },
    {
        label: { ar: "الأصناف", en: "Categories" },
        icon: "orders",
        href: "/dashboard/categories",
    },
    {
        label: { ar: "الأصناف الفرعية", en: "subCategories" },
        icon: "orders",
        href: "/dashboard/subcategories",
    },
    {
        label: { ar: "الفئة", en: "classes" },
        icon: "orders",
        href: "/dashboard/classes",
    },

    {
        label: { ar: "العروض", en: "Offers" },
        icon: "orders",
        href: "/dashboard/offers",
    },
];

export const dashboardAccountNavigation: DashboardNavItem[] = [
    {
        label: { ar: 'الملف الشخصي', en: 'Profile' },
        icon: 'profile',
        href: '/profile',
    },
    {
        label: { ar: 'الإعدادات', en: 'Settings' },
        icon: 'settings',
        href: '/dashboard/settings',
    },
];
