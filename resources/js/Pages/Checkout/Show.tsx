import { Button } from "@/avora-dash/components/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardMeta,
    CardTitle,
} from "@/avora-dash/components/Card";
import { Container } from "@/avora-dash/components/Container";
import { LanguageButton } from "@/avora-dash/components/LanguageButton";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import ModeButton from "@/avora-dash/providers/ModeButton";
import { PageProps, PaymentTransaction } from "@/types";
import { Head, Link } from "@inertiajs/react";

type CheckoutShowProps = PageProps<{
    transaction: PaymentTransaction;
}>;

const statusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
        pending: {
            ar: "بانتظار ربط البوابة",
            en: "Waiting for gateway adapter",
        },
        redirected: { ar: "تم التحويل للبوابة", en: "Redirected to gateway" },
        paid_waiting_webhook: {
            ar: "مدفوع مبدئيًا - بانتظار تأكيد Webhook",
            en: "Paid - waiting webhook confirmation",
        },
        cancelled: { ar: "تم إلغاء الدفع", en: "Payment cancelled" },
        failed: { ar: "فشل الدفع", en: "Payment failed" },
    };

    return labels[status] ?? { ar: status, en: status };
};

export default function CheckoutShow({ transaction }: CheckoutShowProps) {
    const { translate } = useLanguage();
    const label = statusLabel(transaction.status);
    const gatewayReady = Boolean(transaction.checkout_url);

    return (
        <>
            <Head
                title={translate({ ar: "تفاصيل الدفع", en: "Payment details" })}
            />

            <main className="min-h-screen bg-slate-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
                <Container className="space-y-6">
                    <div className="flex items-center justify-between gap-3">
                        <Link
                            href={route("home")}
                            className="text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                        >
                            {translate({
                                ar: "← رجوع للموقع",
                                en: "← Back to website",
                            })}
                        </Link>
                        <div className="flex gap-2">
                            <LanguageButton />
                            <ModeButton />
                        </div>
                    </div>

                    <Card
                        variant="elevated"
                        padding="lg"
                        className="mx-auto max-w-3xl"
                    >
                        <CardHeader>
                            <CardMeta>{transaction.uuid}</CardMeta>
                            <CardTitle>
                                {translate({
                                    ar: "طلب الدفع جاهز",
                                    en: "Checkout request is ready",
                                })}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="grid gap-3 rounded-2xl bg-slate-100 p-5 text-sm dark:bg-slate-900 md:grid-cols-2">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {translate({
                                            ar: "المنتج",
                                            en: "Product",
                                        })}
                                    </p>
                                    <p className="mt-1 font-bold">
                                        {transaction.product_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {translate({
                                            ar: "المبلغ",
                                            en: "Amount",
                                        })}
                                    </p>
                                    <p className="mt-1 font-bold">
                                        {transaction.amount_decimal}{" "}
                                        {transaction.currency}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {translate({
                                            ar: "البوابة",
                                            en: "Gateway",
                                        })}
                                    </p>
                                    <p className="mt-1 font-bold">
                                        {transaction.gateway_name ??
                                            transaction.gateway_slug}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {translate({
                                            ar: "الحالة",
                                            en: "Status",
                                        })}
                                    </p>
                                    <p className="mt-1 font-bold">
                                        {translate(label)}
                                    </p>
                                </div>
                            </div>

                            {gatewayReady ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
                                    <p className="font-bold">
                                        {translate({
                                            ar: "لو التحويل لم يفتح تلقائيًا",
                                            en: "If redirect did not open automatically",
                                        })}
                                    </p>
                                    <p className="mt-2 text-sm">
                                        {translate({
                                            ar: "اضغط الزر التالي لاستكمال الدفع على بوابة الدفع.",
                                            en: "Use the button below to continue payment on the gateway checkout.",
                                        })}
                                    </p>
                                    <a
                                        href={transaction.checkout_url ?? "#"}
                                        className="mt-4 inline-flex"
                                    >
                                        <Button>
                                            {translate({
                                                ar: "استكمال الدفع",
                                                en: "Continue payment",
                                            })}
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                                    <p className="font-bold">
                                        {translate({
                                            ar: "البوابة متسجلة لكن API لسه محتاج توصيل",
                                            en: "Gateway is selected, but its API adapter still needs wiring",
                                        })}
                                    </p>
                                    <p className="mt-2 text-sm leading-7">
                                        {translate({
                                            ar: "الطلب اتسجل عندنا برقم وحالة. الخطوة الجاية لكل بوابة: نبعت المبلغ وبيانات الطلب لـ API البوابة، ناخد checkout URL أو iframe، وبعد الدفع نستقبل Webhook لتأكيد الحالة.",
                                            en: "The order is saved with a reference and status. Next, each gateway adapter sends the amount/order data to the provider API, receives a checkout URL or iframe, then listens to webhooks for final confirmation.",
                                        })}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </main>
        </>
    );
}
