import { Button } from "@/avora-dash/components/Button";
import { DashboardIcon } from "@/avora-dash/components/DashboardIcon";
import { RecentOrders } from "@/avora-dash/components/dashboard/RecentOrders";
import { SalesOverview } from "@/avora-dash/components/dashboard/SalesOverview";
import { FormField } from "@/avora-dash/components/forms/FormField";
import { Modal } from "@/avora-dash/components/Modal";
import { useAppName } from "@/avora-dash/hooks/useAppName";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { PaymentGatewaysInclude } from "@/includes/PaymentGatewaysInclude";
import { DashboardLayout } from "@/Layouts/DashboardLayout";
import type { PageProps, PaymentGateway, WebsiteSettings } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { useState, type FormEventHandler } from "react";

type DashboardModuleIncludeProps = {
    section: string;
};

type RoleOption = {
    id: number;
    name: string;
};

type UserRow = {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    role_name: string | null;
    created_at: string | null;
};

type PermissionRow = {
    id: number;
    name_ar: string;
    name_en: string;
    slug: string;
};

type PurchaseRow = {
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

type RoleRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    users_count: number;
    permission_ids: number[];
    permissions: PermissionRow[];
};

type AdminPageProps = {
    users?: UserRow[];
    roles?: RoleOption[] | RoleRow[];
    permissions?: PermissionRow[];
    websiteSettings?: WebsiteSettings;
    paymentGateways?: PaymentGateway[];
    purchases?: PurchaseRow[];
};

type UserForm = {
    name: string;
    email: string;
    password: string;
    role_id: string;
};

type RoleForm = {
    name: string;
    slug: string;
    description: string;
    permission_ids: number[];
};

type PermissionForm = {
    name_ar: string;
    name_en: string;
    slug: string;
};

type SmtpTestForm = {
    email: string;
};

type WebsiteSettingForm = {
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

const sectionTitles = {
    orders: { ar: "إدارة الطلبات", en: "Order management" },
    products: { ar: "إدارة المنتجات", en: "Product management" },
    customers: { ar: "العملاء", en: "Customers" },
    users: { ar: "إدارة المستخدمين", en: "User management" },
    permissions: { ar: "إدارة الصلاحيات", en: "Permission management" },
    reports: { ar: "التقارير والتحليلات", en: "Reports & analytics" },
    calendar: { ar: "التقويم", en: "Calendar" },
    forms: { ar: "عناصر النماذج", en: "Form elements" },
    tables: { ar: "الجداول", en: "Tables" },
    "ui-elements": { ar: "عناصر الواجهة", en: "UI elements" },
    settings: { ar: "إعدادات النظام", en: "System settings" },
    payments: { ar: "المدفوعات", en: "Payments" },
    purchases: { ar: "المشتريات", en: "Purchases" },
} as const;

const customers = [
    {
        name: "أحمد محمود",
        email: "ahmed@example.com",
        orders: 18,
        spent: "12,480 ج.م",
    },
    {
        name: "سارة محمد",
        email: "sara@example.com",
        orders: 12,
        spent: "8,920 ج.م",
    },
    {
        name: "محمود علي",
        email: "mahmoud@example.com",
        orders: 9,
        spent: "6,410 ج.م",
    },
    {
        name: "نور خالد",
        email: "nour@example.com",
        orders: 7,
        spent: "4,850 ج.م",
    },
];

const products = [
    {
        name: { ar: "الباقة الأساسية", en: "Starter plan" },
        price: "920 ج.م",
        sales: 142,
        color: "avora-brand-gradient",
    },
    {
        name: { ar: "الباقة المتقدمة", en: "Advanced plan" },
        price: "1,890 ج.م",
        sales: 96,
        color: "avora-secondary-gradient",
    },
    {
        name: { ar: "باقة الأعمال", en: "Business plan" },
        price: "2,450 ج.م",
        sales: 74,
        color: "avora-success-gradient",
    },
];

export function DashboardModuleInclude({
    section,
}: DashboardModuleIncludeProps) {
    const { language, translate } = useLanguage();
    const page = usePage<PageProps<AdminPageProps>>();
    const users = page.props.users ?? [];
    const roleOptions = ((page.props.roles ?? []) as RoleOption[]).filter(
        (role) => "id" in role && "name" in role,
    );
    const permissionRoles = (page.props.roles ?? []) as RoleRow[];
    const permissions = page.props.permissions ?? [];
    const websiteSettings =
        page.props.websiteSettings ?? page.props.websiteSettings;
    const paymentGateways = page.props.paymentGateways ?? [];
    const purchases = page.props.purchases ?? [];
    const title =
        sectionTitles[section as keyof typeof sectionTitles] ??
        sectionTitles.orders;
    const appName = useAppName();

    const [userModalOpen, setUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRow | null>(null);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
    const [permissionModalOpen, setPermissionModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] =
        useState<PermissionRow | null>(null);

    const userForm = useForm<UserForm>({
        name: "",
        email: "",
        password: "",
        role_id: "",
    });

    const roleForm = useForm<RoleForm>({
        name: "",
        slug: "",
        description: "",
        permission_ids: [],
    });

    const permissionForm = useForm<PermissionForm>({
        name_ar: "",
        name_en: "",
        slug: "",
    });

    const smtpTestForm = useForm<SmtpTestForm>({
        email:
            websiteSettings?.smtp_from_address ??
            websiteSettings?.contact_email ??
            "",
    });

    const websiteSettingForm = useForm<WebsiteSettingForm>({
        website_name: websiteSettings?.website_name ?? appName,
        logo: null,
        favicon_96: null,
        favicon_svg: null,
        favicon_ico: null,
        apple_touch_icon: null,
        web_app_manifest_192: null,
        web_app_manifest_512: null,
        site_webmanifest: null,
        contact_email: websiteSettings?.contact_email ?? "",
        phone: websiteSettings?.phone ?? "",
        whatsapp: websiteSettings?.whatsapp ?? "",
        currency: websiteSettings?.currency ?? "EGP",
        default_language: websiteSettings?.default_language ?? "auto",
        default_theme: websiteSettings?.default_theme ?? "system",
        google_login_enabled: websiteSettings?.google_login_enabled ?? false,
        google_client_id: websiteSettings?.google_client_id ?? "",
        google_client_secret: "",
        google_redirect_url:
            websiteSettings?.google_redirect_url ??
            `${window.location.origin}/auth/google/callback`,
        facebook_login_enabled:
            websiteSettings?.facebook_login_enabled ?? false,
        facebook_client_id: websiteSettings?.facebook_client_id ?? "",
        facebook_client_secret: "",
        facebook_redirect_url:
            websiteSettings?.facebook_redirect_url ??
            `${window.location.origin}/auth/facebook/callback`,
        facebook_url: websiteSettings?.facebook_url ?? "",
        instagram_url: websiteSettings?.instagram_url ?? "",
        x_url: websiteSettings?.x_url ?? "",
        linkedin_url: websiteSettings?.linkedin_url ?? "",
        youtube_url: websiteSettings?.youtube_url ?? "",
        tiktok_url: websiteSettings?.tiktok_url ?? "",
        telegram_url: websiteSettings?.telegram_url ?? "",
        snapchat_url: websiteSettings?.snapchat_url ?? "",
        pinterest_url: websiteSettings?.pinterest_url ?? "",
        github_url: websiteSettings?.github_url ?? "",
        discord_url: websiteSettings?.discord_url ?? "",
        threads_url: websiteSettings?.threads_url ?? "",
        smtp_host: websiteSettings?.smtp_host ?? "",
        smtp_port: websiteSettings?.smtp_port
            ? String(websiteSettings.smtp_port)
            : "",
        smtp_username: websiteSettings?.smtp_username ?? "",
        smtp_password: "",
        smtp_encryption: websiteSettings?.smtp_encryption ?? "",
        smtp_from_address: websiteSettings?.smtp_from_address ?? "",
        smtp_from_name: websiteSettings?.smtp_from_name ?? "",
        _method: "put",
    });

    const openCreateUser = () => {
        setEditingUser(null);
        userForm.reset();
        userForm.clearErrors();
        setUserModalOpen(true);
    };

    const openEditUser = (user: UserRow) => {
        setEditingUser(user);
        userForm.setData({
            name: user.name,
            email: user.email,
            password: "",
            role_id: user.role_id ? String(user.role_id) : "",
        });
        userForm.clearErrors();
        setUserModalOpen(true);
    };

    const submitUser: FormEventHandler = (event) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setUserModalOpen(false);
                setEditingUser(null);
                userForm.reset();
            },
        };

        if (editingUser) {
            userForm.put(
                route("dashboard.users.update", editingUser.id),
                options,
            );
            return;
        }

        userForm.post(route("dashboard.users.store"), options);
    };

    const openCreateRole = () => {
        setEditingRole(null);
        roleForm.reset();
        roleForm.clearErrors();
        setRoleModalOpen(true);
    };

    const openEditRole = (role: RoleRow) => {
        setEditingRole(role);
        roleForm.setData({
            name: role.name,
            slug: role.slug,
            description: role.description ?? "",
            permission_ids: role.permission_ids,
        });
        roleForm.clearErrors();
        setRoleModalOpen(true);
    };

    const submitRole: FormEventHandler = (event) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setRoleModalOpen(false);
                setEditingRole(null);
                roleForm.reset();
            },
        };

        if (editingRole) {
            roleForm.put(
                route("dashboard.roles.update", editingRole.id),
                options,
            );
            return;
        }

        roleForm.post(route("dashboard.roles.store"), options);
    };

    const togglePermission = (permissionId: number) => {
        roleForm.setData(
            "permission_ids",
            roleForm.data.permission_ids.includes(permissionId)
                ? roleForm.data.permission_ids.filter(
                      (id) => id !== permissionId,
                  )
                : [...roleForm.data.permission_ids, permissionId],
        );
    };

    const openCreatePermission = () => {
        setEditingPermission(null);
        permissionForm.reset();
        permissionForm.clearErrors();
        setPermissionModalOpen(true);
    };

    const openEditPermission = (permission: PermissionRow) => {
        setEditingPermission(permission);
        permissionForm.setData({
            name_ar: permission.name_ar,
            name_en: permission.name_en,
            slug: permission.slug,
        });
        permissionForm.clearErrors();
        setPermissionModalOpen(true);
    };

    const submitPermission: FormEventHandler = (event) => {
        event.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setPermissionModalOpen(false);
                setEditingPermission(null);
                permissionForm.reset();
            },
        };

        if (editingPermission) {
            permissionForm.put(
                route("dashboard.permissions.update", editingPermission.id),
                options,
            );
            return;
        }

        permissionForm.post(route("dashboard.permissions.store"), options);
    };

    const openCreateAction = () => {
        if (section === "users") openCreateUser();
        if (section === "permissions") openCreateRole();
    };

    const header = (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--avora-primary)" }}
                >
                    {appName} Admin
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                    {translate(title)}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {translate({
                        ar: "كل الأدوات والبيانات التي تحتاجها في مكان واحد.",
                        en: "All the tools and data you need in one place.",
                    })}
                </p>
            </div>
            {["users", "permissions"].includes(section) ? (
                <Button type="button" rounded="no" onClick={openCreateAction}>
                    +{" "}
                    {section === "users"
                        ? translate({ ar: "إضافة مستخدم", en: "Add user" })
                        : translate({ ar: "إضافة دور", en: "Add role" })}
                </Button>
            ) : (
                !["calendar", "reports", "ui-elements", "settings"].includes(
                    section,
                ) && (
                    <Button rounded="no">
                        + {translate({ ar: "إضافة جديد", en: "Add new" })}
                    </Button>
                )
            )}
        </header>
    );

    const renderUsers = () => (
        <>
            <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                <div className="border-b border-slate-100 p-5 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                        {translate({ ar: "المستخدمون", en: "Users" })}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {translate({
                            ar: "إضافة وتعديل وحذف مستخدمين حقيقيين من قاعدة البيانات.",
                            en: "Create, edit, and delete real users from the database.",
                        })}
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead className="avora-surface-muted avora-muted">
                            <tr>
                                <th className="px-6 py-4 text-start">
                                    {translate({ ar: "المستخدم", en: "User" })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({
                                        ar: "البريد الإلكتروني",
                                        en: "Email",
                                    })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({ ar: "الدور", en: "Role" })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({
                                        ar: "تاريخ الإضافة",
                                        en: "Created",
                                    })}
                                </th>
                                <th className="px-6 py-4 text-end">
                                    {translate({
                                        ar: "إجراءات",
                                        en: "Actions",
                                    })}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="avora-border border-b"
                                >
                                    <td className="px-6 py-4 font-semibold">
                                        {user.name}
                                    </td>
                                    <td className="avora-muted px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role_name ??
                                            translate({
                                                ar: "بدون دور",
                                                en: "No role",
                                            })}
                                    </td>
                                    <td className="avora-muted px-6 py-4">
                                        {user.created_at}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                rounded="no"
                                                onClick={() =>
                                                    openEditUser(user)
                                                }
                                            >
                                                {translate({
                                                    ar: "تعديل",
                                                    en: "Edit",
                                                })}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                rounded="no"
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            "dashboard.users.destroy",
                                                            user.id,
                                                        ),
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                {translate({
                                                    ar: "حذف",
                                                    en: "Delete",
                                                })}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-sm text-slate-500"
                                    >
                                        {translate({
                                            ar: "لا يوجد مستخدمون بعد.",
                                            en: "No users yet.",
                                        })}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={userModalOpen}
                onClose={() => setUserModalOpen(false)}
                title={
                    editingUser
                        ? translate({ ar: "تعديل مستخدم", en: "Edit user" })
                        : translate({ ar: "إضافة مستخدم", en: "Add user" })
                }
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            rounded="no"
                            onClick={() => setUserModalOpen(false)}
                        >
                            {translate({ ar: "إلغاء", en: "Cancel" })}
                        </Button>
                        <Button
                            type="submit"
                            form="user-crud-form"
                            rounded="no"
                            disabled={userForm.processing}
                        >
                            {translate({ ar: "حفظ", en: "Save" })}
                        </Button>
                    </div>
                }
            >
                <form
                    id="user-crud-form"
                    onSubmit={submitUser}
                    className="space-y-4"
                >
                    <FormField
                        label={translate({ ar: "الاسم", en: "Name" })}
                        value={userForm.data.name}
                        onChange={(event) =>
                            userForm.setData("name", event.target.value)
                        }
                        error={userForm.errors.name}
                        required
                    />
                    <FormField
                        label={translate({
                            ar: "البريد الإلكتروني",
                            en: "Email address",
                        })}
                        type="email"
                        value={userForm.data.email}
                        onChange={(event) =>
                            userForm.setData("email", event.target.value)
                        }
                        error={userForm.errors.email}
                        required
                    />
                    <FormField
                        label={
                            editingUser
                                ? translate({
                                      ar: "كلمة مرور جديدة اختياري",
                                      en: "New password optional",
                                  })
                                : translate({
                                      ar: "كلمة المرور",
                                      en: "Password",
                                  })
                        }
                        type="password"
                        value={userForm.data.password}
                        onChange={(event) =>
                            userForm.setData("password", event.target.value)
                        }
                        error={userForm.errors.password}
                        required={!editingUser}
                    />
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {translate({ ar: "الدور", en: "Role" })}
                        </span>
                        <select
                            className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                            value={userForm.data.role_id}
                            onChange={(event) =>
                                userForm.setData("role_id", event.target.value)
                            }
                        >
                            <option value="">
                                {translate({ ar: "بدون دور", en: "No role" })}
                            </option>
                            {roleOptions.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {userForm.errors.role_id && (
                            <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                {userForm.errors.role_id}
                            </span>
                        )}
                    </label>
                </form>
            </Modal>
        </>
    );

    const renderPermissions = () => (
        <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {permissionRoles.map((role) => (
                    <article
                        key={role.id}
                        className="avora-surface avora-border rounded-2xl border p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <span className="avora-bg-primary-soft avora-text-primary grid h-12 w-12 place-items-center rounded-2xl">
                                <DashboardIcon name="settings" />
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {role.permissions.length}{" "}
                                {translate({ ar: "صلاحية", en: "permissions" })}
                            </span>
                        </div>
                        <h2 className="mt-5 text-lg font-black text-slate-950 dark:text-white">
                            {role.name}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {role.description ??
                                translate({
                                    ar: "بدون وصف",
                                    en: "No description",
                                })}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {role.permissions.slice(0, 3).map((permission) => (
                                <span
                                    key={permission.id}
                                    className="avora-bg-primary-soft avora-text-primary rounded-full px-3 py-1 text-xs font-semibold"
                                >
                                    {translate({
                                        ar: permission.name_ar,
                                        en: permission.name_en,
                                    })}
                                </span>
                            ))}
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                rounded="no"
                                onClick={() => openEditRole(role)}
                            >
                                {translate({ ar: "تعديل", en: "Edit" })}
                            </Button>
                            <Button
                                type="button"
                                variant="danger"
                                rounded="no"
                                disabled={role.users_count > 0}
                                onClick={() =>
                                    router.delete(
                                        route(
                                            "dashboard.roles.destroy",
                                            role.id,
                                        ),
                                        { preserveScroll: true },
                                    )
                                }
                            >
                                {translate({ ar: "حذف", en: "Delete" })}
                            </Button>
                        </div>
                        {role.users_count > 0 && (
                            <p className="mt-2 text-xs text-slate-500">
                                {translate({
                                    ar: `مرتبط بـ ${role.users_count} مستخدم`,
                                    en: `Attached to ${role.users_count} users`,
                                })}
                            </p>
                        )}
                    </article>
                ))}
            </div>

            <section className="avora-surface avora-border mt-6 overflow-hidden rounded-2xl border">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                            {translate({ ar: "الصلاحيات", en: "Permissions" })}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {translate({
                                ar: "أضف وعدّل واحذف الصلاحيات التي يتم ربطها بالأدوار.",
                                en: "Create, edit, and delete permissions assigned to roles.",
                            })}
                        </p>
                    </div>
                    <Button
                        type="button"
                        rounded="no"
                        onClick={openCreatePermission}
                    >
                        +{" "}
                        {translate({
                            ar: "إضافة صلاحية",
                            en: "Add permission",
                        })}
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead className="avora-surface-muted avora-muted">
                            <tr>
                                <th className="px-6 py-4 text-start">
                                    {translate({
                                        ar: "الاسم العربي",
                                        en: "Arabic name",
                                    })}
                                </th>
                                <th className="px-6 py-4 text-start">
                                    {translate({
                                        ar: "الاسم الإنجليزي",
                                        en: "English name",
                                    })}
                                </th>
                                <th className="px-6 py-4 text-start">Slug</th>
                                <th className="px-6 py-4 text-end">
                                    {translate({
                                        ar: "إجراءات",
                                        en: "Actions",
                                    })}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((permission) => (
                                <tr
                                    key={permission.id}
                                    className="avora-border border-b"
                                >
                                    <td className="px-6 py-4 font-semibold">
                                        {permission.name_ar}
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        {permission.name_en}
                                    </td>
                                    <td className="avora-muted px-6 py-4">
                                        {permission.slug}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                rounded="no"
                                                onClick={() =>
                                                    openEditPermission(
                                                        permission,
                                                    )
                                                }
                                            >
                                                {translate({
                                                    ar: "تعديل",
                                                    en: "Edit",
                                                })}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="danger"
                                                rounded="no"
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            "dashboard.permissions.destroy",
                                                            permission.id,
                                                        ),
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    )
                                                }
                                            >
                                                {translate({
                                                    ar: "حذف",
                                                    en: "Delete",
                                                })}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <Modal
                open={roleModalOpen}
                onClose={() => setRoleModalOpen(false)}
                title={
                    editingRole
                        ? translate({ ar: "تعديل دور", en: "Edit role" })
                        : translate({ ar: "إضافة دور", en: "Add role" })
                }
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            rounded="no"
                            onClick={() => setRoleModalOpen(false)}
                        >
                            {translate({ ar: "إلغاء", en: "Cancel" })}
                        </Button>
                        <Button
                            type="submit"
                            form="role-crud-form"
                            rounded="no"
                            disabled={roleForm.processing}
                        >
                            {translate({ ar: "حفظ", en: "Save" })}
                        </Button>
                    </div>
                }
            >
                <form
                    id="role-crud-form"
                    onSubmit={submitRole}
                    className="space-y-4"
                >
                    <FormField
                        label={translate({ ar: "اسم الدور", en: "Role name" })}
                        value={roleForm.data.name}
                        onChange={(event) =>
                            roleForm.setData("name", event.target.value)
                        }
                        error={roleForm.errors.name}
                        required
                    />
                    {editingRole && (
                        <FormField
                            label="Slug"
                            value={roleForm.data.slug}
                            onChange={(event) =>
                                roleForm.setData("slug", event.target.value)
                            }
                            error={roleForm.errors.slug}
                            required
                        />
                    )}
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {translate({ ar: "الوصف", en: "Description" })}
                        </span>
                        <textarea
                            rows={3}
                            className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                            value={roleForm.data.description}
                            onChange={(event) =>
                                roleForm.setData(
                                    "description",
                                    event.target.value,
                                )
                            }
                        />
                        {roleForm.errors.description && (
                            <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                {roleForm.errors.description}
                            </span>
                        )}
                    </label>
                    <div>
                        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {translate({ ar: "الصلاحيات", en: "Permissions" })}
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {permissions.map((permission) => (
                                <label
                                    key={permission.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800"
                                >
                                    <input
                                        type="checkbox"
                                        checked={roleForm.data.permission_ids.includes(
                                            permission.id,
                                        )}
                                        onChange={() =>
                                            togglePermission(permission.id)
                                        }
                                        className="rounded border-slate-300"
                                    />
                                    <span>
                                        <span className="block font-semibold text-slate-800 dark:text-slate-100">
                                            {translate({
                                                ar: permission.name_ar,
                                                en: permission.name_en,
                                            })}
                                        </span>
                                        <span className="block text-xs text-slate-500">
                                            {permission.slug}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal
                open={permissionModalOpen}
                onClose={() => setPermissionModalOpen(false)}
                title={
                    editingPermission
                        ? translate({
                              ar: "تعديل صلاحية",
                              en: "Edit permission",
                          })
                        : translate({
                              ar: "إضافة صلاحية",
                              en: "Add permission",
                          })
                }
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            rounded="no"
                            onClick={() => setPermissionModalOpen(false)}
                        >
                            {translate({ ar: "إلغاء", en: "Cancel" })}
                        </Button>
                        <Button
                            type="submit"
                            form="permission-crud-form"
                            rounded="no"
                            disabled={permissionForm.processing}
                        >
                            {translate({ ar: "حفظ", en: "Save" })}
                        </Button>
                    </div>
                }
            >
                <form
                    id="permission-crud-form"
                    onSubmit={submitPermission}
                    className="space-y-4"
                >
                    <FormField
                        label={translate({
                            ar: "اسم الصلاحية بالعربي",
                            en: "Permission Arabic name",
                        })}
                        value={permissionForm.data.name_ar}
                        onChange={(event) =>
                            permissionForm.setData(
                                "name_ar",
                                event.target.value,
                            )
                        }
                        error={permissionForm.errors.name_ar}
                        required
                    />
                    <FormField
                        label={translate({
                            ar: "اسم الصلاحية بالإنجليزي",
                            en: "Permission English name",
                        })}
                        value={permissionForm.data.name_en}
                        onChange={(event) =>
                            permissionForm.setData(
                                "name_en",
                                event.target.value,
                            )
                        }
                        error={permissionForm.errors.name_en}
                        required
                    />
                    <FormField
                        label="Slug"
                        value={permissionForm.data.slug}
                        onChange={(event) =>
                            permissionForm.setData("slug", event.target.value)
                        }
                        error={permissionForm.errors.slug}
                        placeholder="users.manage"
                        required={!!editingPermission}
                    />
                </form>
            </Modal>
        </>
    );

    const submitWebsiteSettings: FormEventHandler = (event) => {
        event.preventDefault();

        websiteSettingForm.post(route("dashboard.settings.website.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                websiteSettingForm.setData({
                    ...websiteSettingForm.data,
                    logo: null,
                    favicon_96: null,
                    favicon_svg: null,
                    favicon_ico: null,
                    apple_touch_icon: null,
                    web_app_manifest_192: null,
                    web_app_manifest_512: null,
                    site_webmanifest: null,
                    google_client_secret: "",
                    facebook_client_secret: "",
                    smtp_password: "",
                });
            },
        });
    };

    const renderFileField = (
        name: keyof Pick<
            WebsiteSettingForm,
            | "logo"
            | "favicon_96"
            | "favicon_svg"
            | "favicon_ico"
            | "apple_touch_icon"
            | "web_app_manifest_192"
            | "web_app_manifest_512"
            | "site_webmanifest"
        >,
        label: string,
        currentUrl?: string | null,
        accept?: string,
    ) => (
        <label className="block rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">
                {label}
            </span>
            {currentUrl && (
                <a
                    href={currentUrl}
                    target="_blank"
                    className="avora-text-primary mt-1 block truncate text-xs font-semibold"
                    rel="noreferrer"
                >
                    {currentUrl}
                </a>
            )}
            <input
                type="file"
                accept={accept}
                className="mt-3 block w-full text-sm text-slate-500 file:me-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-200"
                onChange={(event) =>
                    websiteSettingForm.setData(
                        name,
                        event.target.files?.[0] ?? null,
                    )
                }
            />
            {websiteSettingForm.errors[name] && (
                <span className="mt-1.5 block text-xs font-medium text-rose-600">
                    {websiteSettingForm.errors[name]}
                </span>
            )}
        </label>
    );

    const renderWebsiteSettings = () => (
        <form onSubmit={submitWebsiteSettings} className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    {translate({ ar: "هوية الموقع", en: "Website identity" })}
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <FormField
                        label={translate({
                            ar: "اسم الموقع",
                            en: "Website name",
                        })}
                        value={websiteSettingForm.data.website_name}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "website_name",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.website_name}
                        required
                    />
                    <FormField
                        label={translate({ ar: "العملة", en: "Currency" })}
                        value={websiteSettingForm.data.currency}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "currency",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.currency}
                        placeholder="EGP"
                        required
                    />
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {translate({
                                ar: "اللغة الافتراضية",
                                en: "Default language",
                            })}
                        </span>
                        <select
                            className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                            value={websiteSettingForm.data.default_language}
                            onChange={(event) =>
                                websiteSettingForm.setData(
                                    "default_language",
                                    event.target.value as "auto" | "ar" | "en",
                                )
                            }
                        >
                            <option value="auto">
                                {translate({
                                    ar: "حسب لغة المتصفح",
                                    en: "Browser language",
                                })}
                            </option>
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                        </select>
                        {websiteSettingForm.errors.default_language && (
                            <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                {websiteSettingForm.errors.default_language}
                            </span>
                        )}
                    </label>
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {translate({
                                ar: "الثيم الافتراضي",
                                en: "Default theme",
                            })}
                        </span>
                        <select
                            className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                            value={websiteSettingForm.data.default_theme}
                            onChange={(event) =>
                                websiteSettingForm.setData(
                                    "default_theme",
                                    event.target.value as
                                        | "system"
                                        | "light"
                                        | "dark",
                                )
                            }
                        >
                            <option value="system">
                                {translate({
                                    ar: "حسب ثيم الجهاز",
                                    en: "System theme",
                                })}
                            </option>
                            <option value="light">
                                {translate({ ar: "فاتح", en: "Light" })}
                            </option>
                            <option value="dark">
                                {translate({ ar: "داكن", en: "Dark" })}
                            </option>
                        </select>
                        {websiteSettingForm.errors.default_theme && (
                            <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                {websiteSettingForm.errors.default_theme}
                            </span>
                        )}
                    </label>
                    {renderFileField(
                        "logo",
                        translate({ ar: "لوجو الموقع", en: "Website logo" }),
                        websiteSettings?.logo_url,
                        "image/*",
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-black text-slate-950 dark:text-white">
                                {translate({
                                    ar: "تسجيل الدخول الاجتماعي",
                                    en: "Social login",
                                })}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {translate({
                                    ar: "فعّل تسجيل الدخول بجوجل أو فيسبوك وعدّل بيانات OAuth من هنا.",
                                    en: "Enable Google or Facebook login and manage OAuth credentials here.",
                                })}
                            </p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                            {translate({
                                ar: "الأسرار محفوظة مشفرة",
                                en: "Secrets are encrypted",
                            })}
                        </span>
                    </div>

                    <div className="mt-5 grid gap-5 xl:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                            <label className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                                <span>
                                    <span className="block text-sm font-black text-slate-900 dark:text-white">
                                        Google
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {translate({
                                            ar: "إظهار زر الدخول بجوجل في صفحة تسجيل الدخول",
                                            en: "Show Google login button on the login page",
                                        })}
                                    </span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={
                                        websiteSettingForm.data
                                            .google_login_enabled
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "google_login_enabled",
                                            event.target.checked,
                                        )
                                    }
                                    className="avora-checkbox rounded border-slate-300"
                                />
                            </label>
                            <div className="grid gap-4">
                                <FormField
                                    label="Google Client ID"
                                    value={
                                        websiteSettingForm.data.google_client_id
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "google_client_id",
                                            event.target.value,
                                        )
                                    }
                                    error={
                                        websiteSettingForm.errors
                                            .google_client_id
                                    }
                                />
                                <FormField
                                    label="Google Client Secret"
                                    type="password"
                                    value={
                                        websiteSettingForm.data
                                            .google_client_secret
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "google_client_secret",
                                            event.target.value,
                                        )
                                    }
                                    error={
                                        websiteSettingForm.errors
                                            .google_client_secret
                                    }
                                    placeholder={
                                        websiteSettings?.google_secret_configured
                                            ? translate({
                                                  ar: "اتركه فارغًا للاحتفاظ بالقديم",
                                                  en: "Leave empty to keep current secret",
                                              })
                                            : ""
                                    }
                                />
                                <FormField
                                    label="Google Redirect URL"
                                    type="url"
                                    value={
                                        websiteSettingForm.data
                                            .google_redirect_url
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "google_redirect_url",
                                            event.target.value,
                                        )
                                    }
                                    error={
                                        websiteSettingForm.errors
                                            .google_redirect_url
                                    }
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                            <label className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                                <span>
                                    <span className="block text-sm font-black text-slate-900 dark:text-white">
                                        Facebook
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {translate({
                                            ar: "إظهار زر الدخول بفيسبوك في صفحة تسجيل الدخول",
                                            en: "Show Facebook login button on the login page",
                                        })}
                                    </span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={
                                        websiteSettingForm.data
                                            .facebook_login_enabled
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "facebook_login_enabled",
                                            event.target.checked,
                                        )
                                    }
                                    className="avora-checkbox rounded border-slate-300"
                                />
                            </label>
                            <div className="grid gap-4">
                                <FormField
                                    label="Facebook Client ID"
                                    value={
                                        websiteSettingForm.data
                                            .facebook_client_id
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "facebook_client_id",
                                            event.target.value,
                                        )
                                    }
                                    error={
                                        websiteSettingForm.errors
                                            .facebook_client_id
                                    }
                                />
                                <FormField
                                    label="Facebook Client Secret"
                                    type="password"
                                    value={
                                        websiteSettingForm.data
                                            .facebook_client_secret
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "facebook_client_secret",
                                            event.target.value,
                                        )
                                    }
                                    error={
                                        websiteSettingForm.errors
                                            .facebook_client_secret
                                    }
                                    placeholder={
                                        websiteSettings?.facebook_secret_configured
                                            ? translate({
                                                  ar: "اتركه فارغًا للاحتفاظ بالقديم",
                                                  en: "Leave empty to keep current secret",
                                              })
                                            : ""
                                    }
                                />
                                <FormField
                                    label="Facebook Redirect URL"
                                    type="url"
                                    value={
                                        websiteSettingForm.data
                                            .facebook_redirect_url
                                    }
                                    onChange={(event) =>
                                        websiteSettingForm.setData(
                                            "facebook_redirect_url",
                                            event.target.value,
                                        )
                                    }
                                    error={
                                        websiteSettingForm.errors
                                            .facebook_redirect_url
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    {translate({
                        ar: "أيقونات المتصفح والتطبيق",
                        en: "Browser & app icons",
                    })}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {renderFileField(
                        "favicon_96",
                        "favicon-96x96.png",
                        websiteSettings?.favicon_96_url,
                        "image/png",
                    )}
                    {renderFileField(
                        "favicon_svg",
                        "favicon.svg",
                        websiteSettings?.favicon_svg_url,
                        ".svg,image/svg+xml",
                    )}
                    {renderFileField(
                        "favicon_ico",
                        "favicon.ico",
                        websiteSettings?.favicon_ico_url,
                        ".ico,image/x-icon",
                    )}
                    {renderFileField(
                        "apple_touch_icon",
                        "apple-touch-icon.png",
                        websiteSettings?.apple_touch_icon_url,
                        "image/png",
                    )}
                    {renderFileField(
                        "web_app_manifest_192",
                        "web-app-manifest-192x192.png",
                        websiteSettings?.web_app_manifest_192_url,
                        "image/png",
                    )}
                    {renderFileField(
                        "web_app_manifest_512",
                        "web-app-manifest-512x512.png",
                        websiteSettings?.web_app_manifest_512_url,
                        "image/png",
                    )}
                    {renderFileField(
                        "site_webmanifest",
                        "site.webmanifest",
                        websiteSettings?.site_webmanifest_url,
                        ".webmanifest,application/manifest+json,application/json",
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    {translate({ ar: "بيانات التواصل", en: "Contact details" })}
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <FormField
                        label={translate({
                            ar: "إيميل التواصل",
                            en: "Contact email",
                        })}
                        type="email"
                        value={websiteSettingForm.data.contact_email}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "contact_email",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.contact_email}
                    />
                    <FormField
                        label={translate({ ar: "رقم الهاتف", en: "Phone" })}
                        value={websiteSettingForm.data.phone}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "phone",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.phone}
                    />
                    <FormField
                        label="WhatsApp"
                        value={websiteSettingForm.data.whatsapp}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "whatsapp",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.whatsapp}
                    />
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    {translate({
                        ar: "روابط السوشيال ميديا",
                        en: "Social media links",
                    })}
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <FormField
                        label="Facebook"
                        type="url"
                        value={websiteSettingForm.data.facebook_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "facebook_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.facebook_url}
                    />
                    <FormField
                        label="Instagram"
                        type="url"
                        value={websiteSettingForm.data.instagram_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "instagram_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.instagram_url}
                    />
                    <FormField
                        label="X / Twitter"
                        type="url"
                        value={websiteSettingForm.data.x_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "x_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.x_url}
                    />
                    <FormField
                        label="LinkedIn"
                        type="url"
                        value={websiteSettingForm.data.linkedin_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "linkedin_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.linkedin_url}
                    />
                    <FormField
                        label="YouTube"
                        type="url"
                        value={websiteSettingForm.data.youtube_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "youtube_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.youtube_url}
                    />
                    <FormField
                        label="TikTok"
                        type="url"
                        value={websiteSettingForm.data.tiktok_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "tiktok_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.tiktok_url}
                    />
                    <FormField
                        label="Telegram"
                        type="url"
                        value={websiteSettingForm.data.telegram_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "telegram_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.telegram_url}
                    />
                    <FormField
                        label="Snapchat"
                        type="url"
                        value={websiteSettingForm.data.snapchat_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "snapchat_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.snapchat_url}
                    />
                    <FormField
                        label="Pinterest"
                        type="url"
                        value={websiteSettingForm.data.pinterest_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "pinterest_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.pinterest_url}
                    />
                    <FormField
                        label="GitHub"
                        type="url"
                        value={websiteSettingForm.data.github_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "github_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.github_url}
                    />
                    <FormField
                        label="Discord"
                        type="url"
                        value={websiteSettingForm.data.discord_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "discord_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.discord_url}
                    />
                    <FormField
                        label="Threads"
                        type="url"
                        value={websiteSettingForm.data.threads_url}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "threads_url",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.threads_url}
                    />
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                    SMTP
                </h2>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <FormField
                        label="SMTP Host"
                        value={websiteSettingForm.data.smtp_host}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "smtp_host",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.smtp_host}
                    />
                    <FormField
                        label="SMTP Port"
                        type="number"
                        value={websiteSettingForm.data.smtp_port}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "smtp_port",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.smtp_port}
                    />
                    <FormField
                        label="SMTP Username"
                        value={websiteSettingForm.data.smtp_username}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "smtp_username",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.smtp_username}
                    />
                    <FormField
                        label="SMTP Password"
                        type="password"
                        value={websiteSettingForm.data.smtp_password}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "smtp_password",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.smtp_password}
                        placeholder={translate({
                            ar: "اتركه فارغًا لو مش هتغيره",
                            en: "Leave empty to keep current password",
                        })}
                    />
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Encryption
                        </span>
                        <select
                            className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                            value={websiteSettingForm.data.smtp_encryption}
                            onChange={(event) =>
                                websiteSettingForm.setData(
                                    "smtp_encryption",
                                    event.target.value,
                                )
                            }
                        >
                            <option value="">
                                {translate({ ar: "بدون", en: "None" })}
                            </option>
                            <option value="tls">TLS</option>
                            <option value="ssl">SSL</option>
                        </select>
                        {websiteSettingForm.errors.smtp_encryption && (
                            <span className="mt-1.5 block text-xs font-medium text-rose-600">
                                {websiteSettingForm.errors.smtp_encryption}
                            </span>
                        )}
                    </label>
                    <FormField
                        label="From Address"
                        type="email"
                        value={websiteSettingForm.data.smtp_from_address}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "smtp_from_address",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.smtp_from_address}
                    />
                    <FormField
                        label="From Name"
                        value={websiteSettingForm.data.smtp_from_name}
                        onChange={(event) =>
                            websiteSettingForm.setData(
                                "smtp_from_name",
                                event.target.value,
                            )
                        }
                        error={websiteSettingForm.errors.smtp_from_name}
                    />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                    <h3 className="font-bold text-slate-950 dark:text-white">
                        {translate({
                            ar: "تجربة إرسال إيميل",
                            en: "Send test email",
                        })}
                    </h3>
                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start">
                        <div className="flex-1">
                            <FormField
                                label={translate({
                                    ar: "إيميل الاستقبال",
                                    en: "Recipient email",
                                })}
                                type="email"
                                value={smtpTestForm.data.email}
                                onChange={(event) =>
                                    smtpTestForm.setData(
                                        "email",
                                        event.target.value,
                                    )
                                }
                                error={smtpTestForm.errors.email}
                            />
                        </div>
                        <Button
                            type="button"
                            rounded="no"
                            className="mt-7"
                            disabled={smtpTestForm.processing}
                            onClick={() =>
                                smtpTestForm.post(
                                    route(
                                        "dashboard.settings.website.test-email",
                                    ),
                                    { preserveScroll: true },
                                )
                            }
                        >
                            {translate({ ar: "إرسال تيست", en: "Send test" })}
                        </Button>
                    </div>
                    {smtpTestForm.wasSuccessful && (
                        <p className="mt-3 text-sm font-semibold text-emerald-600">
                            {translate({
                                ar: "تم إرسال رسالة التجربة.",
                                en: "Test email was sent.",
                            })}
                        </p>
                    )}
                </div>
            </section>

            <div className="sticky bottom-4 z-10 flex justify-end">
                <Button rounded="no" disabled={websiteSettingForm.processing}>
                    {translate({
                        ar: "حفظ إعدادات الموقع",
                        en: "Save website settings",
                    })}
                </Button>
            </div>
        </form>
    );

    const renderPurchases = () => {
        const statusClass = (status: string) => {
            if (["paid", "paid_waiting_webhook"].includes(status))
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
            if (["failed", "cancelled"].includes(status))
                return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
            if (["redirected", "pending"].includes(status))
                return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
            return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
        };

        return (
            <section className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500">
                            {translate({
                                ar: "إجمالي العمليات",
                                en: "Total transactions",
                            })}
                        </p>
                        <p className="mt-2 text-2xl font-black">
                            {purchases.length}
                        </p>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500">
                            {translate({
                                ar: "عمليات ناجحة",
                                en: "Paid transactions",
                            })}
                        </p>
                        <p className="mt-2 text-2xl font-black">
                            {
                                purchases.filter((purchase) =>
                                    ["paid", "paid_waiting_webhook"].includes(
                                        purchase.status,
                                    ),
                                ).length
                            }
                        </p>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm text-slate-500">
                            {translate({
                                ar: "عمليات معلقة",
                                en: "Pending transactions",
                            })}
                        </p>
                        <p className="mt-2 text-2xl font-black">
                            {
                                purchases.filter((purchase) =>
                                    ["pending", "redirected"].includes(
                                        purchase.status,
                                    ),
                                ).length
                            }
                        </p>
                    </article>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                        <h2 className="text-lg font-black text-slate-950 dark:text-white">
                            {translate({
                                ar: "قائمة المشتريات",
                                en: "Purchases list",
                            })}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {translate({
                                ar: "اعرف مين اشترى، المنتج، المبلغ، بوابة الدفع، وحالة العملية.",
                                en: "See who purchased, the product, amount, gateway, and transaction status.",
                            })}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                                <tr>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "العميل",
                                            en: "Customer",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "المنتج",
                                            en: "Product",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "المبلغ",
                                            en: "Amount",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "البوابة",
                                            en: "Gateway",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "الحالة",
                                            en: "Status",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "التاريخ",
                                            en: "Date",
                                        })}
                                    </th>
                                    <th className="px-5 py-4 text-start">
                                        {translate({
                                            ar: "رقم العملية",
                                            en: "Reference",
                                        })}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-10 text-center text-slate-500"
                                        >
                                            {translate({
                                                ar: "لا توجد مشتريات حتى الآن.",
                                                en: "No purchases yet.",
                                            })}
                                        </td>
                                    </tr>
                                ) : (
                                    purchases.map((purchase) => (
                                        <tr
                                            key={purchase.uuid}
                                            className="border-t border-slate-100 dark:border-slate-800"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-slate-950 dark:text-white">
                                                    {purchase.customer_name}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {purchase.customer_email ??
                                                        translate({
                                                            ar: "زائر بدون حساب",
                                                            en: "Guest checkout",
                                                        })}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 font-semibold">
                                                {purchase.product_name}
                                            </td>
                                            <td className="px-5 py-4 font-black">
                                                {purchase.amount_decimal}{" "}
                                                {purchase.currency}
                                            </td>
                                            <td className="px-5 py-4">
                                                {purchase.gateway_name}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(purchase.status)}`}
                                                >
                                                    {purchase.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-500">
                                                {purchase.created_at}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="block max-w-[180px] truncate font-mono text-xs text-slate-500">
                                                    {purchase.gateway_reference ??
                                                        purchase.uuid}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    };

    const renderContent = () => {
        if (section === "settings") return renderWebsiteSettings();
        if (section === "payments")
            return <PaymentGatewaysInclude gateways={paymentGateways} />;
        if (section === "purchases") return renderPurchases();
        if (section === "users") return renderUsers();
        if (section === "permissions") return renderPermissions();
        if (section === "orders" || section === "tables")
            return <RecentOrders />;

        if (section === "reports")
            return (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            [
                                "84,500 ج.م",
                                { ar: "صافي الإيرادات", en: "Net revenue" },
                            ],
                            [
                                "3.8%",
                                { ar: "معدل التحويل", en: "Conversion rate" },
                            ],
                            [
                                "1,842",
                                { ar: "إجمالي الزيارات", en: "Total visits" },
                            ],
                        ].map(([value, label]) => (
                            <article
                                key={value as string}
                                className="avora-surface avora-border rounded-2xl border p-5"
                            >
                                <p className="avora-muted text-sm">
                                    {translate(
                                        label as { ar: string; en: string },
                                    )}
                                </p>
                                <p className="mt-2 text-2xl font-bold">
                                    {value as string}
                                </p>
                            </article>
                        ))}
                    </div>
                    <SalesOverview />
                </div>
            );

        if (section === "products")
            return (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <article
                            key={product.name.en}
                            className="avora-surface avora-border overflow-hidden rounded-2xl border"
                        >
                            <div
                                className={`grid h-40 place-items-center ${product.color}`}
                            >
                                <DashboardIcon
                                    name="products"
                                    className="h-14 w-14 text-white/90"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-bold">
                                            {translate(product.name)}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {product.sales}{" "}
                                            {translate({
                                                ar: "عملية بيع",
                                                en: "sales",
                                            })}
                                        </p>
                                    </div>
                                    <strong className="avora-text-primary">
                                        {product.price}
                                    </strong>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    fullWidth
                                    rounded="no"
                                    className="mt-5"
                                >
                                    {translate({
                                        ar: "تعديل المنتج",
                                        en: "Edit product",
                                    })}
                                </Button>
                            </div>
                        </article>
                    ))}
                </div>
            );

        if (section === "customers")
            return (
                <div className="avora-surface avora-border overflow-hidden rounded-2xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-sm">
                            <thead className="avora-surface-muted avora-muted">
                                <tr>
                                    <th className="px-6 py-4 text-start">
                                        {translate({
                                            ar: "العميل",
                                            en: "Customer",
                                        })}
                                    </th>
                                    <th className="px-6 py-4 text-start">
                                        {translate({
                                            ar: "البريد الإلكتروني",
                                            en: "Email",
                                        })}
                                    </th>
                                    <th className="px-6 py-4 text-start">
                                        {translate({
                                            ar: "الطلبات",
                                            en: "Orders",
                                        })}
                                    </th>
                                    <th className="px-6 py-4 text-start">
                                        {translate({
                                            ar: "إجمالي الإنفاق",
                                            en: "Total spent",
                                        })}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr
                                        key={customer.email}
                                        className="avora-border border-b"
                                    >
                                        <td className="px-6 py-4 font-semibold">
                                            {customer.name}
                                        </td>
                                        <td className="avora-muted px-6 py-4">
                                            {customer.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.orders}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            {customer.spent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );

        if (section === "calendar") {
            const days =
                language === "ar"
                    ? [
                          "سبت",
                          "أحد",
                          "اثنين",
                          "ثلاثاء",
                          "أربعاء",
                          "خميس",
                          "جمعة",
                      ]
                    : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
            return (
                <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                    <div className="mb-5 flex items-center justify-between">
                        <Button variant="outline" size="icon" rounded="no">
                            ‹
                        </Button>
                        <h2 className="font-bold">
                            {translate({ ar: "يونيو 2026", en: "June 2026" })}
                        </h2>
                        <Button variant="outline" size="icon" rounded="no">
                            ›
                        </Button>
                    </div>
                    <div className="grid grid-cols-7">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="border-b border-slate-100 p-2 text-center text-xs font-semibold text-slate-500 dark:border-slate-800"
                            >
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: 35 }, (_, index) => (
                            <div
                                key={index}
                                className="min-h-24 border-b border-e border-slate-100 p-2 text-sm dark:border-slate-800"
                            >
                                <span
                                    className={
                                        index === 21
                                            ? "avora-bg-primary grid h-7 w-7 place-items-center rounded-full text-white"
                                            : ""
                                    }
                                >
                                    {index < 30 ? index + 1 : index - 29}
                                </span>
                                {index === 21 && (
                                    <p className="avora-bg-primary-soft avora-text-primary mt-2 rounded p-1 text-xs">
                                        {translate({
                                            ar: "اجتماع الفريق",
                                            en: "Team meeting",
                                        })}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </article>
            );
        }

        if (section === "forms" || section === "settings")
            return (
                <form
                    onSubmit={(event) => event.preventDefault()}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950"
                >
                    <h2 className="mb-6 text-lg font-bold">
                        {section === "settings"
                            ? translate({
                                  ar: "الإعدادات العامة",
                                  en: "General settings",
                              })
                            : translate({
                                  ar: "نموذج تجريبي كامل",
                                  en: "Complete sample form",
                              })}
                    </h2>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            label={translate({ ar: "الاسم", en: "Name" })}
                            placeholder={translate({
                                ar: "اكتب الاسم",
                                en: "Enter name",
                            })}
                        />
                        <FormField
                            label={translate({
                                ar: "البريد الإلكتروني",
                                en: "Email",
                            })}
                            type="email"
                            placeholder="name@example.com"
                        />
                        <FormField
                            label={translate({ ar: "رقم الهاتف", en: "Phone" })}
                            placeholder="+20 100 000 0000"
                        />
                        <label className="block">
                            <span className="mb-2 block text-sm font-semibold">
                                {translate({ ar: "الحالة", en: "Status" })}
                            </span>
                            <select className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                                <option>
                                    {translate({ ar: "نشط", en: "Active" })}
                                </option>
                                <option>
                                    {translate({
                                        ar: "غير نشط",
                                        en: "Inactive",
                                    })}
                                </option>
                            </select>
                        </label>
                    </div>
                    <label className="mt-5 block">
                        <span className="mb-2 block text-sm font-semibold">
                            {translate({ ar: "الوصف", en: "Description" })}
                        </span>
                        <textarea
                            rows={4}
                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </label>
                    <div className="mt-6 flex gap-3">
                        <Button rounded="no">
                            {translate({
                                ar: "حفظ التغييرات",
                                en: "Save changes",
                            })}
                        </Button>
                        <Button type="reset" variant="outline" rounded="no">
                            {translate({ ar: "إلغاء", en: "Cancel" })}
                        </Button>
                    </div>
                </form>
            );

        return (
            <div className="space-y-6">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                    <h2 className="font-bold">
                        {translate({ ar: "الأزرار", en: "Buttons" })}
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="outline">Outline</Button>
                    </div>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                    <h2 className="font-bold">
                        {translate({
                            ar: "التنبيهات والشارات",
                            en: "Alerts & badges",
                        })}
                    </h2>
                    <div className="avora-status-success mt-4 rounded-xl p-4 text-sm">
                        {translate({
                            ar: "تم حفظ البيانات بنجاح.",
                            en: "Your data was saved successfully.",
                        })}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <span className="avora-bg-primary-soft avora-text-primary rounded-full px-3 py-1 text-xs font-semibold">
                            New
                        </span>
                        <span className="avora-status-warning rounded-full px-3 py-1 text-xs font-semibold">
                            Pending
                        </span>
                        <span className="avora-status-success rounded-full px-3 py-1 text-xs font-semibold">
                            Active
                        </span>
                    </div>
                </article>
            </div>
        );
    };

    return (
        <DashboardLayout>
            {header}
            {renderContent()}
        </DashboardLayout>
    );
}
