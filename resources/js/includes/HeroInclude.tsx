import { Button } from "@/avora-dash/Components/Button";
import { Card, CardMeta } from "@/avora-dash/Components/Card";
import { Container } from "@/avora-dash/Components/Container";
import { Grid } from "@/avora-dash/Components/Grid";
import { useLanguage } from "@/avora-dash/providers/LanguageProvider";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";

// Copy this hero and change its text, buttons, and preview content.
export function HeroInclude() {
    const { translate } = useLanguage();
    const { colors } = useTheme();

    return (
        <Container as="section" width="wide" gutter="md" paddingY="lg">
            {/* Change background and rounded values for a different style. */}
            <Grid
                layout="two"
                gap="lg"
                padding="xl"
                background="gradient"
                rounded="no"
                align="center"
            >
                <div className="space-y-5">
                    {/* Change this small label. */}
                    <CardMeta>
                        {translate({
                            ar: "منتج جديد ومميز",
                            en: "New featured product",
                        })}
                    </CardMeta>

                    {/* Change the main heading here. */}
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                        {translate({
                            ar: "عنوان قوي وواضح للصفحة الرئيسية.",
                            en: "A strong and clear homepage headline.",
                        })}
                    </h1>

                    {/* Change the description here. */}
                    <p
                        className="max-w-xl leading-7"
                        style={{ color: colors.muted }}
                    >
                        {translate({
                            ar: "اكتب وصفًا مختصرًا يوضح قيمة المنتج أو الخدمة للعميل.",
                            en: "Write a short description that explains the value of your product or service.",
                        })}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {/* Connect these buttons to your real actions. */}
                        <Button>
                            {translate({ ar: "ابدأ الآن", en: "Get started" })}
                        </Button>
                        <Button variant="outline">
                            {translate({ ar: "اعرف المزيد", en: "Learn more" })}
                        </Button>
                    </div>
                </div>

                {/* Replace this card with an image, video, or product preview. */}
                <Card variant="elevated" padding="lg">
                    <div
                        className="flex min-h-64 items-center justify-center rounded-2xl text-2xl font-bold"
                        style={{
                            backgroundColor: `${colors.primary}18`,
                            color: colors.primary,
                        }}
                    >
                        {translate({
                            ar: "معاينة المنتج",
                            en: "Product preview",
                        })}
                    </div>
                </Card>
            </Grid>
        </Container>
    );
}
