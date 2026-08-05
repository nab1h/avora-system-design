import { Button } from "@/avora-dash/components/Button";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { Modal } from "@/avora-dash/components/Modal";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState, type FormEventHandler } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
type Option = {
    id: number;
    name_ar: string;
    name_en: string;
    products_count: number;
};
const empty = { name_ar: "", name_en: "" };
export function ProductOptionsPage({
    type,
    title,
}: {
    type: "sizes" | "weights" | "materials";
    title: string;
}) {
    const options = ((usePage().props as Record<string, unknown>)[type] ??
        []) as Option[];
    const form = useForm(empty);
    const [editing, setEditing] = useState<Option | null>(null);
    const [deleting, setDeleting] = useState<Option | null>(null);
    const [open, setOpen] = useState(false);
    const openForm = (item?: Option) => {
        setEditing(item ?? null);
        form.setData(
            item ? { name_ar: item.name_ar, name_en: item.name_en } : empty,
        );
        setOpen(true);
    };
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = `/dashboard/${type}`;
        editing
            ? form.put(`${url}/${editing.id}`, {
                  onSuccess: () => setOpen(false),
              })
            : form.post(url, { onSuccess: () => setOpen(false) });
    };
    return (
        <section className="space-y-5">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold">إدارة {title}</h2>
                <Button onClick={() => openForm()}>
                    <FiPlus /> إضافة
                </Button>
            </div>
            <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                <table className="w-full text-sm">
                    <thead className="avora-surface-muted">
                        <tr>
                            <th className="px-5 py-4 text-start">العربي</th>
                            <th className="px-5 py-4 text-start">English</th>
                            <th className="px-5 py-4 text-start">المنتجات</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {options.map((item) => (
                            <tr key={item.id} className="avora-border border-t">
                                <td className="px-5 py-4 font-semibold">
                                    {item.name_ar}
                                </td>
                                <td className="px-5 py-4">{item.name_en}</td>
                                <td className="px-5 py-4">
                                    {item.products_count}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => openForm(item)}
                                        >
                                            <FiEdit2 />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setDeleting(item)}
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={`إدارة ${title}`}
            >
                <form onSubmit={submit} className="space-y-4">
                    <FormField
                        label="الاسم بالعربية"
                        value={form.data.name_ar}
                        onChange={(e) =>
                            form.setData("name_ar", e.target.value)
                        }
                    />
                    <FormField
                        label="English name"
                        value={form.data.name_en}
                        onChange={(e) =>
                            form.setData("name_en", e.target.value)
                        }
                    />
                    <Button type="submit">حفظ</Button>
                </form>
            </Modal>
            <Modal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                title="حذف"
            >
                <Button
                    variant="danger"
                    onClick={() =>
                        deleting &&
                        router.delete(`/dashboard/${type}/${deleting.id}`, {
                            onSuccess: () => setDeleting(null),
                        })
                    }
                >
                    حذف
                </Button>
            </Modal>
        </section>
    );
}
