import { FormButton } from "@/avora-dash/Components/forms/FormButton";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { AuthLayout } from "@/Layouts/AuthLayout";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Head, Link, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

export default function Register() {
    const { translate } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthLayout
            title={translate({ ar: "أنشئ حسابك", en: "Create your account" })}
            description={translate({
                ar: "ابدأ إدارة أعمالك من لوحة تحكم واحدة.",
                en: "Start managing your business from one dashboard.",
            })}
            footer={
                <>
                    {translate({
                        ar: "لديك حساب بالفعل؟",
                        en: "Already registered?",
                    })}{" "}
                    <Link
                        href={route("login")}
                        className="avora-text-primary font-semibold"
                    >
                        {translate({ ar: "سجّل الدخول", en: "Sign in" })}
                    </Link>
                </>
            }
        >
            <Head
                title={translate({ ar: "إنشاء حساب", en: "Create account" })}
            />
            <form onSubmit={submit} className="space-y-4">
                <FormField
                    label={translate({ ar: "الاسم", en: "Full name" })}
                    value={data.name}
                    onChange={(event) => setData("name", event.target.value)}
                    error={errors.name}
                    autoComplete="name"
                    autoFocus
                    required
                />
                <FormField
                    label={translate({
                        ar: "البريد الإلكتروني",
                        en: "Email address",
                    })}
                    type="email"
                    value={data.email}
                    onChange={(event) => setData("email", event.target.value)}
                    error={errors.email}
                    autoComplete="username"
                    required
                />
                <FormField
                    label={translate({ ar: "كلمة المرور", en: "Password" })}
                    type="password"
                    value={data.password}
                    onChange={(event) =>
                        setData("password", event.target.value)
                    }
                    error={errors.password}
                    autoComplete="new-password"
                    required
                />
                <FormField
                    label={translate({
                        ar: "تأكيد كلمة المرور",
                        en: "Confirm password",
                    })}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(event) =>
                        setData("password_confirmation", event.target.value)
                    }
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                    required
                />
                <FormButton disabled={processing} className="w-full">
                    {translate({ ar: "إنشاء الحساب", en: "Create account" })}
                </FormButton>
            </form>
        </AuthLayout>
    );
}
