import { useEffect, useId, useState } from 'react';
import { FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';

type GalleryImageInputProps = {
    label: string;
    value: File[];
    onChange: (files: File[]) => void;
    error?: string;
};

export function GalleryImageInput({ label, value, onChange, error }: GalleryImageInputProps) {
    const inputId = useId();
    const { translate } = useLanguage();
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        const urls = value.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [value]);

    return <div className="space-y-2">
        <label className="block text-sm font-semibold" htmlFor={inputId}>{label}</label>
        <div className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition ${error ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20' : 'avora-border hover:border-[var(--avora-primary)]'}`}>
            <input id={inputId} type="file" accept="image/*" multiple className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onClick={(event) => { event.currentTarget.value = ''; }} onChange={(event) => onChange(Array.from(event.target.files ?? []))} />
            {previews.length ? <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                {previews.map((preview, index) => <div key={preview} className="group/image relative aspect-square overflow-hidden rounded-xl"><img src={preview} alt="" className="h-full w-full object-cover" /><button type="button" onClick={(event) => { event.stopPropagation(); onChange(value.filter((_, itemIndex) => itemIndex !== index)); }} className="absolute end-1 top-1 z-20 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-slate-700 shadow opacity-0 transition group-hover/image:opacity-100" aria-label="Remove image"><FiX /></button></div>)}
                <span className="flex min-h-20 flex-col items-center justify-center rounded-xl bg-[var(--avora-primary)]/10 text-[var(--avora-primary)]"><FiUploadCloud className="h-5 w-5" /><span className="mt-1 text-xs font-semibold">{translate({ ar: 'إضافة', en: 'Add' })}</span></span>
            </div> : <div className="flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center"><span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--avora-primary)]/10 text-2xl text-[var(--avora-primary)]"><FiImage /></span><span className="font-semibold">{translate({ ar: 'اختر صور المعرض أو اسحبها هنا', en: 'Choose gallery images or drop them here' })}</span><span className="avora-muted mt-1 text-xs">{translate({ ar: 'يمكنك اختيار أكثر من صورة', en: 'You can select multiple images' })}</span></div>}
        </div>
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>;
}
