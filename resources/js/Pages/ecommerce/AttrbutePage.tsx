import { Button } from "@/avora-dash/components/Button";
import { Card } from "@/avora-dash/components/Card/Card";
import { CardFooter } from "@/avora-dash/components/Card/CardFooter";
import { CardTitle } from "@/avora-dash/components/Card/CardTitle";
import { FormButton } from "@/avora-dash/components/forms/FormButton";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { GridItem } from "@/avora-dash/components/Grid";
import { Grid } from "@/avora-dash/components/Grid/Grid";
import { Modal } from "@/avora-dash/components/Modal/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";
import { Attribute, AttributeForm, PageProps } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

export const AttrbutePage = () => {

    const page = usePage<PageProps>();
    const attributes = page.props.attributes as Attribute[];
    const { translate } = useLanguage();
    const [openModel, setOpenModel] = useState(false);
    const [openModelDelete, setOpenModelDelete] = useState(false);
    const attrForm = useForm<Attribute>({
        id: 0,
        name: "",
        unit: "",
        name_en: "",
        unit_en: "",
        type: "text"
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);;

    const {colors} = useTheme();
    const flash = page.props.flash as {
    success?: string;
};

    const submitAttr: FormEventHandler = (event) => {
        event.preventDefault();
        const option = {
            onSuccess: () => {
            setOpenModel(false);
            attrForm.reset();
            }
        }
        if (editingId) {
            attrForm.put(
                route("dashboard.attributes.update", editingId),
                option
            );
        } else {
            attrForm.post(route("dashboard.attributes.store"), option);
        }


    }

    const editHandler = (attribute: Attribute) => {
        setEditingId(attribute.id!);
        attrForm.setData({
            name: attribute.name,
            name_en: attribute.name_en,
            unit: attribute.unit,
            unit_en: attribute.unit_en,
            type: attribute.type,
        });

        setOpenModel(true);
    };

    const deleteHandler = (id: number) => {
        setDeleteId(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId === null) return;

        router.delete(route("dashboard.attributes.destroy", deleteId), {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setDeleteId(null);
            },
        });
    };

    return (
        <section className="space-y-5">
            <Head
                title={translate({
                    ar: "إضافة خاصية منتج",
                    en: "Add Product Attrboute",
                })}
            />

            <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                {translate({ ar: "المستخدمون", en: "Users" })}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {translate({
                                    ar: "إضافة وتعديل وحذف مستخدمين حقيقيين من قاعدة البيانات.",
                                    en: "Create, edit, and delete real users from the database.",
                                })}
                            </p>
                        </div>

                        <div>
                            <Button
                                onClick={() => {
                                    setEditingId(null);
                                    attrForm.reset();
                                    setOpenModel(true);
                                }}
                            >
                                {translate({
                                    ar: "إضافة خاصية",
                                    en: "Add Attribute",
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
                                    ar: "الخاصية (عربي).",
                                    en: "attr(ar).",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الخاصية (انجلش).",
                                    en: "attr(en).",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الوحده(عربي).",
                                    en: "unit(ar).",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "الوحدة (انجلزي).",
                                    en: "unit(en).",
                                })}
                            </th>
                            <th className="px-6 py-4 text-start">
                                {translate({
                                    ar: "النوع",
                                    en: "type",
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
                        {attributes.map((item) => (
                            <tr key={item.id} className="avora-border border-b">
                                <td className="px-6 py-4 font-semibold">
                                    {item.name}
                                </td>
                                <td className="avora-muted px-6 py-4">
                                    {item.name_en}
                                </td>
                                <td className="px-6 py-4">{item.unit}</td>
                                <td className="avora-muted px-6 py-4">
                                    {item.unit_en}
                                </td>
                                <td className="avora-muted px-6 py-4">
                                    {item.type}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            rounded="no"
                                            onClick={() => editHandler(item)}
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
                        {attributes.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-10 text-center text-sm text-slate-500"
                                >
                                    {translate({
                                        ar: "لا يوجد خصائص بعد.",
                                        en: "No Attributes yet.",
                                    })}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* model attribute */}
            {/* ============================ */}
            <Modal
                open={openModel}
                onClose={() => {
                    setOpenModel(false);
                }}
                title={translate({
                    ar:
                        editingId !== null
                            ? "تعديل خاصية المنتج"
                            : "إضافة خاصية منتج",
                    en:
                        editingId !== null
                            ? "Edit Product Attribute"
                            : "Add Product Attribute",
                })}
            >
                <form id="add-attr" onSubmit={submitAttr}>
                    {/* attrbiute arabic and english */}

                    <Grid layout="two" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الخاصية (عربي).",
                                    en: "attribute name (arabic).",
                                })}
                                value={attrForm.data.name}
                                onChange={(event) =>
                                    attrForm.setData("name", event.target.value)
                                }
                                error={attrForm.errors.name}
                                required
                            />
                        </GridItem>
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "اسم الخاصية (انجلش).",
                                    en: "attribute name (english).",
                                })}
                                value={attrForm.data.name_en}
                                onChange={(event) =>
                                    attrForm.setData(
                                        "name_en",
                                        event.target.value,
                                    )
                                }
                                error={attrForm.errors.name_en}
                                required
                            />
                        </GridItem>
                    </Grid>

                    {/* unit arabic and english */}
                    <Grid layout="three" gap="sm">
                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: " الوحده بالعربي",
                                    en: "unit for arabic",
                                })}
                                value={attrForm.data.unit}
                                onChange={(event) =>
                                    attrForm.setData("unit", event.target.value)
                                }
                                error={attrForm.errors.unit}
                                required
                                placeholder="kg , g , xl, lg"
                            />
                        </GridItem>

                        <GridItem>
                            <FormField
                                label={translate({
                                    ar: "الوحده (انجلش).",
                                    en: "unit (english).",
                                })}
                                value={attrForm.data.unit_en}
                                onChange={(event) =>
                                    attrForm.setData(
                                        "unit_en",
                                        event.target.value,
                                    )
                                }
                                error={attrForm.errors.unit_en}
                                required
                            />
                        </GridItem>
                        <GridItem className="">
                            <label className="mb-2 block text-sm font-medium">
                                {translate({
                                    ar: "نوع الخاصية",
                                    en: "Attribute Type",
                                })}
                            </label>
                            <select
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    borderColor: colors.border,
                                }}
                                className="focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                value={attrForm.data.type}
                                onChange={(e) =>
                                    attrForm.setData(
                                        "type",
                                        e.target.value as
                                            | "text"
                                            | "number"
                                            | "select"
                                            | "boolean",
                                    )
                                }
                            >
                                <option value="text">
                                    {translate({
                                        ar: "نص",
                                        en: "TEXT",
                                    })}
                                </option>
                                <option value="number">
                                    {translate({
                                        ar: "رقم",
                                        en: "NUMBER",
                                    })}
                                </option>
                                <option value="select">
                                    {translate({
                                        ar: "إختيارات",
                                        en: "SELECT",
                                    })}
                                </option>
                                <option value="boolean">
                                    {translate({
                                        ar: "بولين",
                                        en: "BOOLEAN",
                                    })}
                                </option>
                            </select>
                        </GridItem>
                    </Grid>

                    <Grid layout="two">
                        <GridItem>
                            <Button
                                type="submit"
                                form="add-attr"
                                disabled={attrForm.processing}
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
                                onClick={() => {
                                    setOpenModel(false);
                                    setEditingId(null);
                                    attrForm.reset();
                                }}
                            >
                                {translate({ ar: "إلغاء", en: "Cancel" })}
                            </Button>
                        </GridItem>
                    </Grid>
                </form>
            </Modal>

            {/* model Delete attribute */}
            {/* ============================ */}
            <Modal
                open={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false);
                    setDeleteId(null);
                }}
                title={translate({
                    ar: "حذف الخاصية",
                    en: "Delete Attribute",
                })}
            >
                <p className="mb-4">
                    {translate({
                        ar: "هل تريد حذف هذه الخاصية؟",
                        en: "Are you sure you want to delete this attribute?",
                    })}
                </p>

                <Grid layout="two" gap="md">
                    <GridItem>
                        <Button
                            variant="danger"
                            fullWidth
                            onClick={confirmDelete}
                        >
                            {translate({
                                ar: "حذف",
                                en: "Delete",
                            })}
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
                            {translate({
                                ar: "إلغاء",
                                en: "Cancel",
                            })}
                        </Button>
                    </GridItem>
                </Grid>
            </Modal>
        </section>
    );
    };
