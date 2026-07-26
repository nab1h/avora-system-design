import {
    Dialog,
    DialogBackdrop,
    DialogDescription,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import type { ReactNode } from "react";
import { Button } from "../Button";

export type DrawerBackdrop = "blur" | "solid" | "none";
export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title: ReactNode;
    children: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    backdrop?: DrawerBackdrop;
    side?: DrawerSide;
    size?: DrawerSize;
    showCloseButton?: boolean;
    closeLabel?: string;
    className?: string;
    bodyClassName?: string;
}

const backdropClasses: Record<Exclude<DrawerBackdrop, "none">, string> = {
    blur: "bg-slate-950/40 backdrop-blur-sm",
    solid: "bg-slate-950/55",
};

const horizontalSizeClasses: Record<DrawerSize, string> = {
    sm: "w-80 max-w-[85vw]",
    md: "w-96 max-w-[90vw]",
    lg: "w-[32rem] max-w-[95vw]",
    xl: "w-[42rem] max-w-[95vw]",
    full: "w-screen",
};

const verticalSizeClasses: Record<DrawerSize, string> = {
    sm: "h-64 max-h-[70vh]",
    md: "h-80 max-h-[75vh]",
    lg: "h-[28rem] max-h-[85vh]",
    xl: "h-[36rem] max-h-[90vh]",
    full: "h-screen",
};

const sideClasses: Record<DrawerSide, string> = {
    left: ["inset-y-0 left-0 h-full", "data-[closed]:-translate-x-full"].join(
        " ",
    ),
    right: ["inset-y-0 right-0 h-full", "data-[closed]:translate-x-full"].join(
        " ",
    ),
    top: ["inset-x-0 top-0 w-full", "data-[closed]:-translate-y-full"].join(
        " ",
    ),
    bottom: [
        "inset-x-0 bottom-0 w-full",
        "data-[closed]:translate-y-full",
    ].join(" "),
};

const roundedClasses: Record<DrawerSide, string> = {
    left: "rounded-e-2xl",
    right: "rounded-s-2xl",
    top: "rounded-b-2xl",
    bottom: "rounded-t-2xl",
};

const borderClasses: Record<DrawerSide, string> = {
    left: "border-e",
    right: "border-s",
    top: "border-b",
    bottom: "border-t",
};

export function Drawer({
    open,
    onClose,
    title,
    children,
    description,
    footer,
    backdrop = "blur",
    side = "right",
    size = "md",
    showCloseButton = true,
    closeLabel = "إغلاق القائمة الجانبية",
    className = "",
    bodyClassName = "",
}: DrawerProps) {
    const isHorizontal = side === "left" || side === "right";

    const sizeClass = isHorizontal
        ? horizontalSizeClasses[size]
        : verticalSizeClasses[size];

    const roundedClass =
        size === "full" ? "rounded-none" : roundedClasses[side];

    return (
        <Dialog open={open} onClose={onClose} className="relative z-[100]">
            {backdrop !== "none" && (
                <DialogBackdrop
                    transition
                    className={`fixed inset-0 transition-opacity duration-300 data-[closed]:opacity-0 ${backdropClasses[backdrop]}`}
                />
            )}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <DialogPanel
                    transition
                    className={[
                        "avora-surface avora-border",
                        "pointer-events-auto absolute",
                        "flex flex-col overflow-hidden",
                        "text-start shadow-2xl shadow-slate-950/20",
                        "transition-transform duration-300 ease-out",
                        sideClasses[side],
                        sizeClass,
                        roundedClass,
                        borderClasses[side],
                        className,
                    ].join(" ")}
                >
                    <div className="shrink-0 border-b border-slate-200 px-5 py-4 pe-16 dark:border-slate-800 sm:px-6 sm:py-5 sm:pe-16">
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
                            rounded="no"
                            onClick={onClose}
                            aria-label={closeLabel}
                            className="absolute end-4 top-4 z-10"
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

                    <div
                        className={[
                            "min-h-0 flex-1 overflow-y-auto",
                            "px-5 py-5 text-slate-700",
                            "dark:text-slate-300 sm:px-6",
                            bodyClassName,
                        ].join(" ")}
                    >
                        {children}
                    </div>

                    {footer && (
                        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
                            {footer}
                        </div>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
}
