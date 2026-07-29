import { SectionTitle } from '@/avora-dash/components/SectionTitle';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useTheme } from '@/avora-dash/providers/ThemeProvider';
import {
    LuGift,
    LuHeadphones,
    LuLockKeyhole,
    LuRocket,
    LuRepeat2,
    LuUndo2,
} from 'react-icons/lu';

const benefits = [
    {
        icon: LuRocket,
        title: { ar: 'توصيل مجاني', en: 'FREE DELIVERY' },
        description: { ar: 'استمتع بتوصيل مجاني سريع لطلباتك المختارة.', en: 'Enjoy fast, free delivery on your selected orders.' },
    },
    {
        icon: LuHeadphones,
        title: { ar: 'خدمة عملاء 24/7', en: '24/7 CUSTOMER SERVICE' },
        description: { ar: 'فريقنا متاح لمساعدتك والإجابة عن استفساراتك في أي وقت.', en: 'Our team is here to help with your questions at any time.' },
    },
    {
        icon: LuLockKeyhole,
        title: { ar: 'دفع آمن', en: 'PAYMENT SECURED' },
        description: { ar: 'وسائل دفع موثوقة لحماية معلوماتك في كل عملية شراء.', en: 'Trusted payment methods protect your information at checkout.' },
    },
    {
        icon: LuRepeat2,
        title: { ar: 'استبدال سهل ومجاني', en: 'FREE, EASY EXCHANGES' },
        description: { ar: 'يمكنك استبدال المنتج بسهولة وفق سياسة الاستبدال الخاصة بنا.', en: 'Exchange your product easily under our exchange policy.' },
    },
    {
        icon: LuGift,
        title: { ar: 'بطاقة هدية', en: 'GIFT CARD' },
        description: { ar: 'قدّم اختيارًا أنيقًا لمن تحب مع بطاقات الهدايا.', en: 'Give someone special the freedom to choose with a gift card.' },
    },
    {
        icon: LuUndo2,
        title: { ar: 'إرجاع خلال 14 يومًا', en: '14-DAY RETURNS' },
        description: { ar: 'يمكنك إرجاع طلبك خلال 14 يومًا بكل سهولة.', en: 'Return your order easily within 14 days.' },
    },
];

export function ShoppingBenefits() {
    const { colors } = useTheme();
    const { translate } = useLanguage();

    return (
        <section className="space-y-8">
            <SectionTitle
                text={{ ar: 'التسوق مع أفورا', en: 'SHOPPING WITH AVORA' }}
                lineClassName="!w-[228px]"
                className="!text-[13px] !font-medium"
            />
            <div className="grid md:grid-cols-3" aria-label={translate({ ar: 'مزايا التسوق', en: 'Shopping benefits' })}>
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    const isTopRow = index < 3;
                    const isEndColumn = index % 3 === 2;

                    return (
                        <article
                            key={benefit.title.en}
                            className={`min-h-44 px-7 py-8 md:px-7 ${isTopRow ? 'md:border-b' : ''} ${isEndColumn ? '' : 'md:border-e'}`}
                            style={{ borderColor: colors.border }}
                        >
                            <Icon className="mb-6 h-9 w-9 stroke-[1.25]" style={{ color: colors.primary }} />
                            <h2 className="text-sm font-medium uppercase tracking-[0.16em]">{translate(benefit.title)}</h2>
                            <p className="avora-muted mt-4 max-w-xs text-sm leading-5">{translate(benefit.description)}</p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
