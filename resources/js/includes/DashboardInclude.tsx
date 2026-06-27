import { Card, CardMeta } from '@/avora-dash/components/Card';
import { Container } from '@/avora-dash/components/Container';
import { Grid, GridItem } from '@/avora-dash/components/Grid';
import { useLanguage } from '@/avora-dash/providers/LanguageProvider';
import { useTheme } from '@/avora-dash/providers/ThemeProvider';

// Copy this dashboard and replace the sample values with real data.
export function DashboardInclude() {
    const { translate } = useLanguage();
    const { colors } = useTheme();

    // Replace these values with data from your backend.
    const statistics = [
        {
            label: translate({ ar: 'الطلبات', en: 'Orders' }),
            value: '124',
        },
        {
            label: translate({ ar: 'العملاء', en: 'Customers' }),
            value: '89',
        },
    ];

    return (
        <Container as="section" width="wide" gutter="md" paddingY="lg">
            {/* Dashboard gives four columns on large screens. */}
            <Grid layout="dashboard" gap="md">
                <GridItem mdSpan="two">
                    <Card variant="elevated" padding="lg" className="h-full">
                        <CardMeta>
                            {translate({
                                ar: 'إجمالي المبيعات',
                                en: 'Total sales',
                            })}
                        </CardMeta>
                        {/* Replace this value with real sales data. */}
                        <p className="mt-3 text-3xl font-bold">
                            {translate({
                                ar: '٤٨٬٢٠٠ ج.م',
                                en: 'EGP 48,200',
                            })}
                        </p>
                        <p
                            className="mt-2 text-sm"
                            style={{ color: colors.success }}
                        >
                            +18.4%
                        </p>
                    </Card>
                </GridItem>

                {statistics.map((statistic) => (
                    <GridItem key={statistic.label}>
                        <Card padding="lg" className="h-full">
                            <CardMeta>{statistic.label}</CardMeta>
                            <p className="mt-3 text-2xl font-bold">
                                {statistic.value}
                            </p>
                        </Card>
                    </GridItem>
                ))}
            </Grid>
        </Container>
    );
}
