import { useEffect, useId, useState } from 'react';
import { FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';

type ImageInputProps = {
    label: string;
    value: File | null;
    onChange: (file: File | null) => void;
    currentImage?: string | null;
    error?: string;
    accept?: string;
    hint?: string;
    disabled?: boolean;
};

export function ImageInput({
    label,
    value,
    onChange,
    currentImage,
    error,
    accept = 'image/*',
    hint,
    disabled = false,
}: ImageInputProps) {
    const inputId = useId();
    const { translate } = useLanguage();
    const [preview, setPreview] = useState<string | null>(currentImage ?? null);

    useEffect(() => {
        if (!value) {
            setPreview(currentImage ?? null);
            return;
        }

        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [currentImage, value]);

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold" htmlFor={inputId}>
                {label}
            </label>

            <div
                className={`group relative overflow-hidden rounded-2xl border-2 border-dashed transition ${
                    error
                        ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                        : 'avora-border hover:border-[var(--avora-primary)]'
                }`}
            >
                <input
                    id={inputId}
                    type="file"
                    accept={accept}
                    disabled={disabled}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    onClick={(event) => {
                        event.currentTarget.value = '';
                    }}
                    onChange={(event) =>
                        onChange(event.target.files?.[0] ?? null)
                    }
                />

                {preview ? (
                    <div className="relative h-44">
                        <img
                            src={preview}
                            alt={label}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 opacity-0 transition group-hover:opacity-100">
                            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
                                <FiUploadCloud />
                                {translate({
                                    ar: value
                                        ? 'تغيير الصورة'
                                        : 'استبدال الصورة',
                                    en: value
                                        ? 'Change image'
                                        : 'Replace image',
                                })}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center">
                        <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--avora-primary)]/10 text-2xl text-[var(--avora-primary)]">
                            <FiImage />
                        </span>
                        <span className="font-semibold">
                            {translate({
                                ar: 'اختر صورة أو اسحبها هنا',
                                en: 'Choose or drop an image',
                            })}
                        </span>
                        <span className="avora-muted mt-1 text-xs">
                            {hint ??
                                translate({
                                    ar: 'PNG أو JPG أو WEBP — بحد أقصى 2 MB',
                                    en: 'PNG, JPG or WEBP — max 2 MB',
                                })}
                        </span>
                    </div>
                )}

                {value && (
                    <button
                        type="button"
                        aria-label={translate({
                            ar: 'إلغاء الصورة المختارة',
                            en: 'Remove selected image',
                        })}
                        className="absolute end-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-rose-50 hover:text-rose-600"
                        onClick={(event) => {
                            event.stopPropagation();
                            onChange(null);
                        }}
                    >
                        <FiX />
                    </button>
                )}
            </div>

            {value && (
                <p className="avora-muted truncate text-xs">{value.name}</p>
            )}
            {error && (
                <p className="text-xs font-medium text-rose-600">{error}</p>
            )}
        </div>
    );
}
