import {
    Dialog,
    DialogBackdrop,
    DialogDescription,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';
import type { ReactNode } from 'react';
import { Button } from '../Button';

export type ModalBackdrop = 'blur' | 'solid' | 'none';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    backdrop?: ModalBackdrop;
    size?: ModalSize;
    showCloseButton?: boolean;
    closeLabel?: string;
    className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
};

const backdropClasses: Record<Exclude<ModalBackdrop, 'none'>, string> = {
    blur: 'bg-slate-950/40 backdrop-blur-sm',
    solid: 'bg-slate-950/55',
};

export function Modal({
    open,
    onClose,
    title,
    children,
    description,
    footer,
    backdrop = 'blur',
    size = 'md',
    showCloseButton = true,
    closeLabel = 'إغلاق النافذة',
    className = '',
}: ModalProps) {
    return (
        <Dialog open={open} onClose={onClose} className="relative z-[100]">
            {backdrop !== 'none' && (
                <DialogBackdrop
                    transition
                    className={`fixed inset-0 transition-opacity duration-200 data-[closed]:opacity-0 ${backdropClasses[backdrop]}`}
                />
            )}

            <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
                <div className="flex min-h-full items-center justify-center">
                    <DialogPanel
                        transition
                        className={`avora-surface avora-border relative w-full overflow-hidden rounded-2xl border text-start shadow-2xl shadow-slate-950/20 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 ${sizeClasses[size]} ${className}`}
                    >
                        <div className="border-b border-slate-200 px-5 py-4 pe-16 dark:border-slate-800 sm:px-6 sm:py-5 sm:pe-16">
                            <DialogTitle className="text-lg font-bold text-slate-950 dark:text-white">
                                {title}
                            </DialogTitle>
                            {description && (
                                <DialogDescription className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {description}
                                </DialogDescription>
                            )}
                        </div>

                        {showCloseButton && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                rounded="lg"
                                onClick={onClose}
                                aria-label={closeLabel}
                                className="absolute end-4 top-4"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    className="h-5 w-5"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </Button>
                        )}

                        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 text-slate-700 dark:text-slate-300 sm:px-6">
                            {children}
                        </div>

                        {footer && (
                            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
                                {footer}
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
