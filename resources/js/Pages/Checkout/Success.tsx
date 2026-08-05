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
import { FaCircleCheck } from "react-icons/fa6";

type CheckoutResultProps = PageProps<{
    transaction: PaymentTransaction;
}>;

export default function CheckoutSuccess({ transaction }: CheckoutResultProps) {
    const { translate } = useLanguage();

    return (
        <>
            <Head
                title={translate({
                    ar: "تم الدفع بنجاح",
                    en: "Payment successful",
                })}
            />

            <main className="min-h-screen bg-emerald-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
                <Container className="space-y-6">
                    <div className="flex items-center justify-end gap-2">
                        <LanguageButton />
                        <ModeButton />
                    </div>

                    <Card
                        variant="elevated"
                        padding="lg"
                        className="mx-auto max-w-2xl text-center"
                    >
                        <CardHeader>
                            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                <FaCircleCheck className="h-10 w-10" />
                            </div>
                            <CardMeta className="mt-5">
                                {transaction.uuid}
                            </CardMeta>
                            <CardTitle>
                                {translate({
                                    ar: "العملية تمت بنجاح",
                                    en: "Payment completed successfully",
                                })}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <p className="text-sm leading-7 text-slate-500 dark:text-slate-300">
                                {translate({
                                    ar: "وصلنا رد نجاح من بوابة الدفع. لو الـ Webhook متوصل، حالة الطلب هتتأكد تلقائيًا من البوابة.",
                                    en: "We received a successful redirect from the gateway. If the webhook is connected, the order status will be confirmed automatically.",
                                })}
                            </p>

                            <div className="rounded-2xl bg-slate-100 p-5 text-start text-sm dark:bg-slate-900">
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">
                                        {translate({
                                            ar: "المنتج",
                                            en: "Product",
                                        })}
                                    </span>
                                    <span className="font-bold">
                                        {transaction.product_name}
                                    </span>
                                </div>
                                <div className="mt-3 flex justify-between gap-4">
                                    <span className="text-slate-500">
                                        {translate({
                                            ar: "المبلغ",
                                            en: "Amount",
                                        })}
                                    </span>
                                    <span className="font-bold">
                                        {transaction.amount_decimal}{" "}
                                        {transaction.currency}
                                    </span>
                                </div>
                                <div className="mt-3 flex justify-between gap-4">
                                    <span className="text-slate-500">
                                        {translate({
                                            ar: "البوابة",
                                            en: "Gateway",
                                        })}
                                    </span>
                                    <span className="font-bold">
                                        {transaction.gateway_name ??
                                            transaction.gateway_slug}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3">
                                <Link href={route("home")}>
                                    <Button>
                                        {translate({
                                            ar: "الرجوع للموقع",
                                            en: "Back to website",
                                        })}
                                    </Button>
                                </Link>
                                <Link
                                    href={route(
                                        "checkout.show",
                                        transaction.uuid,
                                    )}
                                >
                                    <Button variant="outline">
                                        {translate({
                                            ar: "تفاصيل الطلب",
                                            en: "Order details",
                                        })}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </main>
        </>
    );
}
