import { FormButton } from "@/avora-dash/Components/forms/FormButton";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { AuthLayout } from "@/Layouts/AuthLayout";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { translate } = useLanguage();
    const { data, setData, post, processing, errors } = useForm({ email: "" });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route("password.email"));
    };
    return (
        <AuthLayout
            title={translate({
                ar: "استعادة كلمة المرور",
                en: "Reset your password",
            })}
            description={translate({
                ar: "أدخل بريدك وسنرسل إليك رابطًا آمنًا لاختيار كلمة مرور جديدة.",
                en: "Enter your email and we'll send you a secure reset link.",
            })}
            footer={
                <Link
                    href={route("login")}
                    className="avora-text-primary font-semibold"
                >
                    ←{" "}
                    {translate({
                        ar: "العودة لتسجيل الدخول",
                        en: "Back to sign in",
                    })}
                </Link>
            }
        >
            <Head
                title={translate({
                    ar: "نسيت كلمة المرور",
                    en: "Forgot password",
                })}
            />
            {status && (
                <div className="mb-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {status}
                </div>
            )}
            <form onSubmit={submit} className="space-y-5">
                <FormField
                    label={translate({
                        ar: "البريد الإلكتروني",
                        en: "Email address",
                    })}
                    type="email"
                    value={data.email}
                    onChange={(event) => setData("email", event.target.value)}
                    error={errors.email}
                    autoFocus
                    required
                />
                <FormButton disabled={processing} className="w-full">
                    {translate({
                        ar: "إرسال رابط الاستعادة",
                        en: "Send reset link",
                    })}
                </FormButton>
            </form>
        </AuthLayout>
    );
}
