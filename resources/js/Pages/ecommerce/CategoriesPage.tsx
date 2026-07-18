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

export const CategoriesPage = () => {
    const { translate } = useLanguage();
    const page = usePage<PageProps>();
    const categories = page.props.categories as (Category & {
        sub_categories: SubCategory[];
    })[];
    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        variant: AlertVariant;
        title: string;
        message: string;
    } | null>(null);

    const categoryForm = useForm<Category>({
        id: 0,
        img: null,
        name_ar: "",
        name_en: "",
        desc_ar: "",
        desc_en: "",
        slug_ar: "",
        slug_en: "",
        status: false,
    });

    // handler
    // ==================================

    const editHandler = (category: Category) => {
        setEditingId(category.id);
        setEditingImage(
            typeof category.img === "string"
                ? `/storage/${category.img}`
                : null,
        );
        categoryForm.setData({
            id: category.id,
            img: null,
            name_ar: category.name_ar,
            name_en: category.name_en,
            desc_ar: category.desc_ar,
            desc_en: category.desc_en,
            slug_ar: category.slug_ar,
            slug_en: category.slug_en,
            status: category.status,
        });
        setOpenModal(true);
    }


    const onSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();

        // 1. بناء الـ FormData يدوياً لضمان وصول البيانات
        const formData = new FormData();
        formData.append("name_ar", categoryForm.data.name_ar || "");
        formData.append("name_en", categoryForm.data.name_en || "");
        formData.append("desc_ar", categoryForm.data.desc_ar || "");
        formData.append("desc_en", categoryForm.data.desc_en || "");
        formData.append("slug_ar", categoryForm.data.slug_ar || "");
        formData.append("slug_en", categoryForm.data.slug_en || "");
        formData.append("status", categoryForm.data.status ? "1" : "0");

        // 2. إضافة الصورة فقط إذا تم اختيار ملف جديد
        if (categoryForm.data.img instanceof File) {
            formData.append("img", categoryForm.data.img);
        }

        const option = {
            onSuccess: () => {
                const wasEditing = editingId !== null;
                setOpenModal(false);
                categoryForm.reset();
                setEditingId(null);
                setEditingImage(null);
                setNotification({
                    variant: "success" as AlertVariant,
                    title: translate({
                        ar: wasEditing ? "تم تعديل الصنف" : "تمت إضافة الصنف",
                        en: wasEditing
                            ? "Category updated"
                            : "Category created",
                    }),
                    message: translate({
                        ar: "تم حفظ البيانات بنجاح.",
                        en: "The data was saved successfully.",
                    }),
                });
            },
            onError: (errors: any) => {
                console.log("Validation Errors:", errors);
                setNotification({
                    variant: "danger" as AlertVariant,
                    title: translate({
                        ar: "تعذر حفظ الصنف",
                        en: "Category could not be saved",
                    }),
                    message: translate({
                        ar: "راجع البيانات المدخلة وحاول مرة أخرى.",
                        en: "Review the entered data and try again.",
                    }),
                });
            },
        };

        // 3. إرسال الطلب
        if (editingId !== null) {
            // للتعديل: نستخدم POST مع إضافة _method = PUT لأن Laravel لا يقبل PUT مع FormData
            formData.append("_method", "PUT");
            router.post(
                route("dashboard.categories.update", editingId),
                formData,
                option,
            );
        } else {
            // للإضافة: نستخدم POST
            router.post(route("dashboard.categories.store"), formData, option);
        }
    };

    const deleteHandler = (id: number) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };


    const confirmDelete = () => {
        if (deleteId === null) return;

        router.delete(route("dashboard.categories.destroy", deleteId), {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setDeleteId(null);
                setNotification({
                    variant: "success",
                    title: translate({
                        ar: "تم حذف الصنف",
                        en: "Category deleted",
                    }),
                    message: translate({
                        ar: "تم حذف الصنف بنجاح.",
                        en: "The category was deleted successfully.",
                    }),
                });
            },
            onError: () =>
                setNotification({
                    variant: "danger",
                    title: translate({
                        ar: "تعذر حذف الصنف",
                        en: "Category could not be deleted",
                    }),
                    message: translate({
                        ar: "حاول مرة أخرى أو تأكد من عدم ارتباطه ببيانات أخرى.",
                        en: "Try again or check whether it is linked to other data.",
                    }),
                }),
        });
    };

    return (
        <>
            <Head
                title={translate({
                    ar: "أدارة الاصناف",
                    en: "Categories Mangement",
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
                                {translate({ ar: "الأصناف", en: "Categories" })}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {translate({
                                    ar: "إضافة وتعديل وحذف الأصناف من قاعدة البيانات.",
                                    en: "Create, edit, and delete real categories from the database.",
                                })}
                            </p>
                        </div>

                        <div>
                            <Button
                                onClick={() => {
                                    categoryForm.reset();
                                    setEditingId(null);
                                    setEditingImage(null);
                                    setOpenModal(true);
                                }}
                            >
                                {translate({
                                    ar: "إضافة صنف جديد",
                                    en: "Add New Category",
                                })}
                            </Button>
                        </div>
                    </div>
                </div>

                <table className="w-full min-w-[760px] text-sm">
                    <thead className="avora-surface-muted avora-muted">
                        <tr>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الصورة",
                                    en: "Image",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الاسم",
                                    en: "name",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الوصف",
                                    en: "Description",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "slug",
                                    en: "slug",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الأصناف الفرعية",
                                    en: "Subcategories",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الحالة",
                                    en: "status",
                                })}
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
                        {categories.map((item) => (
                            <tr key={item.id} className="avora-border border-b">
                                <td className="avora-muted px-6 py-4">
                                    {item.img && (
                                        <img
                                            src={`/storage/${item.img}`}
                                            alt={item.name_ar}
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 font-semibold">
                                    <p className="text-mute">{item.name_ar}</p>
                                    <p className="text-mute">{item.name_en}</p>
                                </td>
                                <td className="avora-muted px-6 py-4">
                                    <p className="text-mute">{item.desc_ar}</p>
                                    <p className="text-mute">{item.desc_en}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-mute">{item.slug_ar}</p>
                                    <p className="text-mute">{item.slug_en}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {item.sub_categories.length > 0
                                        ? item.sub_categories.map((subCategory) => (
                                              <p
                                                  key={subCategory.id}
                                                  className="text-mute"
                                              >
                                                  {subCategory.name_ar} -{" "}
                                                  {subCategory.name_en}
                                              </p>
                                          ))
                                        : "-"}
                                </td>
                                <td className="avora-muted px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${item.status ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}
                                    >
                                        {item.status
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
                                            onClick={() => editHandler(item)}
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
                                                deleteHandler(item.id)
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
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-10 text-center text-sm text-slate-500"
                                >
                                    {translate({
                                        ar: "لا يوجد أصناف بعد.",
                                        en: "No Categories yet.",
                                    })}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODEL ADD / EDIT CATEGORIES */}

            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingId(null);
                    setEditingImage(null);
                    categoryForm.clearErrors();
                }}
                title={translate({
                    ar: editingId !== null ? "تعديل صنف" : "إضافة صنف",
                    en: editingId !== null ? "Edit Category" : "Add Category",
                })}
            >
                <form
                    id="add-cat"
                    className="space-y-4"
                    onSubmit={onSubmitHandler}
                >
                    {categoryForm.hasErrors && (
                        <Alert
                            variant="danger"
                            title={translate({
                                ar: "تعذر حفظ الصنف",
                                en: "Category could not be saved",
                            })}
                        >
                            {translate({
                                ar: "راجع الحقول الموضحة أدناه ثم حاول مرة أخرى.",
                                en: "Review the highlighted fields and try again.",
                            })}
                        </Alert>
                    )}

                    {/* Name arabic and english */}
                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الصنف (عربي)",
                                    en: "Category Name (arabic)",
                                })}
                                value={categoryForm.data.name_ar}
                                onChange={(event) =>
                                    categoryForm.setData(
                                        "name_ar",
                                        event.target.value,
                                    )
                                }
                                error={categoryForm.errors.name_ar}
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الصنف (إنجليزي)",
                                    en: "Category Name (english)",
                                })}
                                value={categoryForm.data.name_en}
                                onChange={(event) =>
                                    categoryForm.setData(
                                        "name_en",
                                        event.target.value,
                                    )
                                }
                                error={categoryForm.errors.name_en}
                            />
                        </GridItem>
                    </Grid>

                    {/* Slug arabic and english */}
                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "المعرف (Slug عربي)",
                                    en: "Slug (arabic)",
                                })}
                                value={categoryForm.data.slug_ar}
                                onChange={(event) =>
                                    categoryForm.setData(
                                        "slug_ar",
                                        event.target.value,
                                    )
                                }
                                error={categoryForm.errors.slug_ar}
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "المعرف (Slug إنجليزي)",
                                    en: "Slug (english)",
                                })}
                                value={categoryForm.data.slug_en}
                                onChange={(event) =>
                                    categoryForm.setData(
                                        "slug_en",
                                        event.target.value,
                                    )
                                }
                                error={categoryForm.errors.slug_en}
                            />
                        </GridItem>
                    </Grid>

                    {/* Description arabic and english */}
                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "الوصف (عربي)",
                                    en: "Description (arabic)",
                                })}
                                value={categoryForm.data.desc_ar}
                                onChange={(event) =>
                                    categoryForm.setData(
                                        "desc_ar",
                                        event.target.value,
                                    )
                                }
                                error={categoryForm.errors.desc_ar}
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "الوصف (إنجليزي)",
                                    en: "Description (english)",
                                })}
                                value={categoryForm.data.desc_en}
                                onChange={(event) =>
                                    categoryForm.setData(
                                        "desc_en",
                                        event.target.value,
                                    )
                                }
                                error={categoryForm.errors.desc_en}
                            />
                        </GridItem>
                    </Grid>

                    {/* Image URL & Status */}
                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <ImageInput
                                label={translate({
                                    ar: "صورة الصنف",
                                    en: "Category Image",
                                })}
                                value={categoryForm.data.img}
                                currentImage={editingImage}
                                onChange={(file) =>
                                    categoryForm.setData("img", file)
                                }
                                error={categoryForm.errors.img}
                            />
                        </GridItem>
                        <GridItem>
                            <Select<number>
                                label={translate({
                                    ar: "الحالة",
                                    en: "Status",
                                })}
                                value={categoryForm.data.status ? 1 : 0}
                                options={[
                                    {
                                        value: 1,
                                        label: translate({
                                            ar: "مفعل",
                                            en: "Active",
                                        }),
                                        description: translate({
                                            ar: "يظهر الصنف للمستخدمين",
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
                                            ar: "يظل الصنف مخفيًا",
                                            en: "Hidden from users",
                                        }),
                                    },
                                ]}
                                onChange={(value) =>
                                    categoryForm.setData("status", value === 1)
                                }
                            />
                        </GridItem>
                    </Grid>

                    <Grid layout="two">
                        <GridItem>
                            <Button
                                type="submit"
                                form="add-cat"
                                disabled={categoryForm.processing}
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
                                variant="danger"
                                fullWidth
                                onClick={() => setOpenModal(false)}
                            >
                                {translate({ ar: "إلغاء", en: "Cancel" })}
                            </Button>
                        </GridItem>
                    </Grid>
                </form>
            </Modal>

            {/* MODEL DELETE CATEGORY */}
            <Modal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false);
                    setDeleteId(null);
                }}
                title={translate({ ar: "حذف الصنف", en: "Delete Category" })}
            >
                <p className="mb-4">
                    {translate({
                        ar: "هل تريد حذف هذا الصنف؟ لا يمكن التراجع عن هذا الإجراء.",
                        en: "Are you sure you want to delete this category? This action cannot be undone.",
                    })}
                </p>

                <Grid layout="two" gap="md">
                    <GridItem>
                        <Button
                            variant="danger"
                            fullWidth
                            onClick={confirmDelete}
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
}
