import { Button } from '@/avora-dash/components/Button';
import { FormField } from '@/avora-dash/components/forms/FormField';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import type { PaymentGateway } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState, type FormEventHandler } from 'react';

type PaymentGatewaysIncludeProps = {
    gateways: PaymentGateway[];
};

type GatewayForm = {
    enabled: boolean;
    is_backup: boolean;
    test_mode: boolean;
    public_config: Record<string, string>;
    secret_config: Record<string, string>;
};

const gatewayLook: Record<PaymentGateway['slug'], { logo: string; bg: string }> = {
    stripe: { logo: '/images/payment-gateways/stripe.svg', bg: 'bg-[#635BFF]' },
    paymob: { logo: '/images/payment-gateways/paymob.svg', bg: 'bg-sky-50' },
    paytabs: { logo: '/images/payment-gateways/paytabs.svg', bg: 'bg-white' },
    tap: { logo: '/images/payment-gateways/tap.svg', bg: 'bg-slate-950' },
    moyasar: { logo: '/images/payment-gateways/moyasar.svg', bg: 'bg-emerald-50' },
};

function gatewayLogo(gateway: PaymentGateway, className = 'h-14 w-20') {
    const look = gatewayLook[gateway.slug];

    return (
        <span className={`grid place-items-center overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800 ${look.bg} ${className}`}>
            <img
                src={look.logo}
                alt={`${gateway.name} logo`}
                className="h-full w-full object-contain"
                loading="lazy"
            />
        </span>
    );
}

const gatewayFields: Record<
    PaymentGateway['slug'],
    {
        public: Array<{ key: string; label: string; placeholder?: string }>;
        secret: Array<{ key: string; label: string }>;
        note: { ar: string; en: string };
    }
> = {
    stripe: {
        public: [{ key: 'publishable_key', label: 'Publishable Key' }],
        secret: [
            { key: 'secret_key', label: 'Secret Key' },
            { key: 'webhook_secret', label: 'Webhook Secret' },
        ],
        note: {
            ar: 'مناسبة للمدفوعات العالمية والاشتراكات، وتعمل مباشرة مع Laravel Cashier.',
            en: 'Good for global payments and subscriptions, with native Laravel Cashier support.',
        },
    },
    paymob: {
        public: [
            { key: 'iframe_id', label: 'Iframe ID' },
            { key: 'integration_id', label: 'Integration ID' },
        ],
        secret: [
            { key: 'api_key', label: 'API Key' },
            { key: 'hmac_secret', label: 'HMAC Secret' },
        ],
        note: {
            ar: 'مناسبة جدًا لمصر، البطاقات، المحافظ، وخطوة iframe الخاصة بـ Paymob.',
            en: 'A strong fit for Egypt cards, wallets, and Paymob iframe checkout.',
        },
    },
    paytabs: {
        public: [{ key: 'profile_id', label: 'Profile ID' }],
        secret: [
            { key: 'server_key', label: 'Server Key' },
            { key: 'client_key', label: 'Client Key' },
        ],
        note: {
            ar: 'منتشرة في مصر والخليج وتحتاج Adapter خاص عند تفعيلها للدفع الحقيقي.',
            en: 'Common across Egypt and GCC; needs its own adapter for live checkout.',
        },
    },
    tap: {
        public: [{ key: 'public_key', label: 'Public Key' }],
        secret: [
            { key: 'secret_key', label: 'Secret Key' },
            { key: 'webhook_secret', label: 'Webhook Secret' },
        ],
        note: {
            ar: 'مناسبة للخليج، وتم توصيل إنشاء Charge والتحويل لصفحة الدفع.',
            en: 'Good for GCC; charge creation and gateway redirect are wired.',
        },
    },
    moyasar: {
        public: [{ key: 'publishable_key', label: 'Publishable Key' }],
        secret: [
            { key: 'secret_key', label: 'Secret Key' },
            { key: 'webhook_secret', label: 'Webhook Secret' },
        ],
        note: {
            ar: 'مناسبة للسعودية ومدى، وتحتاج Adapter خاص عند تفعيلها للدفع الحقيقي.',
            en: 'Useful for Saudi Arabia and Mada; needs its own adapter for live checkout.',
        },
    },
};

function gatewayStatus(gateway: PaymentGateway) {
    if (gateway.enabled) {
        return {
            ar: 'أساسية',
            en: 'Primary',
            className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
        };
    }

    if (gateway.is_backup) {
        return {
            ar: 'احتياطي',
            en: 'Backup',
            className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
        };
    }

    return {
        ar: 'متوقفة',
        en: 'Disabled',
        className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    };
}

function PaymentGatewayPanel({
    gateway,
    open,
    onToggle,
}: {
    gateway: PaymentGateway;
    open: boolean;
    onToggle: () => void;
}) {
    const { translate } = useLanguage();
    const fields = gatewayFields[gateway.slug];
    const status = gatewayStatus(gateway);
    const form = useForm<GatewayForm>({
        enabled: gateway.enabled,
        is_backup: gateway.is_backup,
        test_mode: gateway.test_mode,
        public_config: Object.fromEntries(
            Object.entries(gateway.public_config ?? {}).map(([key, value]) => [
                key,
                typeof value === 'string' ? value : '',
            ]),
        ),
        secret_config: {},
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        form.put(route('dashboard.payment-gateways.update', gateway.id), {
            preserveScroll: true,
            onSuccess: () => form.setData('secret_config', {}),
        });
    };

    const setRole = (role: 'primary' | 'backup' | 'disabled') => {
        form.setData({
            ...form.data,
            enabled: role === 'primary',
            is_backup: role === 'backup',
        });
    };

    return (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between gap-4 p-4 text-start transition hover:bg-slate-50 dark:hover:bg-slate-900/70"
            >
                <div className="flex items-center gap-4">
                    {gatewayLogo(gateway)}
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-black text-slate-950 dark:text-white">
                                {gateway.name}
                            </h2>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${status.className}`}>
                                {translate({ ar: status.ar, en: status.en })}
                            </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                            {gateway.region}
                        </p>
                    </div>
                </div>

                <span className={`grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-lg font-black text-slate-500 transition dark:bg-slate-900 ${open ? 'rotate-180' : ''}`}>
                    ⌄
                </span>
            </button>

            {open && (
                <form onSubmit={submit} className="border-t border-slate-200 p-5 dark:border-slate-800">
                    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                                {translate(fields.note)}
                            </div>

                            <div className="grid gap-2">
                                <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                                    {translate({ ar: 'حالة البوابة', en: 'Gateway role' })}
                                </p>

                                {[
                                    { role: 'primary' as const, ar: 'أساسية شغالة', en: 'Primary active' },
                                    { role: 'backup' as const, ar: 'احتياطي', en: 'Backup' },
                                    { role: 'disabled' as const, ar: 'متوقفة', en: 'Disabled' },
                                ].map((option) => {
                                    const checked =
                                        option.role === 'primary'
                                            ? form.data.enabled
                                            : option.role === 'backup'
                                                ? form.data.is_backup
                                                : !form.data.enabled && !form.data.is_backup;

                                    return (
                                        <label
                                            key={option.role}
                                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                                                checked
                                                    ? 'border-[var(--avora-primary)] bg-[var(--avora-primary)]/10 text-[var(--avora-primary)]'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                checked={checked}
                                                onChange={() => setRole(option.role)}
                                                className="avora-radio"
                                            />
                                            {translate({ ar: option.ar, en: option.en })}
                                        </label>
                                    );
                                })}
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {translate({ ar: 'بيئة التشغيل', en: 'Mode' })}
                                </span>
                                <select
                                    className="avora-form-field w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                                    value={form.data.test_mode ? 'test' : 'live'}
                                    onChange={(event) =>
                                        form.setData('test_mode', event.target.value === 'test')
                                    }
                                >
                                    <option value="test">{translate({ ar: 'تجربة / Sandbox', en: 'Test / Sandbox' })}</option>
                                    <option value="live">{translate({ ar: 'فعلي / Live', en: 'Live' })}</option>
                                </select>
                            </label>

                            {gateway.website_url && (
                                <a
                                    href={gateway.website_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex text-sm font-bold text-[var(--avora-primary)]"
                                >
                                    {translate({ ar: 'فتح موقع البوابة', en: 'Open gateway website' })}
                                </a>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {fields.public.map((field) => (
                                <FormField
                                    key={field.key}
                                    label={field.label}
                                    value={form.data.public_config[field.key] ?? ''}
                                    onChange={(event) =>
                                        form.setData('public_config', {
                                            ...form.data.public_config,
                                            [field.key]: event.target.value,
                                        })
                                    }
                                    error={form.errors[`public_config.${field.key}`]}
                                />
                            ))}

                            {fields.secret.map((field) => (
                                <FormField
                                    key={field.key}
                                    label={`${field.label}${
                                        gateway.secret_fields[field.key]
                                            ? ` (${translate({ ar: 'محفوظ', en: 'saved' })})`
                                            : ''
                                    }`}
                                    type="password"
                                    value={form.data.secret_config[field.key] ?? ''}
                                    onChange={(event) =>
                                        form.setData('secret_config', {
                                            ...form.data.secret_config,
                                            [field.key]: event.target.value,
                                        })
                                    }
                                    placeholder={
                                        gateway.secret_fields[field.key]
                                            ? translate({
                                                ar: 'اتركه فارغًا للاحتفاظ بالقيمة الحالية',
                                                en: 'Leave empty to keep current value',
                                            })
                                            : ''
                                    }
                                    error={form.errors[`secret_config.${field.key}`]}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <Button rounded="lg" disabled={form.processing}>
                            {form.processing
                                ? translate({ ar: 'جاري الحفظ...', en: 'Saving...' })
                                : translate({ ar: 'حفظ إعدادات البوابة', en: 'Save gateway settings' })}
                        </Button>
                    </div>
                </form>
            )}
        </article>
    );
}

export function PaymentGatewaysInclude({ gateways }: PaymentGatewaysIncludeProps) {
    const { translate } = useLanguage();
    const primary = gateways.find((gateway) => gateway.enabled);
    const backup = gateways.find((gateway) => gateway.is_backup);
    const [openGateway, setOpenGateway] = useState<PaymentGateway['slug'] | null>(
        primary?.slug ?? gateways[0]?.slug ?? null,
    );

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm font-black text-[var(--avora-primary)]">
                    Payment Gateways
                </p>
                <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                    {translate({ ar: 'نظام الدفع', en: 'Payment system' })}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    {translate({
                        ar: 'اختار بوابة واحدة أساسية للدفع، وبوابة واحدة احتياطي لو احتجتها. اضغط على أيقونة البوابة لعرض إعداداتها.',
                        en: 'Choose one primary payment gateway and one backup gateway. Click a gateway icon to reveal its settings.',
                    })}
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm dark:bg-emerald-500/10">
                        <p className="font-black text-emerald-700 dark:text-emerald-300">
                            {translate({ ar: 'البوابة الأساسية', en: 'Primary gateway' })}
                        </p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            {primary?.name ?? translate({ ar: 'لم يتم اختيار بوابة أساسية', en: 'No primary gateway selected' })}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 text-sm dark:bg-amber-500/10">
                        <p className="font-black text-amber-700 dark:text-amber-300">
                            {translate({ ar: 'البوابة الاحتياطي', en: 'Backup gateway' })}
                        </p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            {backup?.name ?? translate({ ar: 'لم يتم اختيار بوابة احتياطي', en: 'No backup gateway selected' })}
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid gap-4">
                {gateways.map((gateway) => (
                    <PaymentGatewayPanel
                        key={gateway.id}
                        gateway={gateway}
                        open={openGateway === gateway.slug}
                        onToggle={() => setOpenGateway(openGateway === gateway.slug ? null : gateway.slug)}
                    />
                ))}
            </div>
        </div>
    );
}
