import { DashboardLayout } from "@/Layouts/DashboardLayout";
import { PageProps } from "@/types";
import { Button } from "@/avora-dash/components/Button";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { Select } from "@/avora-dash/components/forms/Select";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

type CartAnalytics = {
    total_items: number;
    total_quantity: number;
    customers_count: number;
    products_count: number;
    top_products: {
        id: number;
        name_ar: string;
        name_en: string;
        total_quantity: number;
        customers_count: number;
        image: string | null;
    }[];
    items: {
        id: number;
        quantity: number;
        updated_at: string;
        customer_name: string;
        customer_email: string;
        name_ar: string;
        name_en: string;
        price: string;
        image: string | null;
    }[];
    filters: { period: string; from: string | null; to: string | null };
};

export function CartAnalyticsPage() {
    const { translate, direction } = useLanguage();
    const { cartAnalytics } =
        usePage<PageProps<{ cartAnalytics: CartAnalytics }>>().props;
    const [period, setPeriod] = useState(cartAnalytics.filters.period);
    const [from, setFrom] = useState(cartAnalytics.filters.from ?? "");
    const [to, setTo] = useState(cartAnalytics.filters.to ?? "");
    const updatePeriod = (value: string) => {
        setPeriod(value);
        if (value !== "custom") {
            router.get(
                route("dashboard.carts"),
                { period: value },
                { preserveState: true },
            );
        }
    };
    const stats = [
        [
            translate({ ar: "منتجات داخل السلات", en: "Cart product lines" }),
            cartAnalytics.total_items,
        ],
        [
            translate({ ar: "إجمالي الكميات", en: "Total quantities" }),
            cartAnalytics.total_quantity,
        ],
        [
            translate({ ar: "عملاء لديهم سلة", en: "Customers with carts" }),
            cartAnalytics.customers_count,
        ],
        [
            translate({ ar: "منتجات نشطة", en: "Active products" }),
            cartAnalytics.products_count,
        ],
    ];

    return (
        <DashboardLayout>
            <header className="mb-6">
                <p className="text-sm font-semibold text-emerald-600">
                    Store insights
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                    {translate({ ar: "عربات التسوق", en: "Shopping carts" })}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {translate({
                        ar: "تابع اهتمامات العملاء والمنتجات الأكثر إضافة إلى السلة.",
                        en: "Track customer intent and the products most often added to carts.",
                    })}
                </p>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                    <Select
                        label={translate({ ar: "الفترة", en: "Period" })}
                        value={period}
                        onChange={(value) => value && updatePeriod(value)}
                        className="w-52"
                        options={[
                            {
                                value: "today",
                                label: translate({ ar: "اليوم", en: "Today" }),
                            },
                            {
                                value: "week",
                                label: translate({
                                    ar: "هذا الأسبوع",
                                    en: "This week",
                                }),
                            },
                            {
                                value: "month",
                                label: translate({
                                    ar: "هذا الشهر",
                                    en: "This month",
                                }),
                            },
                            {
                                value: "all",
                                label: translate({
                                    ar: "كل الوقت",
                                    en: "All time",
                                }),
                            },
                            {
                                value: "custom",
                                label: translate({
                                    ar: "فترة مخصصة",
                                    en: "Custom range",
                                }),
                            },
                        ]}
                    />
                    {period === "custom" && (
                        <>
                            <FormField
                                label="From"
                                value={from}
                                onChange={(event) =>
                                    setFrom(event.target.value)
                                }
                                type="date"
                            />
                            <FormField
                                label="To"
                                value={to}
                                onChange={(event) => setTo(event.target.value)}
                                type="date"
                            />
                            <Button
                                type="button"
                                onClick={() =>
                                    router.get(
                                        route("dashboard.carts"),
                                        { period: "custom", from, to },
                                        { preserveState: true },
                                    )
                                }
                            >
                                Apply
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([label, value]) => (
                    <article
                        key={String(label)}
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
                    >
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                            {value}
                        </p>
                    </article>
                ))}
            </div>

            <div
                className="mt-6 grid gap-6 xl:grid-cols-[.85fr_1.15fr]"
                dir={direction}
            >
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                        <h2 className="font-bold text-slate-950 dark:text-white">
                            {translate({
                                ar: "الأكثر إضافة للسلة",
                                en: "Most added to carts",
                            })}
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {cartAnalytics.top_products.length ? (
                            cartAnalytics.top_products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 p-4"
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        {index + 1}
                                    </span>
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt=""
                                            className="h-11 w-11 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-bold">
                                            {direction === "rtl"
                                                ? product.name_ar
                                                : product.name_en}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {product.customers_count}{" "}
                                            {translate({
                                                ar: "عملاء",
                                                en: "customers",
                                            })}
                                        </p>
                                    </div>
                                    <strong>{product.total_quantity}</strong>
                                </div>
                            ))
                        ) : (
                            <p className="p-8 text-center text-sm text-slate-500">
                                {translate({
                                    ar: "لا توجد منتجات في السلات بعد.",
                                    en: "No cart activity yet.",
                                })}
                            </p>
                        )}
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                        <h2 className="font-bold text-slate-950 dark:text-white">
                            {translate({
                                ar: "أحدث نشاط في السلات",
                                en: "Latest cart activity",
                            })}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/70">
                                <tr>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "العميل",
                                            en: "Customer",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "المنتج",
                                            en: "Product",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({ ar: "الكمية", en: "Qty" })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "السعر",
                                            en: "Price",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "آخر تحديث",
                                            en: "Last updated",
                                        })}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartAnalytics.items.length ? (
                                    cartAnalytics.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-slate-100 dark:border-slate-800"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-bold">
                                                    {item.customer_name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {item.customer_email}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">
                                                {direction === "rtl"
                                                    ? item.name_ar
                                                    : item.name_en}
                                            </td>
                                            <td className="px-5 py-4">
                                                {item.quantity}
                                            </td>
                                            <td className="px-5 py-4">
                                                {item.price}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500">
                                                {item.updated_at}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-10 text-center text-slate-500"
                                        >
                                            {translate({
                                                ar: "لا يوجد نشاط حتى الآن.",
                                                en: "No activity yet.",
                                            })}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
