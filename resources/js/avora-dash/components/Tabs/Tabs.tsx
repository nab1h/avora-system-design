import {
    Tab as HeadlessTab,
    TabGroup,
    TabList as HeadlessTabList,
    TabPanel as HeadlessTabPanel,
    TabPanels as HeadlessTabPanels,
} from '@headlessui/react';
import {
    createContext,
    useContext,
    type ButtonHTMLAttributes,
    type HTMLAttributes,
    type ReactNode,
} from 'react';

export type TabsVariant = 'line' | 'pills' | 'enclosed';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

type TabsContextValue = {
    variant: TabsVariant;
    size: TabsSize;
    orientation: TabsOrientation;
    fullWidth: boolean;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error(`${component} must be used inside <Tabs>.`);
    }

    return context;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    children: ReactNode;
    variant?: TabsVariant;
    size?: TabsSize;
    orientation?: TabsOrientation;
    fullWidth?: boolean;
    defaultIndex?: number;
    selectedIndex?: number;
    onChange?: (index: number) => void;
    manual?: boolean;
}

export function Tabs({
    children,
    variant = 'line',
    size = 'md',
    orientation = 'horizontal',
    fullWidth = false,
    defaultIndex,
    selectedIndex,
    onChange,
    manual,
    className = '',
    ...props
}: TabsProps) {
    return (
        <TabsContext.Provider
            value={{ variant, size, orientation, fullWidth }}
        >
            <TabGroup
                defaultIndex={defaultIndex}
                selectedIndex={selectedIndex}
                onChange={onChange}
                manual={manual}
                vertical={orientation === 'vertical'}
                className={`${orientation === 'vertical' ? 'flex items-start gap-5' : ''} ${className}`}
                {...props}
            >
                {children}
            </TabGroup>
        </TabsContext.Provider>
    );
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
    label?: string;
}

const listVariantClasses: Record<TabsVariant, string> = {
    line: 'border-b avora-border gap-1',
    pills: 'avora-surface-muted gap-1 rounded-xl p-1',
    enclosed: 'border avora-border avora-surface-muted gap-1 rounded-xl p-1',
};

export function TabsList({
    label,
    className = '',
    children,
    ...props
}: TabsListProps) {
    const { variant, orientation, fullWidth } = useTabsContext('TabsList');

    return (
        <HeadlessTabList
            aria-label={label}
            className={[
                'flex',
                orientation === 'vertical'
                    ? 'w-max min-w-40 flex-col'
                    : 'w-full items-center overflow-x-auto',
                fullWidth && orientation === 'horizontal' ? '[&>*]:flex-1' : '',
                listVariantClasses[variant],
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </HeadlessTabList>
    );
}

export interface TabsTriggerProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    className?: string;
}

const triggerSizeClasses: Record<TabsSize, string> = {
    sm: 'min-h-8 px-3 text-xs',
    md: 'min-h-10 px-4 text-sm',
    lg: 'min-h-12 px-5 text-base',
};

const triggerVariantClasses: Record<TabsVariant, string> = {
    line: '-mb-px border-b-2 border-transparent data-[selected]:border-[var(--avora-primary)] data-[selected]:text-[var(--avora-primary)]',
    pills:
        'rounded-lg data-[selected]:bg-[var(--avora-surface)] data-[selected]:text-[var(--avora-primary)] data-[selected]:shadow-sm',
    enclosed:
        'rounded-lg border border-transparent data-[selected]:border-[var(--avora-border)] data-[selected]:bg-[var(--avora-surface)] data-[selected]:text-[var(--avora-primary)] data-[selected]:shadow-sm',
};

export function TabsTrigger({
    className = '',
    children,
    type = 'button',
    ...props
}: TabsTriggerProps) {
    const { variant, size } = useTabsContext('TabsTrigger');

    return (
        <HeadlessTab
            type={type}
            className={[
                'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold',
                'text-slate-500 transition-colors duration-200 hover:text-slate-900',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--avora-primary)] focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-45 dark:text-slate-400 dark:hover:text-white',
                triggerSizeClasses[size],
                triggerVariantClasses[variant],
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </HeadlessTab>
    );
}

export type TabsPanelsProps = HTMLAttributes<HTMLDivElement>;

export function TabsPanels({
    className = '',
    children,
    ...props
}: TabsPanelsProps) {
    useTabsContext('TabsPanels');

    return (
        <HeadlessTabPanels className={`min-w-0 flex-1 ${className}`} {...props}>
            {children}
        </HeadlessTabPanels>
    );
}

export type TabsPanelProps = HTMLAttributes<HTMLDivElement>;

export function TabsPanel({
    className = '',
    children,
    ...props
}: TabsPanelProps) {
    useTabsContext('TabsPanel');

    return (
        <HeadlessTabPanel
            className={`pt-5 text-slate-700 focus:outline-none dark:text-slate-300 ${className}`}
            {...props}
        >
            {children}
        </HeadlessTabPanel>
    );
}
