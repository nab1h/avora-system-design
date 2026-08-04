import { Button } from "@/avora-dash/Components/Button";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { GalleryImageInput } from "@/avora-dash/Components/forms/GalleryImageInput";
import { ImageInput } from "@/avora-dash/Components/forms/ImageInput";
import { Select } from "@/avora-dash/Components/forms/Select";
import { Modal } from "@/avora-dash/Components/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import type { PageProps } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useMemo, useState, type FormEventHandler } from "react";
import { FiEdit2, FiImage, FiPlus, FiTrash2, FiX } from "react-icons/fi";

type Named = { id: number; name_ar: string; name_en: string };
type Brand = Named & { image: string | null };
type SubCategory = Named & { categories_id: number };
type Offer = Named & { type: "fixed" | "percent"; value: string };
type Attribute = { id: number; name: string; name_en: string };
type Color = { id: number; name_ar: string; name_en: string; hex: string };
type Product = {
    id: number;
    category_id: number;
    brand_id: number | null;
    class_id: number;
    sub_category_id: number;
    offer_id: number | null;
    name_ar: string;
    name_en: string;
    slug_ar: string | null;
    slug_en: string | null;
    desc_ar: string | null;
    desc_en: string | null;
    price: string;
    stock: number;
    has_custom_color_stock: boolean;
    is_active: boolean;
    category?: Named;
    sub_category?: Named;
    offer?: Offer;
    images: { id: number; image: string; type: string }[];
    features: { id: number; feature: string }[];
    attributes: {
        id: number;
        value?: { attribute_id: number; value: string };
    }[];
    colors: (Color & { pivot: { stock: number | null } })[];
    sizes: (Named & { pivot: { stock: number | null } })[];
    weights: (Named & { pivot: { stock: number | null } })[];
    materials: Named[];
};
type ProductForm = {
    _method: "post" | "put";
    category_id: number | null;
    brand_id: number | null;
    class_id: number | null;
    sub_category_id: number | null;
    offer_id: number | null;
    name_ar: string;
    name_en: string;
    slug_ar: string;
    slug_en: string;
    desc_ar: string;
    desc_en: string;
    price: string;
    stock: string;
    has_custom_color_stock: boolean;
    colors: { id: number; stock: string }[];
    sizes: { id: number; stock: string }[];
    weights: { id: number; stock: string }[];
    materials: { id: number }[];
    is_active: boolean;
    features: string[];
    attributes: { attribute_id: number | null; value: string }[];
    main_image: File | null;
    gallery_images: File[];
    remove_image_ids: number[];
};
const emptyForm: ProductForm = {
    _method: "post",
    category_id: null,
    brand_id: null,
    class_id: null,
    sub_category_id: null,
    offer_id: null,
    name_ar: "",
    name_en: "",
    slug_ar: "",
    slug_en: "",
    desc_ar: "",
    desc_en: "",
    price: "",
    stock: "0",
    has_custom_color_stock: false,
    colors: [],
    sizes: [],
    weights: [],
    materials: [],
    is_active: true,
    features: [""],
    attributes: [],
    main_image: null,
    gallery_images: [],
    remove_image_ids: [],
};

export function ProductsPage() {
    const { translate } = useLanguage();
    const { props } = usePage<PageProps>();
    const products = (props.products ?? []) as Product[];
    const categories = (props.categories ?? []) as Named[];
    const brands = (props.brands ?? []) as Brand[];
    const classes = (props.classes ?? []) as Named[];
    const subCategories = (props.subCategories ?? []) as SubCategory[];
    const offers = (props.offers ?? []) as Offer[];
    const attributes = (props.attributes ?? []) as Attribute[];
    const colors = (props.colors ?? []) as Color[];
    const sizes = (props.sizes ?? []) as Named[];
    const weights = (props.weights ?? []) as Named[];
    const materials = (props.materials ?? []) as Named[];
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState<Product | null>(null);
    const form = useForm<ProductForm>(emptyForm);
    const availableSubs = useMemo(
        () =>
            subCategories.filter(
                (item) => item.categories_id === form.data.category_id,
            ),
        [form.data.category_id, subCategories],
    );

    const create = () => {
        setEditing(null);
        form.setData({ ...emptyForm, features: [""] });
        form.clearErrors();
        setOpen(true);
    };
    const edit = (product: Product) => {
        setEditing(product);
        form.setData({
            _method: "put",
            category_id: product.category_id,
            brand_id: product.brand_id,
            class_id: product.class_id,
            sub_category_id: product.sub_category_id,
            offer_id: product.offer_id,
            name_ar: product.name_ar,
            name_en: product.name_en,
            slug_ar: product.slug_ar ?? "",
            slug_en: product.slug_en ?? "",
            desc_ar: product.desc_ar ?? "",
            desc_en: product.desc_en ?? "",
            price: product.price,
            stock: String(product.stock),
            has_custom_color_stock: product.has_custom_color_stock,
            colors: product.colors.map((color) => ({
                id: color.id,
                stock:
                    color.pivot.stock === null ? "" : String(color.pivot.stock),
            })),
            sizes: product.sizes.map((item) => ({
                id: item.id,
                stock:
                    item.pivot.stock === null ? "" : String(item.pivot.stock),
            })),
            weights: product.weights.map((item) => ({
                id: item.id,
                stock:
                    item.pivot.stock === null ? "" : String(item.pivot.stock),
            })),
            materials: product.materials.map((item) => ({ id: item.id })),
            is_active: product.is_active,
            features: product.features.length
                ? product.features.map((item) => item.feature)
                : [""],
            attributes: (product.attributes ?? [])
                .filter((item) => item.value)
                .map((item) => ({
                    attribute_id: item.value!.attribute_id,
                    value: item.value!.value,
                })),
            main_image: null,
            gallery_images: [],
            remove_image_ids: [],
        });
        form.clearErrors();
        setOpen(true);
    };
    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        form.post(
            editing
                ? route("dashboard.products.update", editing.id)
                : route("dashboard.products.store"),
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    setEditing(null);
                    form.reset();
                },
            },
        );
    };
    const updateAttribute = (
        index: number,
        field: "attribute_id" | "value",
        value: number | null | string,
    ) => {
        const rows = [...form.data.attributes];
        rows[index] = { ...rows[index], [field]: value };
        form.setData("attributes", rows);
    };

    const toggleColor = (colorId: number) => {
        const selected = form.data.colors.find((color) => color.id === colorId);
        if (selected) {
            form.setData(
                "colors",
                form.data.colors.filter((color) => color.id !== colorId),
            );
            return;
        }
        const count = form.data.colors.length + 1;
        const stock = Math.floor(Number(form.data.stock || 0) / count);
        form.setData("colors", [
            ...form.data.colors.map((color) => ({
                ...color,
                stock: String(stock),
            })),
            { id: colorId, stock: String(stock) },
        ]);
    };

    const updateColorStock = (colorId: number, stock: string) => {
        form.setData(
            "colors",
            form.data.colors.map((color) =>
                color.id === colorId ? { ...color, stock } : color,
            ),
        );
    };

    return (
        <section className="space-y-5">
            <Head title={translate({ ar: "إدارة المنتجات", en: "Products" })} />
            <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold">
                            {translate({ ar: "المنتجات", en: "Products" })}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {translate({
                                ar: "إدارة المنتجات والمخزون والصور والمميزات والمواصفات.",
                                en: "Manage products and all related data.",
                            })}
                        </p>
                    </div>
                    <Button onClick={create}>
                        <FiPlus />{" "}
                        {translate({ ar: "منتج جديد", en: "New product" })}
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-sm">
                        <thead className="avora-surface-muted avora-muted">
                            <tr>
                                {[
                                    "المنتج",
                                    "التصنيف",
                                    "السعر",
                                    "المخزون",
                                    "الحالة",
                                ].map((label) => (
                                    <th
                                        key={label}
                                        className="px-5 py-4 text-start"
                                    >
                                        {label}
                                    </th>
                                ))}
                                <th className="px-5 py-4 text-end">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const main = product.images.find(
                                    (image) => image.type === "main",
                                );
                                return (
                                    <tr
                                        key={product.id}
                                        className="avora-border border-b"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {main ? (
                                                    <img
                                                        src={`/storage/${main.image}`}
                                                        alt=""
                                                        className="h-12 w-12 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <span className="avora-surface-muted grid h-12 w-12 place-items-center rounded-xl">
                                                        <FiImage />
                                                    </span>
                                                )}
                                                <div>
                                                    <p className="font-bold">
                                                        {product.name_ar}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {product.name_en}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p>
                                                {product.category?.name_ar ??
                                                    "-"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {product.sub_category
                                                    ?.name_ar ?? "-"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 font-bold">
                                            {product.price}
                                        </td>
                                        <td className="px-5 py-4">
                                            {product.stock}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${product.is_active ? "avora-status-success" : "avora-status-danger"}`}
                                            >
                                                {product.is_active
                                                    ? "نشط"
                                                    : "مخفي"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:text-slate-400 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
                                                    onClick={() =>
                                                        edit(product)
                                                    }
                                                    aria-label={translate({
                                                        ar: "تعديل الصنف",
                                                        en: "Edit category",
                                                    })}
                                                    title={translate({
                                                        ar: "تعديل",
                                                        en: "Edit",
                                                    })}
                                                >
                                                    <FiEdit2 aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="grid h-9 w-9 place-items-center rounded-lg text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                                                    onClick={() =>
                                                        setDeleting(product)
                                                    }
                                                    aria-label={translate({
                                                        ar: "حذف الصنف",
                                                        en: "Delete category",
                                                    })}
                                                    title={translate({
                                                        ar: "حذف",
                                                        en: "Delete",
                                                    })}
                                                >
                                                    <FiTrash2 aria-hidden="true" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {!products.length && (
                        <p className="avora-muted p-10 text-center">
                            لا توجد منتجات بعد.
                        </p>
                    )}
                </div>
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                size="xl"
                title={editing ? "تعديل المنتج" : "إضافة منتج"}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="اسم المنتج بالعربية"
                            value={form.data.name_ar}
                            onChange={(e) =>
                                form.setData("name_ar", e.target.value)
                            }
                            error={form.errors.name_ar}
                        />
                        <FormField
                            label="Product name in English"
                            value={form.data.name_en}
                            onChange={(e) =>
                                form.setData("name_en", e.target.value)
                            }
                            error={form.errors.name_en}
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
                        <Select
                            label="الصنف الرئيسي"
                            required
                            value={form.data.category_id}
                            options={categories.map((item) => ({
                                value: item.id,
                                label: `${item.name_ar} — ${item.name_en}`,
                            }))}
                            onChange={(value) => {
                                form.setData("category_id", value);
                                form.setData("sub_category_id", null);
                            }}
                            error={form.errors.category_id}
                        />
                        <Select
                            label={translate({ ar: "البراند", en: "Brand" })}
                            required
                            value={form.data.brand_id}
                            options={brands.map((item) => ({
                                value: item.id,
                                label: `${item.name_ar} — ${item.name_en}`,
                                image: item.image
                                    ? `/storage/${item.image}`
                                    : null,
                            }))}
                            onChange={(value) =>
                                form.setData("brand_id", value)
                            }
                            error={form.errors.brand_id}
                        />
                        <Select
                            label="الصنف الفرعي"
                            required
                            disabled={!form.data.category_id}
                            value={form.data.sub_category_id}
                            options={availableSubs.map((item) => ({
                                value: item.id,
                                label: `${item.name_ar} — ${item.name_en}`,
                            }))}
                            onChange={(value) =>
                                form.setData("sub_category_id", value)
                            }
                            error={form.errors.sub_category_id}
                        />

                        <Select
                            label="الفئة العمرية"
                            required
                            // disabled={!form.data.class_id}
                            value={form.data.class_id}
                            options={classes.map((item) => ({
                                value: item.id,
                                label: `${item.name_ar} — ${item.name_en}`,
                            }))}
                            onChange={(value) =>
                                form.setData("class_id", value)
                            }
                            error={form.errors.class_id}
                        />

                        <Select
                            label="العرض"
                            clearable
                            value={form.data.offer_id}
                            options={offers.map((item) => ({
                                value: item.id,
                                label: `${item.name_ar} (${item.value}${item.type === "percent" ? "%" : ""})`,
                            }))}
                            onChange={(value) =>
                                form.setData("offer_id", value)
                            }
                            error={form.errors.offer_id}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <FormField
                                type="number"
                                min="0"
                                step="0.01"
                                label="السعر"
                                value={form.data.price}
                                onChange={(e) =>
                                    form.setData("price", e.target.value)
                                }
                                error={form.errors.price}
                            />
                            <FormField
                                type="number"
                                min="0"
                                label="المخزون"
                                value={form.data.stock}
                                onChange={(e) =>
                                    form.setData("stock", e.target.value)
                                }
                                error={form.errors.stock}
                            />
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold">
                                        ألوان المنتج
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        اختر الألوان المتاحة لهذا المنتج.
                                    </p>
                                </div>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={
                                            form.data.has_custom_color_stock
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                "has_custom_color_stock",
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    مخزون مخصص لكل لون
                                </label>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {colors.map((color) => {
                                    const selected = form.data.colors.some(
                                        (item) => item.id === color.id,
                                    );
                                    return (
                                        <button
                                            key={color.id}
                                            type="button"
                                            onClick={() =>
                                                toggleColor(color.id)
                                            }
                                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${selected ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30" : "border-slate-200 dark:border-slate-700"}`}
                                        >
                                            <span
                                                className="h-4 w-4 rounded-full border border-slate-300"
                                                style={{
                                                    backgroundColor: color.hex,
                                                }}
                                            />
                                            {color.name_ar}
                                        </button>
                                    );
                                })}
                            </div>
                            {!colors.length && (
                                <p className="mt-3 text-sm text-slate-500">
                                    أضف الألوان أولًا من جدول إدارة الألوان.
                                </p>
                            )}
                            {form.data.has_custom_color_stock &&
                                form.data.colors.length > 0 && (
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {form.data.colors.map((selected) => {
                                            const color = colors.find(
                                                (item) =>
                                                    item.id === selected.id,
                                            );
                                            if (!color) return null;
                                            return (
                                                <FormField
                                                    key={color.id}
                                                    type="number"
                                                    min="0"
                                                    label={`مخزون ${color.name_ar}`}
                                                    value={selected.stock}
                                                    onChange={(event) =>
                                                        updateColorStock(
                                                            color.id,
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            {form.data.has_custom_color_stock &&
                                form.data.colors.length > 0 && (
                                    <p className="mt-3 text-xs text-slate-500">
                                        الإجمالي المحدد للألوان:{" "}
                                        {form.data.colors.reduce(
                                            (total, color) =>
                                                total +
                                                Number(color.stock || 0),
                                            0,
                                        )}{" "}
                                        قطعة.
                                    </p>
                                )}
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {(
                            [
                                ["sizes", "المقاسات", sizes],
                                ["weights", "الأوزان", weights],
                                ["materials", "الخامات", materials],
                            ] as const
                        ).map(([field, label, options]) => (
                            <div
                                key={field}
                                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                            >
                                <p className="font-semibold">{label}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    اختياري ويمكن اختيار أكثر من قيمة.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {options.map((option) => {
                                        const selected = form.data[field].some(
                                            (item) => item.id === option.id,
                                        );
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() =>
                                                    (form.setData as any)(
                                                        field,
                                                        selected
                                                            ? form.data[
                                                                  field
                                                              ].filter(
                                                                  (item) =>
                                                                      item.id !==
                                                                      option.id,
                                                              )
                                                            : [
                                                                  ...form.data[
                                                                      field
                                                                  ],
                                                                  field ===
                                                                  "materials"
                                                                      ? {
                                                                            id: option.id,
                                                                        }
                                                                      : {
                                                                            id: option.id,
                                                                            stock: "",
                                                                        },
                                                              ],
                                                    )
                                                }
                                                className={`rounded-lg border px-3 py-2 text-sm ${selected ? "border-sky-500 bg-sky-50 dark:bg-sky-950/30" : "border-slate-200 dark:border-slate-700"}`}
                                            >
                                                {option.name_ar}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    {editing && !!editing.images.length && (
                        <div>
                            <h3 className="mb-3 font-bold">الصور الحالية</h3>
                            <div className="flex flex-wrap gap-3">
                                {editing.images.map((image) => {
                                    const removed =
                                        form.data.remove_image_ids.includes(
                                            image.id,
                                        );
                                    return (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() =>
                                                form.setData(
                                                    "remove_image_ids",
                                                    removed
                                                        ? form.data.remove_image_ids.filter(
                                                              (id) =>
                                                                  id !==
                                                                  image.id,
                                                          )
                                                        : [
                                                              ...form.data
                                                                  .remove_image_ids,
                                                              image.id,
                                                          ],
                                                )
                                            }
                                            className={`relative overflow-hidden rounded-xl border-2 ${removed ? "border-rose-500 opacity-40" : "avora-border"}`}
                                        >
                                            <img
                                                src={`/storage/${image.image}`}
                                                alt=""
                                                className="h-20 w-20 object-cover"
                                            />
                                            {removed && (
                                                <span className="absolute inset-0 grid place-items-center bg-rose-950/30 text-white">
                                                    <FiTrash2 />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="avora-muted mt-2 text-xs">
                                اضغط على الصورة لتحديدها للحذف عند الحفظ.
                            </p>
                        </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-semibold">
                            الوصف بالعربية
                            <textarea
                                rows={4}
                                value={form.data.desc_ar}
                                onChange={(e) =>
                                    form.setData("desc_ar", e.target.value)
                                }
                                className="avora-surface avora-border mt-2 w-full rounded-xl border"
                            />
                        </label>
                        <label className="text-sm font-semibold">
                            English description
                            <textarea
                                rows={4}
                                value={form.data.desc_en}
                                onChange={(e) =>
                                    form.setData("desc_en", e.target.value)
                                }
                                className="avora-surface avora-border mt-2 w-full rounded-xl border"
                            />
                        </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <ImageInput
                            label={`الصورة الرئيسية${!editing ? " *" : ""}`}
                            value={form.data.main_image}
                            currentImage={
                                editing?.images.find(
                                    (image) => image.type === "main",
                                )?.image
                                    ? `/storage/${editing.images.find((image) => image.type === "main")?.image}`
                                    : null
                            }
                            onChange={(image) =>
                                form.setData("main_image", image)
                            }
                            error={form.errors.main_image}
                        />
                        <GalleryImageInput
                            label="صور المعرض"
                            value={form.data.gallery_images}
                            onChange={(images) =>
                                form.setData("gallery_images", images)
                            }
                            error={form.errors.gallery_images}
                        />
                    </div>
                    <div>
                        <div className="mb-3 flex justify-between">
                            <h3 className="font-bold">المميزات</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    form.setData("features", [
                                        ...form.data.features,
                                        "",
                                    ])
                                }
                            >
                                <FiPlus /> إضافة
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {form.data.features.map((feature, index) => (
                                <div className="flex gap-2" key={index}>
                                    <input
                                        value={feature}
                                        onChange={(e) => {
                                            const next = [
                                                ...form.data.features,
                                            ];
                                            next[index] = e.target.value;
                                            form.setData("features", next);
                                        }}
                                        className="avora-surface avora-border w-full rounded-xl border px-4"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            form.setData(
                                                "features",
                                                form.data.features.filter(
                                                    (_, i) => i !== index,
                                                ),
                                            )
                                        }
                                    >
                                        <FiX />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {!!attributes.length && (
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold">خصائص المنتج</h3>
                                    <p className="avora-muted mt-1 text-xs">
                                        اختر الخاصية ثم اكتب قيمة هذا المنتج.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        form.setData("attributes", [
                                            ...form.data.attributes,
                                            { attribute_id: null, value: "" },
                                        ])
                                    }
                                >
                                    <FiPlus /> إضافة خاصية
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {form.data.attributes.map((row, index) => (
                                    <div
                                        key={index}
                                        className="avora-surface-muted avora-border grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_auto]"
                                    >
                                        <Select
                                            placeholder="اختر الخاصية"
                                            value={row.attribute_id}
                                            options={attributes.map(
                                                (attribute) => ({
                                                    value: attribute.id,
                                                    label: attribute.name,
                                                    disabled:
                                                        form.data.attributes.some(
                                                            (item, itemIndex) =>
                                                                itemIndex !==
                                                                    index &&
                                                                item.attribute_id ===
                                                                    attribute.id,
                                                        ),
                                                }),
                                            )}
                                            onChange={(value) =>
                                                updateAttribute(
                                                    index,
                                                    "attribute_id",
                                                    value,
                                                )
                                            }
                                            error={
                                                form.errors[
                                                    `attributes.${index}.attribute_id`
                                                ]
                                            }
                                        />
                                        <input
                                            value={row.value}
                                            onChange={(e) =>
                                                updateAttribute(
                                                    index,
                                                    "value",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="اكتب قيمة الخاصية"
                                            className="avora-surface avora-border min-h-14 w-full rounded-xl border px-4"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                form.setData(
                                                    "attributes",
                                                    form.data.attributes.filter(
                                                        (_, itemIndex) =>
                                                            itemIndex !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            <FiX />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(e) =>
                                form.setData("is_active", e.target.checked)
                            }
                            className="avora-checkbox rounded"
                        />
                        <span className="font-semibold">المنتج نشط</span>
                    </label>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? "جارٍ الحفظ..." : "حفظ المنتج"}
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                title="حذف المنتج"
            >
                <p className="mb-5">
                    هل تريد حذف «{deleting?.name_ar}» وكل بياناته المرتبطة؟
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setDeleting(null)}>
                        إلغاء
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() =>
                            deleting &&
                            router.delete(
                                route(
                                    "dashboard.products.destroy",
                                    deleting.id,
                                ),
                                {
                                    preserveScroll: true,
                                    onSuccess: () => setDeleting(null),
                                },
                            )
                        }
                    >
                        حذف
                    </Button>
                </div>
            </Modal>
        </section>
    );
}
