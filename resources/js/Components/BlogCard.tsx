import { Button } from "@/avora-dash/Components/Button";
import { GridItem } from "@/avora-dash/Components/Grid";
import { Grid } from "@/avora-dash/Components/Grid/Grid";
import { useTheme } from "@/avora-dash/providers/ThemeProvider";

export interface BlogCardProps {
    title: string;
    imageSrc: string;
    imageAlt: string;
    buttonLabel?: string;
    onReadPost?: () => void;
}

export function BlogCard({
    title,
    imageSrc,
    imageAlt,
    buttonLabel = "READ POST",
    onReadPost,
}: BlogCardProps) {
    const { colors } = useTheme();

    return (
        <article className="overflow-hidden">
            <Grid layout="two" gap="none" className="md:h-[360px]">
                <GridItem className="h-72 md:h-full md:order-1">
                    <img
                        className="h-full w-full object-cover"
                        src={imageSrc}
                        alt={imageAlt}
                    />
                </GridItem>
                <GridItem className="flex h-full flex-col items-start justify-center gap-6 px-6 py-10 text-start md:order-2 md:px-10">
                    <h2
                        className="max-w-md font-cairo text-2xl font-light leading-relaxed tracking-wide"
                        style={{ color: colors.text }}
                    >
                        {title}
                    </h2>
                    <Button type="button" onClick={onReadPost}>
                        {buttonLabel}
                    </Button>
                </GridItem>
            </Grid>
        </article>
    );
}
