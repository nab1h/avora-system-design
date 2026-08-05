import { Button } from "@/avora-dash/components/Button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardImage,
    CardMeta,
    CardPrice,
    CardTitle,
} from "@/avora-dash/components/Card";

export interface ProductCardIncludeProps {
    image: string;
    imageAlt: string;
    category: string;
    title: string;
    description: string;
    price: string;
    buttonLabel: string;
    onAction?: () => void;
}

// Reusable product card. Change its props instead of editing the component.
export function ProductCardInclude({
    image,
    imageAlt,
    category,
    title,
    description,
    price,
    buttonLabel,
    onAction,
}: ProductCardIncludeProps) {
    return (
        <Card variant="elevated" className="h-full overflow-hidden">
            {/* Change h-48 if your project needs a taller image. */}
            <CardImage src={image} alt={imageAlt} className="h-48" />

            <CardHeader>
                <CardMeta>{category}</CardMeta>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardFooter>
                <CardPrice>{price}</CardPrice>
                {/* Connect onAction to navigation, cart, or another action. */}
                <Button type="button" size="sm" onClick={onAction}>
                    {buttonLabel}
                </Button>
            </CardFooter>
        </Card>
    );
}
