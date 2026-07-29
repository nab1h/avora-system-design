import { useLanguage } from '@/avora-dash/providers/LanguageProvider';

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Button } from '../Button';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    className?: string;
    ariaLabel?: string;
}

type PageItem = number | 'ellipsis';

function getPageItems(currentPage: number, totalPages: number, siblingCount: number): PageItem[] {
    const visiblePages = siblingCount * 2 + 5;

    if (totalPages <= visiblePages) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(2, currentPage - siblingCount);
    const end = Math.min(totalPages - 1, currentPage + siblingCount);
    const items: PageItem[] = [1];

    if (start > 2) items.push('ellipsis');
    for (let page = start; page <= end; page += 1) items.push(page);
    if (end < totalPages - 1) items.push('ellipsis');
    items.push(totalPages);

    return items;
}

// Generic page navigation built from the Avora Button component.
export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = '',
    ariaLabel,
}: PaginationProps) {
    const { direction, translate } = useLanguage();
    const safeTotalPages = Math.max(1, totalPages);
    const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
    const pages = getPageItems(safeCurrentPage, safeTotalPages, siblingCount);
    const previousLabel = translate({ ar: 'الصفحة السابقة', en: 'Previous page' });
    const nextLabel = translate({ ar: 'الصفحة التالية', en: 'Next page' });
    const controlClass = '!h-11 !min-w-11 !rounded-none !border-0 !px-3';

    if (totalPages <= 1) return null;

    return (
        <nav
            className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
            aria-label={
                ariaLabel ??
                translate({ ar: "ترقيم الصفحات", en: "Pagination" })
            }
            dir={direction}
        >
            <Button
                variant="ghost"
                size="default"
                type="button"
                className={`${controlClass} avora-surface`}
                disabled={safeCurrentPage === 1}
                onClick={() => onPageChange(safeCurrentPage - 1)}
                aria-label={previousLabel}
            >
                {direction === "rtl" ? <LuChevronRight /> : <LuChevronLeft />}
            </Button>

            {pages.map((item, index) =>
                item === "ellipsis" ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="avora-muted grid h-11 min-w-6 place-items-center"
                        aria-hidden="true"
                    >
                        …
                    </span>
                ) : (
                    <Button
                        key={item}
                        variant={item === safeCurrentPage ? 'primary' : 'ghost'}
                        size="default"
                        type="button"
                className={`${controlClass} ${item === safeCurrentPage ? '' : 'avora-surface'}`}
                        onClick={() => onPageChange(item)}
                        aria-current={
                            item === safeCurrentPage ? "page" : undefined
                        }
                        aria-label={translate({
                            ar: `الصفحة ${item}`,
                            en: `Page ${item}`,
                        })}
                    >
                        {item}
                    </Button>
                ),
            )}

            <Button
                variant="ghost"
                size="default"
                type="button"
                className={`${controlClass} avora-surface`}
                disabled={safeCurrentPage === safeTotalPages}
                onClick={() => onPageChange(safeCurrentPage + 1)}
                aria-label={nextLabel}
            >
                {direction === "rtl" ? <LuChevronLeft /> : <LuChevronRight />}
            </Button>
        </nav>
    );
}
