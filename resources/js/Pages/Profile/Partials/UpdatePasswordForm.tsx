import { FormButton } from "@/avora-dash/Components/forms/FormButton";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useForm } from "@inertiajs/react";
import type { FormEventHandler } from "react";

export default function UpdatePasswordForm() {
    const { translate } = useLanguage();
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    return (
        <section>
            <header>
                <h2 className="text-lg font-bold">
                    {translate({
                        ar: "تغيير كلمة المرور",
                        en: "Update password",
                    })}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {translate({
                        ar: "استخدم كلمة مرور طويلة وعشوائية لحماية حسابك.",
                        en: "Use a long, random password to keep your account secure.",
                    })}
                </p>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-5">
                <FormField
                    label={translate({
                        ar: "كلمة المرور الحالية",
                        en: "Current password",
                    })}
                    type="password"
                    value={data.current_password}
                    onChange={(event) =>
                        setData("current_password", event.target.value)
                    }
                    error={errors.current_password}
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
                />
                <div className="flex items-center gap-3">
                    <FormButton disabled={processing}>
                        {translate({
                            ar: "تحديث كلمة المرور",
                            en: "Update password",
                        })}
                    </FormButton>
                    {recentlySuccessful && (
                        <span className="text-sm font-medium text-emerald-600">
                            {translate({ ar: "تم التحديث", en: "Updated" })}
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
