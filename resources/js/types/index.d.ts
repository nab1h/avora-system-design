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
    google_login_enabled?: boolean;
    google_login_ready?: boolean;
    google_client_id?: string | null;
    google_redirect_url?: string | null;
    google_secret_configured?: boolean;
    facebook_login_enabled?: boolean;
    facebook_login_ready?: boolean;
    facebook_client_id?: string | null;
    facebook_redirect_url?: string | null;
    facebook_secret_configured?: boolean;
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

export interface PaymentGateway {
    id: number;
    name: string;
    slug: 'stripe' | 'paymob' | 'paytabs' | 'tap' | 'moyasar';
    region?: string | null;
    website_url?: string | null;
    enabled: boolean;
    is_backup: boolean;
    test_mode: boolean;
    public_config: Record<string, string | boolean | null>;
    secret_fields: Record<string, boolean>;
}

export interface PaymentTransaction {
    uuid: string;
    product_name: string;
    amount: number;
    amount_decimal: string;
    currency: string;
    status: 'pending' | 'redirected' | 'paid_waiting_webhook' | 'cancelled' | 'failed' | string;
    gateway_slug?: PaymentGateway['slug'] | string | null;
    gateway_name?: string | null;
    gateway_reference?: string | null;
    checkout_url?: string | null;
    created_at?: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    appName: string;
    websiteSettings: WebsiteSettings;
    paymentGateways: PaymentGateway[];
    auth: {
        user: User;
    };
};
