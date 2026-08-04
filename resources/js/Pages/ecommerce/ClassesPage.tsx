import { Alert, AlertVariant } from "@/avora-dash/Components/Alert";
import { Button } from "@/avora-dash/Components/Button";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { ImageInput } from "@/avora-dash/Components/forms/ImageInput";
import { Select } from "@/avora-dash/Components/forms/Select";
import { Grid } from "@/avora-dash/Components/Grid/Grid";
import { GridItem } from "@/avora-dash/Components/Grid/GridItem";
import { Modal } from "@/avora-dash/Components/Modal/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { Classes, PageProps } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export const ClassesPage = () => {
    const { translate } = useLanguage();
    const page = usePage<PageProps>();
    const classes = page.props.classes as Classes[];
    const [notification, setNotification] = useState<{
        variant: AlertVariant;
        title: string;
        message: string;
    } | null>(null);

    const classesEmpty: Classes = {
        id: 0,
        name_ar: "",
        name_en: "",
        desc_ar: "",
        desc_en: "",
        slug_ar: "",
        slug_en: "",
        img: null,
        status: true,
    };

    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const classesForm = useForm<Classes>(classesEmpty);

    // handler======================================
    //
    // Edit  =============================================

    const editHandler = (item: Classes) => {
        setEditingId(item.id);

        const currentImage =
            typeof item.img === "string" && item.img
                ? item.img.startsWith("http") || item.img.startsWith("/")
                    ? item.img
                    : `/storage/${item.img}`
                : null;

        setEditingImage(currentImage);

        classesForm.setData({
            ...item,
            img: null,
        });

        setOpenModal(true);
    };
    // Delete  ============================================
    const deleteHandler = (id: number) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId === null) return;

        router.delete(route("dashboard.classes.destroy", deleteId), {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setDeleteId(null);
                setNotification({
                    variant: "success",
                    title: translate({
                        ar: "تم حذف الفئة",
                        en: "Classes deleted",
                    }),
                    message: translate({
                        ar: "تم حذف الصنف بنجاح.",
                        en: "The Classes was deleted successfully.",
                    }),
                });
            },
            onError: () =>
                setNotification({
                    variant: "danger",
                    title: translate({
                        ar: "تعذر حذف الفئة",
                        en: "Classes could not be deleted",
                    }),
                    message: translate({
                        ar: "حاول مرة أخرى أو تأكد من عدم ارتباطه ببيانات أخرى.",
                        en: "Try again or check whether it is linked to other data.",
                    }),
                }),
        });
    };

    // Store ============================================
    const onSubmitHandler: FormEventHandler = (event) => {
        event.preventDefault();

        if (editingId !== null) {
            classesForm.transform((data) => ({
                ...data,
                img: data.img instanceof File ? data.img : null,
                _method: "put",
            }));

            classesForm.post(route("dashboard.classes.update", editingId), {
                forceFormData: true,
                preserveScroll: true,

                onSuccess: () => {
                    setOpenModal(false);
                    setEditingId(null);
                    setEditingImage(null);
                    classesForm.reset();
                    classesForm.clearErrors();
                },
            });

            return;
        }

        classesForm.transform((data) => ({
            ...data,
            img: data.img instanceof File ? data.img : null,
        }));

        classesForm.post(route("dashboard.classes.store"), {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setOpenModal(false);
                setEditingId(null);
                setEditingImage(null);
                classesForm.reset();
                classesForm.clearErrors();

                setNotification({
                    variant: "success",
                    title: translate({
                        ar: "تمت الإضافة",
                        en: "Created",
                    }),
                    message: translate({
                        ar: "تمت إضافة الفئة بنجاح.",
                        en: "Category created successfully.",
                    }),
                });
            },
        });
    };
    // ============================================

    return (
        <>
            <Head
                title={translate({
                    ar: "أدارة الفئات",
                    en: "Classes Mangement",
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
                                {translate({ ar: "الفئات", en: "Classes" })}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {translate({
                                    ar: "إضافة وتعديل وحذف الفئات من قاعدة البيانات.",
                                    en: "Create, edit, and delete real classes from the database.",
                                })}
                            </p>
                        </div>

                        <div>
                            <Button
                                onClick={() => {
                                    classesForm.reset();
                                    setEditingId(null);
                                    setEditingImage(null);
                                    setOpenModal(true);
                                }}
                            >
                                {translate({
                                    ar: "إضافة فئة جديدة",
                                    en: "Add New Classes",
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
                        {classes.map((item) => (
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
                        {classes.length === 0 && (
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

            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditingId(null);
                    setEditingImage(null);
                    classesForm.clearErrors();
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
                    {classesForm.hasErrors && (
                        <Alert
                            variant="danger"
                            title={translate({
                                ar: "تعذر حفظ الفئة",
                                en: "Classes could not be saved",
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
                                    ar: "اسم الفئة (عربي)",
                                    en: "Classes Name (arabic)",
                                })}
                                value={classesForm.data.name_ar}
                                onChange={(event) =>
                                    classesForm.setData(
                                        "name_ar",
                                        event.target.value,
                                    )
                                }
                                error={classesForm.errors.name_ar}
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الفئة (إنجليزي)",
                                    en: "Classes Name (english)",
                                })}
                                value={classesForm.data.name_en}
                                onChange={(event) =>
                                    classesForm.setData(
                                        "name_en",
                                        event.target.value,
                                    )
                                }
                                error={classesForm.errors.name_en}
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
                                value={classesForm.data.slug_ar}
                                onChange={(event) =>
                                    classesForm.setData(
                                        "slug_ar",
                                        event.target.value,
                                    )
                                }
                                error={classesForm.errors.slug_ar}
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "المعرف (Slug إنجليزي)",
                                    en: "Slug (english)",
                                })}
                                value={classesForm.data.slug_en}
                                onChange={(event) =>
                                    classesForm.setData(
                                        "slug_en",
                                        event.target.value,
                                    )
                                }
                                error={classesForm.errors.slug_en}
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
                                value={classesForm.data.desc_ar}
                                onChange={(event) =>
                                    classesForm.setData(
                                        "desc_ar",
                                        event.target.value,
                                    )
                                }
                                error={classesForm.errors.desc_ar}
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "الوصف (إنجليزي)",
                                    en: "Description (english)",
                                })}
                                value={classesForm.data.desc_en}
                                onChange={(event) =>
                                    classesForm.setData(
                                        "desc_en",
                                        event.target.value,
                                    )
                                }
                                error={classesForm.errors.desc_en}
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
                                value={
                                    classesForm.data.img instanceof File
                                        ? classesForm.data.img
                                        : null
                                }
                                currentImage={editingImage}
                                onChange={(file) =>
                                    classesForm.setData("img", file)
                                }
                                error={classesForm.errors.img}
                            />
                        </GridItem>
                        <GridItem>
                            <Select<number>
                                label={translate({
                                    ar: "الحالة",
                                    en: "Status",
                                })}
                                value={classesForm.data.status ? 1 : 0}
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
                                    classesForm.setData("status", value === 1)
                                }
                            />
                        </GridItem>
                    </Grid>

                    <Grid layout="two">
                        <GridItem>
                            <Button
                                type="submit"
                                form="add-cat"
                                disabled={classesForm.processing}
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
};
