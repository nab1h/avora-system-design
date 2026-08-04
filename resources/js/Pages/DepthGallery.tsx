import { Head } from "@inertiajs/react";
import DepthGallery from "../Components/DepthGallery/DepthGallery";

export default function DepthGalleryPage() {
    return (
        <>
            <Head title="Depth Gallery" />

            <DepthGallery
                title="Explore Our Categories"
                subtitle="Three.js · Atmospheric Depth"
                scrollHint="Scroll or swipe"
            />
        </>
    );
}
