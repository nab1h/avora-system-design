import { Button } from "@/avora-dash/components/Button";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { Grid } from "@/avora-dash/components/Grid";
import { GridItem } from "@/avora-dash/components/Grid/GridItem";
import { Modal } from "@/avora-dash/components/Modal/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { Category, PageProps, SubCategory } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

export const SubCategoriesPage = () => {
    const { translate } = useLanguage();
    const page = usePage<PageProps>();
    const { colors } = useTheme();

    const subCategories = page.props.subCategories as (SubCategory & {
        category?: Category;
    })[];
    const categories = page.props.categories as Category[];

    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const subCatForm = useForm<Omit<SubCategory, "img"> & { img: File | null }>(
        {
            id: 0,
            categories_id: 0,
            name_ar: "",
            name_en: "",
            desc_ar: "",
            desc_en: "",
            slug_ar: "",
            slug_en: "",
            is_active: true,
            img: null,
        },
    );

    const editHandler = (subCat: SubCategory) => {
        setEditingId(subCat.id);
        subCatForm.setData({
            id: subCat.id,
            categories_id: subCat.categories_id,
            name_ar: subCat.name_ar,
            name_en: subCat.name_en,
            desc_ar: subCat.desc_ar || "",
            desc_en: subCat.desc_en || "",
            slug_ar: subCat.slug_ar,
            slug_en: subCat.slug_en,
            is_active: subCat.is_active,
            img: null,
        });
        setOpenModal(true);
    };

    const onSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();

        if (editingId !== null) {
            subCatForm.transform((data) => ({
                ...data,
                is_active: data.is_active ? "1" : "0",
                _method: "PUT",
            }));
            subCatForm.post(
                route("dashboard.subcategories.update", editingId),
                {
                    forceFormData: true,
                    onSuccess: () => {
                        setOpenModal(false);
                        subCatForm.reset();
                        setEditingId(null);
                    },
                },
            );
        } else {
            subCatForm.transform((data) => ({
                ...data,
                is_active: data.is_active ? "1" : "0",
            }));
            subCatForm.post(route("dashboard.subcategories.store"), {
                forceFormData: true,
                onSuccess: () => {
                    setOpenModal(false);
                    subCatForm.reset();
                    setEditingId(null);
                },
            });
        }
    };

    const deleteHandler = (id: number) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId === null) return;
        setIsDeleting(true);
        router.delete(route("dashboard.subcategories.destroy", deleteId), {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setDeleteId(null);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingId(null);
        subCatForm.clearErrors();
    };

    return (
        <>
            <Head
                title={translate({
                    ar: "إدارة الأصناف الفرعية",
                    en: "SubCategories Management",
                })}
            />

            <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                {translate({
                                    ar: "الأصناف الفرعية",
                                    en: "SubCategories",
                                })}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {translate({
                                    ar: "إضافة وتعديل وحذف الأصناف الفرعية.",
                                    en: "Create, edit, and delete subcategories.",
                                })}
                            </p>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    subCatForm.reset();
                                    setEditingId(null);
                                    setOpenModal(true);
                                }}
                            >
                                {translate({
                                    ar: "إضافة صنف فرعي",
                                    en: "Add SubCategory",
                                })}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-sm">
                        <thead className="avora-surface-muted avora-muted">
                            <tr>
                                <th className="px-6 py-4 text-start">
                                    {translate({ ar: "الصورة", en: "Image" })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({
                                        ar: "الصنف الرئيسي",
                                        en: "Main Category",
                                    })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({ ar: "الاسم", en: "Name" })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({
                                        ar: "الوصف",
                                        en: "Description",
                                    })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({ ar: "الحالة", en: "Status" })}
                                </th>
                                <th className="px-6 py-4 text-end">
                                    {translate({
                                        ar: "إجراءات",
                                        en: "Actions",
                                    })}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategories.map((item) => (
                                <tr
                                    key={item.id}
                                    className="avora-border border-b"
                                >
                                    <td className="avora-muted px-6 py-4">
                                        {item.img ? (
                                            <img
                                                src={`/storage/${item.img}`}
                                                alt={item.name_ar}
                                                className="h-14 w-14 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 dark:bg-slate-800">
                                                {translate({
                                                    ar: "لا يوجد",
                                                    en: "N/A",
                                                })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="avora-muted px-6 py-4 font-semibold">
                                        {item.category?.name_ar || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold">
                                            {item.name_ar}
                                        </p>
                                        <p className="text-mute">
                                            {item.name_en}
                                        </p>
                                    </td>
                                    <td className="avora-muted max-w-[200px] truncate px-6 py-4">
                                        {item.desc_ar}
                                    </td>
                                    <td className="avora-muted px-6 py-4">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                item.is_active
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                            }`}
                                        >
                                            {item.is_active
                                                ? translate({
                                                      ar: "مفعل",
                                                      en: "Active",
                                                  })
                                                : translate({
                                                      ar: "معطل",
                                                      en: "Inactive",
                                                  })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                rounded="no"
                                                onClick={() =>
                                                    editHandler(item)
                                                }
                                            >
                                                {translate({
                                                    ar: "تعديل",
                                                    en: "Edit",
                                                })}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                rounded="no"
                                                onClick={() =>
                                                    deleteHandler(item.id)
                                                }
                                            >
                                                {translate({
                                                    ar: "حذف",
                                                    en: "Delete",
                                                })}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {subCategories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-sm text-slate-500"
                                    >
                                        {translate({
                                            ar: "لا يوجد أصناف فرعية بعد.",
                                            en: "No SubCategories yet.",
                                        })}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                title={translate({
                    ar:
                        editingId !== null
                            ? "تعديل صنف فرعي"
                            : "إضافة صنف فرعي",
                    en:
                        editingId !== null
                            ? "Edit SubCategory"
                            : "Add SubCategory",
                })}
            >
                <form
                    id="add-subcat"
                    className="space-y-4"
                    onSubmit={onSubmitHandler}
                >
                    <GridItem>
                        <label className="mb-2 block text-sm font-medium">
                            {translate({
                                ar: "الصنف الرئيسي",
                                en: "Main Category",
                            })}
                        </label>
                        <select
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                borderColor: colors.border,
                            }}
                            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            value={subCatForm.data.categories_id}
                            onChange={(e) =>
                                subCatForm.setData(
                                    "categories_id",
                                    Number(e.target.value),
                                )
                            }
                        >
                            <option value="0" disabled>
                                {translate({
                                    ar: "اختر صنف رئيسي",
                                    en: "Select a category",
                                })}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name_ar} - {cat.name_en}
                                </option>
                            ))}
                        </select>
                        {subCatForm.errors.categories_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {subCatForm.errors.categories_id}
                            </p>
                        )}
                    </GridItem>

                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الصنف (عربي)",
                                    en: "SubCategory Name (arabic)",
                                })}
                                value={subCatForm.data.name_ar}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "name_ar",
                                        e.target.value,
                                    )
                                }
                                error={subCatForm.errors.name_ar}
                                required
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الصنف (إنجليزي)",
                                    en: "SubCategory Name (english)",
                                })}
                                value={subCatForm.data.name_en}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "name_en",
                                        e.target.value,
                                    )
                                }
                                error={subCatForm.errors.name_en}
                                required
                            />
                        </GridItem>
                    </Grid>

                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "المعرف (Slug عربي)",
                                    en: "Slug (arabic)",
                                })}
                                value={subCatForm.data.slug_ar}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "slug_ar",
                                        e.target.value,
                                    )
                                }
                                error={subCatForm.errors.slug_ar}
                                required
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "المعرف (Slug إنجليزي)",
                                    en: "Slug (english)",
                                })}
                                value={subCatForm.data.slug_en}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "slug_en",
                                        e.target.value,
                                    )
                                }
                                error={subCatForm.errors.slug_en}
                                required
                            />
                        </GridItem>
                    </Grid>

                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "الوصف (عربي)",
                                    en: "Description (arabic)",
                                })}
                                value={subCatForm.data.desc_ar}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "desc_ar",
                                        e.target.value,
                                    )
                                }
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "الوصف (إنجليزي)",
                                    en: "Description (english)",
                                })}
                                value={subCatForm.data.desc_en}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "desc_en",
                                        e.target.value,
                                    )
                                }
                            />
                        </GridItem>
                    </Grid>

                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <label className="mb-2 block text-sm font-medium">
                                {translate({
                                    ar: "صورة الصنف الفرعي",
                                    en: "SubCategory Image",
                                })}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="avora-input w-full"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        subCatForm.setData("img", file);
                                    }
                                }}
                            />
                            {subCatForm.errors.img && (
                                <p className="mt-1 text-sm text-red-500">
                                    {subCatForm.errors.img}
                                </p>
                            )}
                        </GridItem>
                        <GridItem>
                            <label className="mb-2 block text-sm font-medium">
                                {translate({ ar: "الحالة", en: "Status" })}
                            </label>
                            <select
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    borderColor: colors.border,
                                }}
                                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                value={subCatForm.data.is_active ? "1" : "0"}
                                onChange={(e) =>
                                    subCatForm.setData(
                                        "is_active",
                                        e.target.value === "1",
                                    )
                                }
                            >
                                <option value="1">
                                    {translate({ ar: "مفعل", en: "Active" })}
                                </option>
                                <option value="0">
                                    {translate({ ar: "معطل", en: "Inactive" })}
                                </option>
                            </select>
                        </GridItem>
                    </Grid>

                    <Grid layout="two">
                        <GridItem>
                            <Button
                                type="submit"
                                form="add-subcat"
                                disabled={subCatForm.processing}
                                fullWidth
                            >
                                {translate({
                                    ar: editingId !== null ? "تعديل" : "إضافة",
                                    en: editingId !== null ? "Update" : "Add",
                                })}
                            </Button>
                        </GridItem>
                        <GridItem>
                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={() => setOpenModal(false)}
                            >
                                {translate({ ar: "إلغاء", en: "Cancel" })}
                            </Button>
                        </GridItem>
                    </Grid>
                </form>
            </Modal>

            <Modal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false);
                    setDeleteId(null);
                }}
                title={translate({
                    ar: "حذف الصنف الفرعي",
                    en: "Delete SubCategory",
                })}
            >
                <p className="mb-4">
                    {translate({
                        ar: "هل تريد حذف هذا الصنف الفرعي؟ لا يمكن التراجع عن هذا الإجراء.",
                        en: "Are you sure you want to delete this subcategory? This action cannot be undone.",
                    })}
                </p>
                <Grid layout="two" gap="md">
                    <GridItem>
                        <Button
                            variant="danger"
                            fullWidth
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {translate({ ar: "حذف", en: "Delete" })}
                        </Button>
                    </GridItem>
                    <GridItem>
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => {
                                setOpenDeleteModal(false);
                                setDeleteId(null);
                            }}
                        >
                            {translate({ ar: "إلغاء", en: "Cancel" })}
                        </Button>
                    </GridItem>
                </Grid>
            </Modal>
        </>
    );
};
