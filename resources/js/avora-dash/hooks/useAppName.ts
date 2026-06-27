import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export function useAppName() {
    return usePage<PageProps>().props.appName;
}

