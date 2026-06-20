import type { HTMLAttributes } from 'react';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useNavbar } from './Navbar';

export type NavbarMenuPlacement = 'top' | 'start' | 'end' | 'left' | 'right';
export type NavbarMenuMotion = 'slide' | 'fade' | 'scale';
export type NavbarMenuDuration = 'fast' | 'normal' | 'slow';

export interface NavbarMobileMenuProps
    extends HTMLAttributes<HTMLDivElement> {
    placement?: NavbarMenuPlacement;
    motion?: NavbarMenuMotion;
    duration?: NavbarMenuDuration;
}

const durationClasses: Record<NavbarMenuDuration, string> = {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
};

// Mobile menu. Change placement, motion, and duration for each project.
export function NavbarMobileMenu({
    placement = 'top',
    motion = 'slide',
    duration = 'normal',
    className = '',
    style,
    children,
    ...props
}: NavbarMobileMenuProps) {
    const { open, menuId } = useNavbar();
    const { colors } = useTheme();
    const { direction } = useLanguage();

    // Start and end follow the current Arabic or English direction.
    const physicalPlacement = (() => {
        if (placement === 'start') return direction === 'rtl' ? 'right' : 'left';
        if (placement === 'end') return direction === 'rtl' ? 'left' : 'right';
        return placement;
    })();

    const placementClasses = (() => {
        switch (physicalPlacement) {
            case 'left':
                return 'absolute inset-y-0 left-0 h-full w-[min(85vw,24rem)] max-w-full overflow-y-auto border-e shadow-xl';
            case 'right':
                return 'absolute inset-y-0 right-0 h-full w-[min(85vw,24rem)] max-w-full overflow-y-auto border-s shadow-xl';
            default:
                return 'absolute inset-x-0 top-0 max-h-full w-full overflow-y-auto border-t shadow-lg';
        }
    })();

    const closedMotionClass = (() => {
        if (motion === 'fade') return '';
        if (motion === 'scale') {
            if (physicalPlacement === 'left') return 'origin-top-left scale-95';
            if (physicalPlacement === 'right') return 'origin-top-right scale-95';
            return 'origin-top scale-95';
        }
        if (physicalPlacement === 'left') return '-translate-x-full';
        if (physicalPlacement === 'right') return 'translate-x-full';
        return '-translate-y-3';
    })();

    return (
        <div className="pointer-events-none absolute inset-x-0 top-full z-[60] h-[calc(100vh-4rem)] overflow-x-clip md:hidden">
            <div
                id={menuId}
                aria-hidden={!open}
                className={`z-[60] px-4 py-4 transition-[opacity,transform,visibility] ease-out ${durationClasses[duration]} ${placementClasses} ${
                    open
                        ? 'visible pointer-events-auto translate-x-0 translate-y-0 scale-100 opacity-100'
                        : `invisible pointer-events-none opacity-0 ${closedMotionClass}`
                } ${className}`}
                style={{
                    backgroundColor: colors.background,
                    borderColor: `${colors.muted}2b`,
                    color: colors.text,
                    ...style,
                }}
                {...props}
            >
                {children}
            </div>
        </div>
    );
}
