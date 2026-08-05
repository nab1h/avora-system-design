import { FormButton } from "@/avora-dash/components/forms/FormButton";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { AuthLayout } from "@/Layouts/AuthLayout";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Head, useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

export default function ConfirmPassword() {
    const { translate } = useLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route("password.confirm"), { onFinish: () => reset("password") });
    };
    return (
        <AuthLayout
            title={translate({
                ar: "تأكيد كلمة المرور",
                en: "Confirm password",
            })}
            description={translate({
                ar: "هذه منطقة آمنة. أكّد كلمة المرور قبل المتابعة.",
                en: "This is a secure area. Confirm your password before continuing.",
            })}
        >
            <Head
                title={translate({
                    ar: "تأكيد كلمة المرور",
                    en: "Confirm password",
                })}
            />
            <form onSubmit={submit} className="space-y-5">
                <FormField
                    label={translate({ ar: "كلمة المرور", en: "Password" })}
                    type="password"
                    value={data.password}
                    onChange={(event) =>
                        setData("password", event.target.value)
                    }
                    error={errors.password}
                    autoFocus
                    required
                />
                <FormButton disabled={processing} className="w-full">
                    {translate({
                        ar: "تأكيد والمتابعة",
                        en: "Confirm and continue",
                    })}
                </FormButton>
            </form>
        </AuthLayout>
    );
}
