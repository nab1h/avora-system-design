import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export function useWebsiteSettings() {
    return usePage<PageProps>().props.websiteSettings;
}
