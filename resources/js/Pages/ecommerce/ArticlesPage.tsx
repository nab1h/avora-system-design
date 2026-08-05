import { Alert, type AlertVariant } from "@/avora-dash/components/Alert";
import { Button } from "@/avora-dash/components/Button";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { FileInput } from "@/avora-dash/components/forms/FileInput";
import { ImageInput } from "@/avora-dash/components/forms/ImageInput";
import { Modal } from "@/avora-dash/components/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { PageProps } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState, type FormEvent } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

type Article = {
    id: number;
    title_ar: string;
    title_en: string;
    slug_ar: string;
    slug_en: string;
    excerpt_ar: string | null;
    excerpt_en: string | null;
    content_ar: string | null;
    content_en: string | null;
    image: string | null;
    is_published: boolean;
    published_at: string | null;
};
const empty = {
    title_ar: "",
    title_en: "",
    slug_ar: "",
    slug_en: "",
    excerpt_ar: "",
    excerpt_en: "",
    content_ar: "",
    content_en: "",
    image: null as File | null,
    ar_document: null as File | null,
    en_document: null as File | null,
    is_published: false,
    published_at: "",
};

export function ArticlesPage() {
    const { translate, direction } = useLanguage();
    const articles =
        usePage<PageProps<{ articles: Article[] }>>().props.articles;
    const form = useForm(empty);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Article | null>(null);
    const [notice, setNotice] = useState<{
        variant: AlertVariant;
        message: string;
    } | null>(null);
    const openCreate = () => {
        setEditing(null);
        form.setData(empty);
        form.clearErrors();
        setOpen(true);
    };
    const openEdit = (article: Article) => {
        setEditing(article);
        form.setData({
            title_ar: article.title_ar,
            title_en: article.title_en,
            slug_ar: article.slug_ar,
            slug_en: article.slug_en,
            excerpt_ar: article.excerpt_ar ?? "",
            excerpt_en: article.excerpt_en ?? "",
            content_ar: article.content_ar ?? "",
            content_en: article.content_en ?? "",
            image: null,
            ar_document: null,
            en_document: null,
            is_published: article.is_published,
            published_at: article.published_at?.slice(0, 10) ?? "",
        });
        form.clearErrors();
        setOpen(true);
    };
    const submit = (event: FormEvent) => {
        event.preventDefault();
        const data = new FormData();
        Object.entries(form.data).forEach(([key, value]) => {
            if (
                key === "image" ||
                key === "ar_document" ||
                key === "en_document"
            ) {
                if (value instanceof File) data.append(key, value);
            } else if (key === "is_published")
                data.append(key, value ? "1" : "0");
            else data.append(key, String(value ?? ""));
        });
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                setNotice({
                    variant: "success",
                    message: editing
                        ? "تم تعديل المقال بنجاح."
                        : "تم إنشاء المقال بنجاح.",
                });
            },
        };
        if (editing) {
            data.append("_method", "PUT");
            router.post(
                route("dashboard.articles.update", editing.id),
                data,
                options,
            );
        } else router.post(route("dashboard.articles.store"), data, options);
    };
    return (
        <section className="space-y-5" dir={direction}>
            {notice && (
                <Alert
                    floating
                    placement="top-end"
                    variant={notice.variant}
                    onDismiss={() => setNotice(null)}
                >
                    {notice.message}
                </Alert>
            )}
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black">
                        {translate({ ar: "المقالات", en: "Articles" })}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {translate({
                            ar: "إدارة مقالات المتجر، صورها، ومواعيد نشرها.",
                            en: "Manage store articles, images, and publishing dates.",
                        })}
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <FiPlus />{" "}
                    {translate({ ar: "إضافة مقال", en: "Add article" })}
                </Button>
            </header>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-sm">
                        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900">
                            <tr>
                                <th className="px-5 py-4 text-start">الصورة</th>
                                <th className="px-5 py-4 text-start">
                                    العنوان
                                </th>
                                <th className="px-5 py-4 text-start">الحالة</th>
                                <th className="px-5 py-4 text-start">
                                    تاريخ النشر
                                </th>
                                <th className="px-5 py-4 text-end">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.length ? (
                                articles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className="border-t border-slate-100 dark:border-slate-800"
                                    >
                                        <td className="px-5 py-3">
                                            {article.image ? (
                                                <img
                                                    src={`/storage/${article.image}`}
                                                    alt=""
                                                    className="h-12 w-16 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
                                            )}
                                        </td>
                                        <td className="px-5 py-3">
                                            <p className="font-bold">
                                                {article.title_ar}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {article.title_en}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${article.is_published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                                            >
                                                {article.is_published
                                                    ? "منشور"
                                                    : "مسودة"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">
                                            {article.published_at?.slice(
                                                0,
                                                10,
                                            ) ?? "—"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() =>
                                                        openEdit(article)
                                                    }
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="danger"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                "حذف هذا المقال؟",
                                                            )
                                                        )
                                                            router.delete(
                                                                route(
                                                                    "dashboard.articles.destroy",
                                                                    article.id,
                                                                ),
                                                                {
                                                                    onSuccess:
                                                                        () =>
                                                                            setNotice(
                                                                                {
                                                                                    variant:
                                                                                        "success",
                                                                                    message:
                                                                                        "تم حذف المقال.",
                                                                                },
                                                                            ),
                                                                },
                                                            );
                                                    }}
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-12 text-center text-slate-500"
                                    >
                                        لا توجد مقالات بعد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={editing ? "تعديل المقال" : "إضافة مقال"}
                size="xl"
            >
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="العنوان بالعربية"
                            value={form.data.title_ar}
                            onChange={(e) =>
                                form.setData("title_ar", e.target.value)
                            }
                            error={form.errors.title_ar}
                        />
                        <FormField
                            label="Title in English"
                            value={form.data.title_en}
                            onChange={(e) =>
                                form.setData("title_en", e.target.value)
                            }
                            error={form.errors.title_en}
                        />
                        <FormField
                            label="الرابط بالعربية"
                            value={form.data.slug_ar}
                            onChange={(e) =>
                                form.setData("slug_ar", e.target.value)
                            }
                            error={form.errors.slug_ar}
                        />
                        <FormField
                            label="English slug"
                            value={form.data.slug_en}
                            onChange={(e) =>
                                form.setData("slug_en", e.target.value)
                            }
                            error={form.errors.slug_en}
                        />
                    </div>
                    <ImageInput
                        label="الصورة الرئيسية"
                        value={form.data.image}
                        onChange={(file) => form.setData("image", file)}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <FileInput
                            label="ملف المقال العربي"
                            hint="Word أو TXT"
                            accept=".docx,.txt"
                            value={form.data.ar_document}
                            onChange={(file) =>
                                form.setData("ar_document", file)
                            }
                            error={form.errors.ar_document}
                        />
                        <FileInput
                            label="English article file"
                            hint="Word or TXT"
                            accept=".docx,.txt"
                            value={form.data.en_document}
                            onChange={(file) =>
                                form.setData("en_document", file)
                            }
                            error={form.errors.en_document}
                        />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm font-semibold">
                            ملخص بالعربية
                            <textarea
                                value={form.data.excerpt_ar}
                                onChange={(e) =>
                                    form.setData("excerpt_ar", e.target.value)
                                }
                                className="avora-form-field mt-2 w-full rounded-xl"
                                rows={3}
                            />
                        </label>
                        <label className="block text-sm font-semibold">
                            English excerpt
                            <textarea
                                value={form.data.excerpt_en}
                                onChange={(e) =>
                                    form.setData("excerpt_en", e.target.value)
                                }
                                className="avora-form-field mt-2 w-full rounded-xl"
                                rows={3}
                            />
                        </label>
                        <label className="block text-sm font-semibold">
                            المحتوى بالعربية
                            <textarea
                                value={form.data.content_ar}
                                onChange={(e) =>
                                    form.setData("content_ar", e.target.value)
                                }
                                className="avora-form-field mt-2 w-full rounded-xl"
                                rows={7}
                            />
                        </label>
                        <label className="block text-sm font-semibold">
                            English content
                            <textarea
                                value={form.data.content_en}
                                onChange={(e) =>
                                    form.setData("content_en", e.target.value)
                                }
                                className="avora-form-field mt-2 w-full rounded-xl"
                                rows={7}
                            />
                        </label>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2 text-sm font-semibold">
                            <input
                                type="checkbox"
                                checked={form.data.is_published}
                                onChange={(e) =>
                                    form.setData(
                                        "is_published",
                                        e.target.checked,
                                    )
                                }
                            />{" "}
                            نشر المقال
                        </label>
                        <FormField
                            label="تاريخ النشر"
                            type="date"
                            value={form.data.published_at}
                            onChange={(e) =>
                                form.setData("published_at", e.target.value)
                            }
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            حفظ المقال
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
