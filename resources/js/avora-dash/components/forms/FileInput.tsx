import { useId, type ChangeEvent } from "react";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";

type FileInputProps = {
    label: string;
    value: File | null;
    onChange: (file: File | null) => void;
    accept?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
};

export function FileInput({
    label,
    value,
    onChange,
    accept,
    error,
    hint,
    disabled = false,
}: FileInputProps) {
    const inputId = useId();
    const selectFile = (event: ChangeEvent<HTMLInputElement>) =>
        onChange(event.target.files?.[0] ?? null);

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-semibold">
                {label}
            </label>
            <div className={`relative rounded-2xl border-2 border-dashed p-4 transition ${error ? "border-rose-400 bg-rose-50/50 dark:bg-rose-950/20" : "avora-border hover:border-[var(--avora-primary)]"}`}>
                <input id={inputId} type="file" accept={accept} disabled={disabled} onChange={selectFile} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />
                {value ? <div className="flex items-center gap-3"><FiFileText className="h-6 w-6 text-[var(--avora-primary)]" /><span className="min-w-0 flex-1 truncate text-sm font-semibold">{value.name}</span><button type="button" className="relative z-20 grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => onChange(null)} aria-label="Remove file"><FiX /></button></div> : <div className="flex items-center gap-3 text-slate-500"><FiUploadCloud className="h-6 w-6" /><span className="text-sm">{hint ?? "Choose or drop a file here"}</span></div>}
            </div>
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        </div>
    );
}
