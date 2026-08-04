import { FormButton } from "@/avora-dash/Components/forms/FormButton";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import type { PageProps } from "@/types";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState, type FormEventHandler } from "react";

type ProfileForm = {
    name: string;
    email: string;
    avatar: File | null;
    _method: "patch";
};

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const { translate } = useLanguage();
    const user = usePage<PageProps>().props.auth.user;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const initials = user.name.trim().slice(0, 2).toUpperCase();

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm<ProfileForm>({
            name: user.name,
            email: user.email,
            avatar: null,
            _method: "patch",
        });

    useEffect(() => {
        if (!data.avatar) {
            setAvatarPreview(null);
            return;
        }

        const previewUrl = URL.createObjectURL(data.avatar);
        setAvatarPreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [data.avatar]);

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route("profile.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("avatar", null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            },
        });
    };

    const avatarUrl = avatarPreview ?? user.avatar_url;

    return (
        <section>
            <header>
                <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    {translate({
                        ar: "المعلومات الشخصية",
                        en: "Profile information",
                    })}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {translate({
                        ar: "حدّث صورتك واسمك وعنوان بريدك الإلكتروني.",
                        en: "Update your photo, name, and email address.",
                    })}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white text-2xl font-black shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="avora-text-primary">
                                {initials}
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {translate({
                                ar: "صورة الحساب",
                                en: "Account photo",
                            })}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            {translate({
                                ar: "ارفع صورة واضحة بصيغة JPG أو PNG، بحد أقصى 3MB.",
                                en: "Upload a clear JPG or PNG image, up to 3MB.",
                            })}
                        </p>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) =>
                                setData(
                                    "avatar",
                                    event.target.files?.[0] ?? null,
                                )
                            }
                        />

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <FormButton
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {translate({
                                    ar: "اختيار صورة",
                                    en: "Choose photo",
                                })}
                            </FormButton>

                            {data.avatar && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData("avatar", null);

                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }}
                                    className="text-sm font-semibold text-slate-500 hover:text-rose-600"
                                >
                                    {translate({
                                        ar: "إلغاء الصورة",
                                        en: "Cancel photo",
                                    })}
                                </button>
                            )}
                        </div>

                        {errors.avatar && (
                            <p className="mt-2 text-xs font-medium text-rose-600">
                                {errors.avatar}
                            </p>
                        )}
                    </div>
                </div>

                <FormField
                    label={translate({ ar: "الاسم", en: "Name" })}
                    value={data.name}
                    onChange={(event) => setData("name", event.target.value)}
                    error={errors.name}
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
                    required
                />

                {mustVerifyEmail && !user.email_verified_at && (
                    <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        {translate({
                            ar: "بريدك غير مؤكد.",
                            en: "Your email is unverified.",
                        })}{" "}
                        <Link
                            href={route("verification.send")}
                            method="post"
                            as="button"
                            className="font-semibold underline"
                        >
                            {translate({
                                ar: "إعادة إرسال رابط التحقق",
                                en: "Resend verification link",
                            })}
                        </Link>
                        {status === "verification-link-sent" && (
                            <span className="mt-1 block text-emerald-600">
                                {translate({
                                    ar: "تم إرسال الرابط.",
                                    en: "Link sent.",
                                })}
                            </span>
                        )}
                    </p>
                )}

                <div className="flex items-center gap-3">
                    <FormButton disabled={processing}>
                        {translate({ ar: "حفظ التغييرات", en: "Save changes" })}
                    </FormButton>
                    {recentlySuccessful && (
                        <span className="text-sm font-medium text-emerald-600">
                            {translate({ ar: "تم الحفظ", en: "Saved" })}
                        </span>
                    )}
                </div>
            </form>
        </section>
    );
}
