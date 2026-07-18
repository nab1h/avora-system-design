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

export interface DashboardNotification {
    id: string;
    title?: string | null;
    body?: string | null;
    url?: string | null;
    event_type?: string | null;
    read_at?: string | null;
    created_at?: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    appName: string;
    websiteSettings: WebsiteSettings;
    paymentGateways: PaymentGateway[];
    dashboardNotifications: {
        unread_count: number;
        items: DashboardNotification[];
    };
    auth: {
        user: User;
    };
};


export type DashboardModuleIncludeProps = {
    section: string;
};

export type RoleOption = {
    id: number;
    name: string;
};

export type UserRow = {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    role_name: string | null;
    created_at: string | null;
};

export type PermissionRow = {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
};

export type PurchaseRow = {
    uuid: string;
    customer_name: string;
    customer_email: string | null;
    product_name: string;
    amount_decimal: string;
    currency: string;
    status: string;
    gateway_name: string | null;
    gateway_reference: string | null;
    created_at: string | null;
};

export type RoleRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    users_count: number;
    permission_ids: number[];
    permissions: PermissionRow[];
};

export type AdminPageProps = {
    users?: UserRow[];
    roles?: RoleOption[] | RoleRow[];
    permissions?: PermissionRow[];
    websiteSettings?: WebsiteSettings;
    paymentGateways?: PaymentGateway[];
    purchases?: PurchaseRow[];
};

export type UserForm = {
    name: string;
    email: string;
    password: string;
    role_id: string;
};

export type RoleForm = {
    name: string;
    slug: string;
    description: string;
    permission_ids: number[];
};

export type PermissionForm = {
    name_ar: string;
    name_en: string;
    slug: string;
};

export type SmtpTestForm = {
    email: string;
};

export type WebsiteSettingForm = {
    website_name: string;
    logo: File | null;
    favicon_96: File | null;
    favicon_svg: File | null;
    favicon_ico: File | null;
    apple_touch_icon: File | null;
    web_app_manifest_192: File | null;
    web_app_manifest_512: File | null;
    site_webmanifest: File | null;
    contact_email: string;
    phone: string;
    whatsapp: string;
    currency: string;
    default_language: "auto" | "ar" | "en";
    default_theme: "system" | "light" | "dark";
    google_login_enabled: boolean;
    google_client_id: string;
    google_client_secret: string;
    google_redirect_url: string;
    facebook_login_enabled: boolean;
    facebook_client_id: string;
    facebook_client_secret: string;
    facebook_redirect_url: string;
    facebook_url: string;
    instagram_url: string;
    x_url: string;
    linkedin_url: string;
    youtube_url: string;
    tiktok_url: string;
    telegram_url: string;
    snapchat_url: string;
    pinterest_url: string;
    github_url: string;
    discord_url: string;
    threads_url: string;
    smtp_host: string;
    smtp_port: string;
    smtp_username: string;
    smtp_password: string;
    smtp_encryption: string;
    smtp_from_address: string;
    smtp_from_name: string;
    _method: "put";
};

export interface Attribute {
    id: number;
    name: string;
    unit: string;
    name_en: string;
    unit_en: string;
    type: "text" | "number" | "select" | "boolean";
}
export interface AttributeForm {
    id: string
    name: string;
    unit: string;
    name_en: string;
    unit_en: string;
    type: "text" | "number" | "select" | "boolean";
}


export interface Category {
    id: number;
    name_ar: string;
    name_en: string;
    desc_ar: string;
    desc_en: string;
    slug_ar: string;
    slug_en: string;
    img: File | null;
    status: boolean;
}

export interface SubCategory {
    id: number;
    categories_id: number;
    name_ar: string;
    name_en: string;
    desc_ar: string;
    desc_en: string;
    slug_ar: string;
    slug_en: string;
    is_active: boolean;
    img: string | null;
}



