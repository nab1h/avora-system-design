import { FormButton } from "@/avora-dash/components/forms/FormButton";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { AuthLayout } from "@/Layouts/AuthLayout";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Head, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { translate } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };
    return (
        <AuthLayout
            title={translate({
                ar: "كلمة مرور جديدة",
                en: "Choose a new password",
            })}
            description={translate({
                ar: "اختر كلمة مرور قوية لحماية حسابك.",
                en: "Choose a strong password to keep your account secure.",
            })}
        >
            <Head
                title={translate({
                    ar: "إعادة تعيين كلمة المرور",
                    en: "Reset password",
                })}
            />
            <form onSubmit={submit} className="space-y-4">
                <FormField
                    label={translate({
                        ar: "البريد الإلكتروني",
                        en: "Email address",
                    })}
                    type="email"
                    value={data.email}
                    onChange={(event) => setData("email", event.target.value)}
                    error={errors.email}
                    required
                />
                <FormField
                    label={translate({
                        ar: "كلمة المرور الجديدة",
                        en: "New password",
                    })}
                    type="password"
                    value={data.password}
                    onChange={(event) =>
                        setData("password", event.target.value)
                    }
                    error={errors.password}
                    autoFocus
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
                    required
                />
                <FormButton disabled={processing} className="w-full">
                    {translate({
                        ar: "حفظ كلمة المرور",
                        en: "Save new password",
                    })}
                </FormButton>
            </form>
        </AuthLayout>
    );
}
