import { Button } from '@/avora-dash/components/Button';
import { FormField } from '@/avora-dash/components/forms/FormField';
import { Modal } from '@/avora-dash/components/Modal';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { StoreLayout } from '@/Layouts/StoreLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState, type FormEvent, type ReactNode } from 'react';

export default function Review() {
    const { translate, direction } = useLanguage();
    const props = usePage().props as any;
    const address = props.shippingAddress;
    const products = props.cartProducts ?? [];
    const currency = props.websiteSettings?.currency ?? 'EGP';
    const [editing, setEditing] = useState(false);

    const form = useForm({
        full_name: address.full_name ?? '',
        phone: address.phone ?? '',
        country: address.country ?? 'EG',
        city: address.city ?? '',
        area: address.area ?? '',
        street: address.street ?? '',
        building: address.building ?? '',
        floor: address.floor ?? '',
        apartment: address.apartment ?? '',
        postal_code: address.postal_code ?? '',
        notes: address.notes ?? '',
    });

    const saveAddress = (event: FormEvent) => {
        event.preventDefault();

        form.put(route('customer.shipping-address.upsert'), {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    return (
        <>
            <Head title={translate({ ar: 'مراجعة الطلب', en: 'Review order' })} />

            <main className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950" dir={direction}>
                <div className="mx-auto grid max-w-5xl gap-6 px-5 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                        <h1 className="text-2xl font-black">
                            {translate({ ar: 'راجع طلبك', en: 'Review your order' })}
                        </h1>

                        <div className="mt-6 space-y-4">
                            {products.map((product: any) => (
                                <div key={product.id} className="flex justify-between border-b pb-4">
                                    <div>
                                        <p className="font-bold">
                                            {direction === 'rtl' ? product.name_ar : product.name_en}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {translate({ ar: 'الكمية', en: 'Qty' })}: {product.pivot.quantity}
                                        </p>
                                    </div>
                                    <strong>
                                        {(Number(product.price) * Number(product.pivot.quantity)).toFixed(2)} {currency}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold">
                                {translate({ ar: 'بيانات الشحن', en: 'Shipping details' })}
                            </h2>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                                {translate({ ar: 'تعديل', en: 'Edit' })}
                            </Button>
                        </div>

                        <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            <p>{address.full_name}</p>
                            <p>{address.phone}</p>
                            <p>{address.city}{address.area ? `، ${address.area}` : ''}</p>
                            <p>{address.street}{address.building ? `، ${address.building}` : ''}</p>
                        </div>

                        <div className="mt-6 flex justify-between border-t pt-4 text-lg font-black">
                            <span>{translate({ ar: 'الإجمالي', en: 'Total' })}</span>
                            <span>{Number(props.total).toFixed(2)} {currency}</span>
                        </div>
                        <Button fullWidth className="mt-5" onClick={() => router.post(route('checkout.store'))}>
                            {translate({ ar: 'تأكيد والدفع', en: 'Confirm & pay' })}
                        </Button>
                    </aside>
                </div>
            </main>

            <Modal
                open={editing}
                onClose={() => setEditing(false)}
                title={translate({ ar: 'تعديل بيانات الشحن', en: 'Edit shipping details' })}
                size="lg"
            >
                <form onSubmit={saveAddress} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField required label={translate({ ar: 'الاسم بالكامل', en: 'Full name' })} value={form.data.full_name} onChange={(event) => form.setData('full_name', event.target.value)} />
                        <FormField required label={translate({ ar: 'الهاتف', en: 'Phone' })} value={form.data.phone} onChange={(event) => form.setData('phone', event.target.value)} />
                        <FormField required label={translate({ ar: 'المدينة', en: 'City' })} value={form.data.city} onChange={(event) => form.setData('city', event.target.value)} />
                        <FormField label={translate({ ar: 'المنطقة', en: 'Area' })} value={form.data.area} onChange={(event) => form.setData('area', event.target.value)} />
                        <FormField required label={translate({ ar: 'الشارع', en: 'Street' })} value={form.data.street} onChange={(event) => form.setData('street', event.target.value)} />
                        <FormField label={translate({ ar: 'المبنى', en: 'Building' })} value={form.data.building} onChange={(event) => form.setData('building', event.target.value)} />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                            {translate({ ar: 'إلغاء', en: 'Cancel' })}
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {translate({ ar: 'حفظ', en: 'Save' })}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}

Review.layout = (page: ReactNode) => <StoreLayout>{page}</StoreLayout>;
