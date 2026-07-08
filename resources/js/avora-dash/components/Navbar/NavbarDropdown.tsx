import {
    useEffect,
    useId,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useNavbar } from './Navbar';

export type NavbarDropdownAlign = 'start' | 'center' | 'end';
export type NavbarDropdownMotion = 'fade' | 'scale' | 'slide' | 'flip';
export type NavbarDropdownWidth = 'sm' | 'md' | 'lg' | 'full' | 'auto';
export type NavbarDropdownDuration = 'fast' | 'normal' | 'slow';

export interface NavbarDropdownProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    label?: ReactNode;
    trigger?: ReactNode;
    align?: NavbarDropdownAlign;
    motion?: NavbarDropdownMotion;
    width?: NavbarDropdownWidth;
    duration?: NavbarDropdownDuration;
    openOnHover?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnSelect?: boolean;
    triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
    menuClassName?: string;
}

const widthClasses: Record<NavbarDropdownWidth, string> = {
    sm: 'w-44',
    md: 'w-56',
    lg: 'w-72',
    full: 'w-full',
    auto: 'w-max min-w-44',
};

const durationClasses: Record<NavbarDropdownDuration, string> = {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-500',
};

const alignClasses: Record<NavbarDropdownAlign, string> = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
};

const closedMotionClasses: Record<NavbarDropdownMotion, string> = {
    fade: '',
    scale: 'scale-95',
    slide: '-translate-y-2',
    flip: 'scale-y-75',
};

// Flexible dropdown for navbar links, actions, or custom content.
export function NavbarDropdown({
    label,
    trigger,
    align = 'start',
    motion = 'scale',
    width = 'md',
    duration = 'normal',
    openOnHover = false,
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
    closeOnSelect = true,
    triggerProps,
    menuClassName = '',
    className = '',
    style,
    children,
    ...props
}: NavbarDropdownProps) {
    const { foregroundColor, activeColor } = useNavbar();
    const { colors } = useTheme();
    const { direction } = useLanguage();
    const dropdownId = useId();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;
    const {
        className: triggerClassName = '',
        style: triggerStyle,
        onClick: triggerOnClick,
        ...buttonProps
    } = triggerProps ?? {};

    const setOpen = (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    useEffect(() => {
        if (!open) return;

        const closeDropdown = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        window.addEventListener('mousedown', closeDropdown);
        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('mousedown', closeDropdown);
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, [open]);

    const resolvedAlign =
        direction === 'rtl'
            ? align === 'start'
                ? 'end'
                : align === 'end'
                  ? 'start'
                  : align
            : align;

    return (
        <div
            ref={dropdownRef}
            className={`relative inline-flex ${width === 'full' ? 'w-full' : ''} ${className}`}
            style={style}
            onMouseEnter={() => {
                if (openOnHover) setOpen(true);
            }}
            onMouseLeave={() => {
                if (openOnHover) setOpen(false);
            }}
            {...props}
        >
            <button
                type="button"
                aria-expanded={open}
                aria-controls={dropdownId}
                className={`inline-flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${
                    triggerClassName
                }`}
                style={{
                    color: open ? activeColor : foregroundColor,
                    backgroundColor: open ? `${activeColor}14` : 'transparent',
                    ...triggerStyle,
                }}
                onClick={(event) => {
                    triggerOnClick?.(event);
                    setOpen(!open);
                }}
                {...buttonProps}
            >
                <span className="min-w-0 truncate">{trigger ?? label}</span>
                <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rotate-45 border-b-2 border-e-2 transition-transform ${open ? 'translate-y-0.5 rotate-[225deg]' : '-translate-y-0.5'}`}
                />
            </button>

            <div
                id={dropdownId}
                role="menu"
                aria-hidden={!open}
                className={`absolute top-full z-[70] mt-2 origin-top rounded-lg border p-1.5 shadow-lg transition-[opacity,transform,visibility] ease-out ${widthClasses[width]} ${durationClasses[duration]} ${alignClasses[resolvedAlign]} ${
                    open
                        ? 'visible pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : `invisible pointer-events-none opacity-0 ${closedMotionClasses[motion]}`
                } ${menuClassName}`}
                style={{
                    backgroundColor: colors.background,
                    borderColor: `${colors.muted}2b`,
                    color: colors.text,
                }}
                onClickCapture={(event) => {
                    if (!closeOnSelect) return;

                    const target = event.target as HTMLElement;
                    if (target.closest('a,button')) {
                        setOpen(false);
                    }
                }}
            >
                {children}
            </div>
        </div>
    );
}

export type NavbarDropdownItemProps = HTMLAttributes<HTMLDivElement>;

export function NavbarDropdownItem({
    className = '',
    ...props
}: NavbarDropdownItemProps) {
    return (
        <div
            className={`rounded-lg px-3 py-2 text-sm transition hover:bg-black/5 dark:hover:bg-white/10 ${className}`}
            role="menuitem"
            {...props}
        />
    );
}
