import { Button } from "@/avora-dash/Components/Button";
import { FormField } from "@/avora-dash/Components/forms/FormField";
import { Select } from "@/avora-dash/Components/forms/Select";
import { Modal } from "@/avora-dash/Components/Modal";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import type { PageProps } from "@/types";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useState, type FormEventHandler } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

type OfferType = "fixed" | "percent";

type Offer = {
    id: number;
    name_ar: string;
    name_en: string;
    type: OfferType;
    value: string;
    start_at: string | null;
    end_at: string | null;
    is_active: boolean;
};

type OfferForm = {
    name_ar: string;
    name_en: string;
    type: OfferType;
    value: string;
    start_at: string;
    end_at: string;
    is_active: boolean;
};

const emptyForm: OfferForm = {
    name_ar: "",
    name_en: "",
    type: "percent",
    value: "",
    start_at: "",
    end_at: "",
    is_active: true,
};

const dateValue = (value: string | null) => (value ? value.slice(0, 10) : "");

export function OffersPage() {
    const { translate } = useLanguage();
    const { props } = usePage<PageProps>();
    const offers = Array.isArray(props.offers) ? (props.offers as Offer[]) : [];

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Offer | null>(null);
    const [deleting, setDeleting] = useState<Offer | null>(null);
    const form = useForm<OfferForm>(emptyForm);

    const create = () => {
        setEditing(null);
        form.setData({ ...emptyForm });
        form.clearErrors();
        setOpen(true);
    };

    const edit = (offer: Offer) => {
        setEditing(offer);
        form.setData({
            name_ar: offer.name_ar,
            name_en: offer.name_en,
            type: offer.type,
            value: String(offer.value),
            start_at: dateValue(offer.start_at),
            end_at: dateValue(offer.end_at),
            is_active: Boolean(offer.is_active),
        });
        form.clearErrors();
        setOpen(true);
    };

    const closeForm = () => {
        setOpen(false);
        setEditing(null);
        form.reset();
        form.clearErrors();
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closeForm,
        };

        if (editing) {
            form.put(route("dashboard.offers.update", editing.id), options);
            return;
        }

        form.post(route("dashboard.offers.store"), options);
    };

    const destroy = () => {
        if (!deleting) return;

        router.delete(route("dashboard.offers.destroy", deleting.id), {
            preserveScroll: true,
            onSuccess: () => setDeleting(null),
        });
    };

    return (
        <section className="space-y-5">
            <Head title={translate({ ar: "إدارة العروض", en: "Offers" })} />

            <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold">
                            {translate({ ar: "العروض", en: "Offers" })}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {translate({
                                ar: "إدارة الخصومات ومواعيد تفعيلها.",
                                en: "Manage discounts and active periods.",
                            })}
                        </p>
                    </div>

                    <Button onClick={create}>
                        <FiPlus />
                        {translate({ ar: "عرض جديد", en: "New offer" })}
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-sm">
                        <thead className="avora-surface-muted avora-muted">
                            <tr>
                                <th className="px-5 py-4 text-start">العرض</th>
                                <th className="px-5 py-4 text-start">النوع</th>
                                <th className="px-5 py-4 text-start">القيمة</th>
                                <th className="px-5 py-4 text-start">
                                    البداية
                                </th>
                                <th className="px-5 py-4 text-start">
                                    النهاية
                                </th>
                                <th className="px-5 py-4 text-start">الحالة</th>
                                <th className="px-5 py-4 text-end">إجراءات</th>
                            </tr>
                        </thead>

                        <tbody>
                            {offers.map((offer) => (
                                <tr
                                    key={offer.id}
                                    className="avora-border border-b"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-bold">
                                            {offer.name_ar}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {offer.name_en}
                                        </p>
                                    </td>
                                    <td className="px-5 py-4">
                                        {offer.type === "percent"
                                            ? "نسبة مئوية"
                                            : "قيمة ثابتة"}
                                    </td>
                                    <td className="px-5 py-4 font-bold">
                                        {offer.value}
                                        {offer.type === "percent" ? "%" : ""}
                                    </td>
                                    <td className="px-5 py-4">
                                        {dateValue(offer.start_at) || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {dateValue(offer.end_at) || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${offer.is_active ? "avora-status-success" : "avora-status-danger"}`}
                                        >
                                            {offer.is_active
                                                ? "نشط"
                                                : "غير نشط"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-600"
                                                onClick={() => edit(offer)}
                                                title="تعديل"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                type="button"
                                                className="grid h-9 w-9 place-items-center rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                                onClick={() =>
                                                    setDeleting(offer)
                                                }
                                                title="حذف"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!offers.length && (
                        <p className="avora-muted p-10 text-center">
                            لا توجد عروض بعد.
                        </p>
                    )}
                </div>
            </div>

            <Modal
                open={open}
                onClose={closeForm}
                size="lg"
                title={editing ? "تعديل العرض" : "إضافة عرض"}
            >
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="اسم العرض بالعربية"
                            value={form.data.name_ar}
                            onChange={(e) =>
                                form.setData("name_ar", e.target.value)
                            }
                            error={form.errors.name_ar}
                            required
                        />
                        <FormField
                            label="Offer name in English"
                            value={form.data.name_en}
                            onChange={(e) =>
                                form.setData("name_en", e.target.value)
                            }
                            error={form.errors.name_en}
                            required
                        />
                        <Select
                            label="نوع العرض"
                            value={form.data.type}
                            options={[
                                { value: "percent", label: "نسبة مئوية" },
                                { value: "fixed", label: "قيمة ثابتة" },
                            ]}
                            onChange={(value) =>
                                form.setData("type", value as OfferType)
                            }
                            error={form.errors.type}
                            required
                        />
                        <FormField
                            type="number"
                            min="0"
                            max={
                                form.data.type === "percent" ? "100" : undefined
                            }
                            step="0.01"
                            label={
                                form.data.type === "percent"
                                    ? "نسبة الخصم"
                                    : "قيمة الخصم"
                            }
                            value={form.data.value}
                            onChange={(e) =>
                                form.setData("value", e.target.value)
                            }
                            error={form.errors.value}
                            required
                        />
                        <FormField
                            type="date"
                            label="تاريخ البداية"
                            value={form.data.start_at}
                            onChange={(e) =>
                                form.setData("start_at", e.target.value)
                            }
                            error={form.errors.start_at}
                        />
                        <FormField
                            type="date"
                            label="تاريخ النهاية"
                            min={form.data.start_at || undefined}
                            value={form.data.end_at}
                            onChange={(e) =>
                                form.setData("end_at", e.target.value)
                            }
                            error={form.errors.end_at}
                        />
                    </div>

                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={form.data.is_active}
                            onChange={(e) =>
                                form.setData("is_active", e.target.checked)
                            }
                            className="avora-checkbox rounded"
                        />
                        <span className="font-semibold">العرض نشط</span>
                    </label>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeForm}
                        >
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? "جارٍ الحفظ..." : "حفظ العرض"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                open={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                title="حذف العرض"
            >
                <p className="mb-5">
                    هل تريد حذف العرض «{deleting?.name_ar ?? ""}»؟
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setDeleting(null)}>
                        إلغاء
                    </Button>
                    <Button variant="danger" onClick={destroy}>
                        حذف
                    </Button>
                </div>
            </Modal>
        </section>
    );
}
