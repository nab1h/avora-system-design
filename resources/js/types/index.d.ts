export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar_url?: string | null;
    role?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    permissions?: string[];
}

export interface WebsiteSettings {
    website_name: string;
    logo_url?: string | null;
    favicon_96_url?: string | null;
    favicon_svg_url?: string | null;
    favicon_ico_url?: string | null;
    apple_touch_icon_url?: string | null;
    web_app_manifest_192_url?: string | null;
    web_app_manifest_512_url?: string | null;
    site_webmanifest_url?: string | null;
    contact_email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    currency?: string | null;
    default_language?: 'auto' | 'ar' | 'en';
    default_theme?: 'system' | 'light' | 'dark';
    facebook_url?: string | null;
    instagram_url?: string | null;
    x_url?: string | null;
    linkedin_url?: string | null;
    youtube_url?: string | null;
    tiktok_url?: string | null;
    telegram_url?: string | null;
    snapchat_url?: string | null;
    pinterest_url?: string | null;
    github_url?: string | null;
    discord_url?: string | null;
    threads_url?: string | null;
    smtp_host?: string | null;
    smtp_port?: number | null;
    smtp_username?: string | null;
    smtp_encryption?: string | null;
    smtp_from_address?: string | null;
    smtp_from_name?: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    appName: string;
    websiteSettings: WebsiteSettings;
    auth: {
        user: User;
    };
};
