import { FormField } from '@/avora-dash/components/forms/FormField';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useForm } from '@inertiajs/react';
import { useState, type FormEventHandler } from 'react';
import { Button } from '@/avora-dash/components/Button';

export default function DeleteUserForm() {
    const { translate } = useLanguage();
    const [open, setOpen] = useState(false);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });
    const close = () => { setOpen(false); clearErrors(); reset(); };
    const submit: FormEventHandler = (event) => { event.preventDefault(); destroy(route('profile.destroy'), { preserveScroll: true, onSuccess: close }); };
    return (
        <section><h2 className="text-lg font-bold text-rose-700 dark:text-rose-400">{translate({ ar: 'حذف الحساب', en: 'Delete account' })}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{translate({ ar: 'سيتم حذف الحساب وكل بياناته نهائيًا، ولا يمكن التراجع عن هذه الخطوة.', en: 'Your account and all of its data will be permanently deleted. This cannot be undone.' })}</p><Button type="button" variant="danger" rounded="lg" className="mt-5 h-auto px-5 py-3" onClick={() => setOpen(true)}>{translate({ ar: 'حذف الحساب', en: 'Delete account' })}</Button>{open && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-950"><h3 className="text-xl font-bold">{translate({ ar: 'هل أنت متأكد؟', en: 'Are you sure?' })}</h3><p className="my-4 text-sm leading-6 text-slate-500">{translate({ ar: 'أدخل كلمة المرور لتأكيد حذف الحساب نهائيًا.', en: 'Enter your password to permanently delete the account.' })}</p><FormField label={translate({ ar: 'كلمة المرور', en: 'Password' })} type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} error={errors.password} autoFocus /><div className="mt-6 flex justify-end gap-3"><Button type="button" variant="outline" rounded="lg" onClick={close}>{translate({ ar: 'إلغاء', en: 'Cancel' })}</Button><Button variant="danger" rounded="lg" disabled={processing}>{translate({ ar: 'حذف نهائي', en: 'Delete permanently' })}</Button></div></form></div>}</section>
    );
}
