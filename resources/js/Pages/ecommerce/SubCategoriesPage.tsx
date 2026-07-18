import { Button } from "@/avora-dash/components/Button";
import {
    Alert,
    type AlertVariant,
} from "@/avora-dash/components/Alert";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { ImageInput } from "@/avora-dash/components/forms/ImageInput";
import { Select } from "@/avora-dash/components/forms/Select";
import { Grid } from "@/avora-dash/components/Grid";
import { GridItem } from "@/avora-dash/components/Grid/GridItem";
import { Modal } from "@/avora-dash/components/Modal/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Category, PageProps, SubCategory } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export const SubCategoriesPage = () => {
    const { translate } = useLanguage();
    const page = usePage<PageProps>();

    const subCategories = page.props.subCategories as (SubCategory & {
        category?: Category;
    })[];
    const categories = page.props.categories as Category[];

    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        variant: AlertVariant;
        title: string;
        message: string;
    } | null>(null);

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
        setEditingImage(subCat.img ? `/storage/${subCat.img}` : null);
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
                        setEditingImage(null);
                        setNotification({
                            variant: "success",
                            title: translate({
                                ar: "تم تعديل الصنف الفرعي",
                                en: "Subcategory updated",
                            }),
                            message: translate({
                                ar: "تم حفظ التعديلات بنجاح.",
                                en: "The changes were saved successfully.",
                            }),
                        });
                    },
                    onError: () =>
                        setNotification({
                            variant: "danger",
                            title: translate({
                                ar: "تعذر تعديل الصنف الفرعي",
                                en: "Subcategory could not be updated",
                            }),
                            message: translate({
                                ar: "راجع البيانات المدخلة وحاول مرة أخرى.",
                                en: "Review the entered data and try again.",
                            }),
                        }),
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
                    setEditingImage(null);
                    setNotification({
                        variant: "success",
                        title: translate({
                            ar: "تمت إضافة الصنف الفرعي",
                            en: "Subcategory created",
                        }),
                        message: translate({
                            ar: "تم حفظ البيانات بنجاح.",
                            en: "The data was saved successfully.",
                        }),
                    });
                },
                onError: () =>
                    setNotification({
                        variant: "danger",
                        title: translate({
                            ar: "تعذر إضافة الصنف الفرعي",
                            en: "Subcategory could not be created",
                        }),
                        message: translate({
                            ar: "راجع البيانات المدخلة وحاول مرة أخرى.",
                            en: "Review the entered data and try again.",
                        }),
                    }),
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
                setNotification({
                    variant: "success",
                    title: translate({
                        ar: "تم حذف الصنف الفرعي",
                        en: "Subcategory deleted",
                    }),
                    message: translate({
                        ar: "تم الحذف بنجاح.",
                        en: "The subcategory was deleted successfully.",
                    }),
                });
            },
            onError: () =>
                setNotification({
                    variant: "danger",
                    title: translate({
                        ar: "تعذر حذف الصنف الفرعي",
                        en: "Subcategory could not be deleted",
                    }),
                    message: translate({
                        ar: "حاول مرة أخرى أو تأكد من عدم ارتباطه ببيانات أخرى.",
                        en: "Try again or check whether it is linked to other data.",
                    }),
                }),
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingId(null);
        setEditingImage(null);
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

            {notification && (
                <Alert
                    floating
                    placement="top-end"
                    variant={notification.variant}
                    title={notification.title}
                    onDismiss={() => setNotification(null)}
                    dismissLabel={translate({ ar: "إغلاق", en: "Dismiss" })}
                >
                    {notification.message}
                </Alert>
            )}

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
                                    setEditingImage(null);
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
                                            <button
                                                type="button"
                                                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30 dark:text-slate-400 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
                                                onClick={() =>
                                                    editHandler(item)
                                                }
                                                aria-label={translate({
                                                    ar: "تعديل الصنف الفرعي",
                                                    en: "Edit subcategory",
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
                                                    deleteHandler(item.id)
                                                }
                                                aria-label={translate({
                                                    ar: "حذف الصنف الفرعي",
                                                    en: "Delete subcategory",
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
                    {subCatForm.hasErrors && (
                        <Alert
                            variant="danger"
                            title={translate({
                                ar: "تعذر حفظ الصنف الفرعي",
                                en: "Subcategory could not be saved",
                            })}
                        >
                            {translate({
                                ar: "راجع الحقول الموضحة أدناه ثم حاول مرة أخرى.",
                                en: "Review the highlighted fields and try again.",
                            })}
                        </Alert>
                    )}

                    <GridItem>
                        <Select<number>
                            label={translate({
                                ar: "الصنف الرئيسي",
                                en: "Main Category",
                            })}
                            value={subCatForm.data.categories_id || null}
                            placeholder={translate({
                                ar: "اختر صنفًا رئيسيًا",
                                en: "Select a category",
                            })}
                            options={categories.map((category) => ({
                                value: category.id,
                                label: `${category.name_ar} - ${category.name_en}`,
                                image:
                                    typeof category.img === "string"
                                        ? `/storage/${category.img}`
                                        : null,
                            }))}
                            onChange={(value) => {
                                if (value !== null) {
                                    subCatForm.setData("categories_id", value);
                                }
                            }}
                            error={subCatForm.errors.categories_id}
                        />
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
                            <ImageInput
                                label={translate({
                                    ar: "صورة الصنف الفرعي",
                                    en: "SubCategory Image",
                                })}
                                value={subCatForm.data.img}
                                currentImage={editingImage}
                                onChange={(file) =>
                                    subCatForm.setData("img", file)
                                }
                                error={subCatForm.errors.img}
                            />
                        </GridItem>
                        <GridItem>
                            <Select<number>
                                label={translate({
                                    ar: "الحالة",
                                    en: "Status",
                                })}
                                value={subCatForm.data.is_active ? 1 : 0}
                                options={[
                                    {
                                        value: 1,
                                        label: translate({
                                            ar: "مفعل",
                                            en: "Active",
                                        }),
                                        description: translate({
                                            ar: "يظهر الصنف الفرعي للمستخدمين",
                                            en: "Visible to users",
                                        }),
                                    },
                                    {
                                        value: 0,
                                        label: translate({
                                            ar: "معطل",
                                            en: "Inactive",
                                        }),
                                        description: translate({
                                            ar: "يظل الصنف الفرعي مخفيًا",
                                            en: "Hidden from users",
                                        }),
                                    },
                                ]}
                                onChange={(value) =>
                                    subCatForm.setData(
                                        "is_active",
                                        value === 1,
                                    )
                                }
                            />
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
