import { Button } from "@/avora-dash/Components/Button";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { ImageInput } from "@/avora-dash/Components/forms/ImageInput";
import { Modal } from "@/avora-dash/Components/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import type { PageProps } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState, type FormEventHandler } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

type Brand = {
    id: number;
    name_ar: string;
    name_en: string;
    desc_ar: string | null;
    desc_en: string | null;
    image: string | null;
    products_count: number;
};

type BrandForm = {
    name_ar: string;
    name_en: string;
    desc_ar: string;
    desc_en: string;
    image: File | null;
};

const emptyForm: BrandForm = {
    name_ar: "",
    name_en: "",
    desc_ar: "",
    desc_en: "",
    image: null,
};

export function BrandsPage() {
    const { translate } = useLanguage();
    const brands = (usePage<PageProps>().props.brands ?? []) as Brand[];
    const form = useForm<BrandForm>(emptyForm);
    const [editing, setEditing] = useState<Brand | null>(null);
    const [deleting, setDeleting] = useState<Brand | null>(null);
    const [open, setOpen] = useState(false);

    const openCreate = () => {
        setEditing(null);
        form.setData(emptyForm);
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (brand: Brand) => {
        setEditing(brand);
        form.setData({
            name_ar: brand.name_ar,
            name_en: brand.name_en,
            desc_ar: brand.desc_ar ?? "",
            desc_en: brand.desc_en ?? "",
            image: null,
        });
        form.clearErrors();
        setOpen(true);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        if (editing) {
            form.put(route("dashboard.brands.update", editing.id), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => setOpen(false),
            });
            return;
        }

        form.post(route("dashboard.brands.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    const deleteBrand = () => {
        if (!deleting) return;

        router.delete(route("dashboard.brands.destroy", deleting.id), {
            preserveScroll: true,
            onSuccess: () => setDeleting(null),
        });
    };

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold">
                        {translate({ ar: "البراندات", en: "Brands" })}
                    </h2>
                    <p className="avora-muted mt-1 text-sm">
                        {translate({
                            ar: "إدارة العلامات التجارية وصورها ووصفها.",
                            en: "Manage brand names, descriptions, and images.",
                        })}
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <FiPlus />{" "}
                    {translate({ ar: "إضافة براند", en: "Add brand" })}
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {brands.map((brand) => (
                    <article
                        key={brand.id}
                        className="avora-surface avora-border overflow-hidden rounded-2xl border"
                    >
                        {brand.image ? (
                            <img
                                src={`/storage/${brand.image}`}
                                alt={brand.name_en}
                                className="h-40 w-full object-cover"
                            />
                        ) : (
                            <div className="avora-surface-muted h-40" />
                        )}
                        <div className="space-y-3 p-4">
                            <div>
                                <h3 className="font-bold">{brand.name_ar}</h3>
                                <p className="avora-muted text-sm">
                                    {brand.name_en}
                                </p>
                            </div>
                            <p className="avora-muted line-clamp-2 text-sm">
                                {brand.desc_ar ||
                                    brand.desc_en ||
                                    translate({
                                        ar: "بدون وصف",
                                        en: "No description",
                                    })}
                            </p>
                            <div className="flex items-center justify-between gap-3">
                                <span className="avora-bg-primary-soft rounded-full px-3 py-1 text-xs font-semibold">
                                    {translate({
                                        ar: `${brand.products_count} منتج`,
                                        en: `${brand.products_count} products`,
                                    })}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        aria-label="Edit brand"
                                        onClick={() => openEdit(brand)}
                                    >
                                        <FiEdit2 />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        aria-label="Delete brand"
                                        onClick={() => setDeleting(brand)}
                                    >
                                        <FiTrash2 />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {!brands.length && (
                <div className="avora-surface-muted rounded-2xl p-10 text-center">
                    {translate({
                        ar: "لا توجد براندات حتى الآن.",
                        en: "No brands yet.",
                    })}
                </div>
            )}

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={translate({
                    ar: editing ? "تعديل براند" : "إضافة براند",
                    en: editing ? "Edit brand" : "Add brand",
                })}
            >
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            label={translate({
                                ar: "الاسم بالعربية",
                                en: "Arabic name",
                            })}
                            value={form.data.name_ar}
                            onChange={(event) =>
                                form.setData("name_ar", event.target.value)
                            }
                            error={form.errors.name_ar}
                        />
                        <FormField
                            label={translate({
                                ar: "الاسم بالإنجليزية",
                                en: "English name",
                            })}
                            value={form.data.name_en}
                            onChange={(event) =>
                                form.setData("name_en", event.target.value)
                            }
                            error={form.errors.name_en}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            label={translate({
                                ar: "الوصف بالعربية",
                                en: "Arabic description",
                            })}
                            value={form.data.desc_ar}
                            onChange={(event) =>
                                form.setData("desc_ar", event.target.value)
                            }
                            error={form.errors.desc_ar}
                        />
                        <FormField
                            label={translate({
                                ar: "الوصف بالإنجليزية",
                                en: "English description",
                            })}
                            value={form.data.desc_en}
                            onChange={(event) =>
                                form.setData("desc_en", event.target.value)
                            }
                            error={form.errors.desc_en}
                        />
                    </div>
                    <ImageInput
                        label={translate({
                            ar: "صورة البراند",
                            en: "Brand image",
                        })}
                        value={form.data.image}
                        currentImage={
                            editing?.image ? `/storage/${editing.image}` : null
                        }
                        onChange={(image) => form.setData("image", image)}
                        error={form.errors.image}
                    />
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            {translate({ ar: "إلغاء", en: "Cancel" })}
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {translate({ ar: "حفظ", en: "Save" })}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                title={translate({ ar: "حذف البراند", en: "Delete brand" })}
            >
                <p className="mb-5">
                    {translate({
                        ar: "هل تريد حذف هذا البراند؟ لا يمكن حذفه إذا كان مرتبطًا بمنتجات.",
                        en: "Delete this brand? Brands assigned to products cannot be deleted.",
                    })}
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setDeleting(null)}>
                        {translate({ ar: "إلغاء", en: "Cancel" })}
                    </Button>
                    <Button variant="danger" onClick={deleteBrand}>
                        {translate({ ar: "حذف", en: "Delete" })}
                    </Button>
                </div>
            </Modal>
        </section>
    );
}
