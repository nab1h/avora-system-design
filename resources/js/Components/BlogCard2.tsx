import { GridItem } from "@/avora-dash/components/Grid";
import { Grid } from "@/avora-dash/components/Grid/Grid";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";

export interface BlogCard2Props {
    title: string;
    imageSrc: string;
    imageAlt: string;
}

export function BlogCard2({
    title,
    imageSrc,
    imageAlt,
}: BlogCard2Props) {
    const { colors } = useTheme();

    return (
        <article className="overflow-hidden">
            <Grid layout="two" gap="none" className="md:h-56">
                <GridItem className="h-56 md:h-full md:order-1">
                    <img
                        className="h-full w-full object-cover"
                        src={imageSrc}
                        alt={imageAlt}
                    />
                </GridItem>

                <GridItem className="flex h-full items-center justify-center px-6 py-8 text-center md:order-2 md:px-8">
                    <h2
                        className="max-w-md font-science text-xl font-light leading-relaxed tracking-wide"
                        style={{ color: colors.text }}
                    >
                        {title}
                    </h2>
                </GridItem>
            </Grid>
        </article>
    );
}
