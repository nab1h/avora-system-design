import { useRef, type ReactNode } from "react";
import {
    A11y,
    Autoplay,
    Keyboard,
    Mousewheel,
    Navigation,
    Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./slider.css";

export type SliderArrowsPosition =
    | "inside"
    | "outside"
    | "top"
    | "bottom";

export type SliderPaginationPosition = "inside" | "outside";
export type SliderPaginationType = "bullets" | "fraction" | "progressbar";

export interface SliderItem {
    /** Stable identifier used as the React key. */
    id: string | number;
    /** Any card, image, or custom React content. */
    content: ReactNode;
    /** Optional accessible name announced by screen readers. */
    ariaLabel?: string;
}

export interface SliderProps {
    /** Slides rendered by the slider. */
    items: SliderItem[];
    /** Accessible label for the complete slider region. */
    ariaLabel?: string;
    /** Number of visible slides. Use "auto" for content-defined widths. */
    slidesPerView?: number | "auto";
    /** Number of slides moved on each navigation action. */
    slidesPerGroup?: number;
    /** Space between slides in pixels. */
    spaceBetween?: number;
    /** Responsive Swiper settings keyed by minimum viewport width. */
    breakpoints?: SwiperOptions["breakpoints"];
    /** Enables infinite looping when enough items exist. */
    loop?: boolean;
    /** Enables arrow navigation. */
    arrows?: boolean;
    /** Controls where arrow buttons are placed. */
    arrowsPosition?: SliderArrowsPosition;
    /** Custom content for the previous arrow button. */
    previousArrowIcon?: ReactNode;
    /** Custom content for the next arrow button. */
    nextArrowIcon?: ReactNode;
    /** Additional class applied to both arrow buttons. */
    arrowClassName?: string;
    /** Accessible label for the previous arrow. */
    previousArrowLabel?: string;
    /** Accessible label for the next arrow. */
    nextArrowLabel?: string;
    /** Enables pagination dots. */
    pagination?: boolean;
    /** Controls whether dots overlay the slider or sit below it. */
    paginationPosition?: SliderPaginationPosition;
    /** Selects dots, slide numbers, or a progress bar. */
    paginationType?: SliderPaginationType;
    /** Additional class applied to the pagination container. */
    paginationClassName?: string;
    /** Additional class applied to every pagination bullet. */
    paginationBulletClassName?: string;
    /** Additional class applied to the active pagination bullet. */
    paginationActiveBulletClassName?: string;
    /** Custom HTML renderer for bullets. Return trusted markup only. */
    renderPaginationBullet?: (index: number, className: string) => string;
    /** Enables automatic movement. A number sets the delay in milliseconds. */
    autoplay?: boolean | number;
    /** Pauses autoplay while the pointer is over the slider. */
    pauseOnMouseEnter?: boolean;
    /** Stops autoplay after manual interaction when true. */
    stopAutoplayOnInteraction?: boolean;
    /** Slider transition duration in milliseconds. */
    speed?: number;
    /** Enables mouse/touch dragging. */
    allowTouchMove?: boolean;
    /** Centers the active slide. */
    centeredSlides?: boolean;
    /** Shows a grab cursor over draggable slides. */
    grabCursor?: boolean;
    /** Uses right-to-left movement. Defaults to the document direction. */
    direction?: "ltr" | "rtl";
    /** Sets whether slides move horizontally or vertically. */
    orientation?: "horizontal" | "vertical";
    /** Enables navigation using the mouse wheel or trackpad. */
    mousewheel?: boolean;
    /** Lets page scrolling continue when the slider reaches either edge. */
    mousewheelReleaseOnEdges?: boolean;
    /** Controls how strongly wheel movement affects slide navigation. */
    mousewheelSensitivity?: number;
    /** Additional class applied to the outer region. */
    className?: string;
    /** Called whenever the active slide changes. */
    onSlideChange?: (activeIndex: number) => void;
}

export function Slider({
    items,
    ariaLabel = "Content slider",
    slidesPerView = 1,
    slidesPerGroup = 1,
    spaceBetween = 24,
    breakpoints,
    loop = false,
    arrows = true,
    arrowsPosition = "inside",
    previousArrowIcon,
    nextArrowIcon,
    arrowClassName = "",
    previousArrowLabel = "Previous slide",
    nextArrowLabel = "Next slide",
    pagination = false,
    paginationPosition = "outside",
    paginationType = "bullets",
    paginationClassName = "",
    paginationBulletClassName = "",
    paginationActiveBulletClassName = "",
    renderPaginationBullet,
    autoplay = false,
    pauseOnMouseEnter = true,
    stopAutoplayOnInteraction = false,
    speed = 500,
    allowTouchMove = true,
    centeredSlides = false,
    grabCursor = true,
    direction,
    orientation = "horizontal",
    mousewheel = false,
    mousewheelReleaseOnEdges = false,
    mousewheelSensitivity = 1,
    className = "",
    onSlideChange,
}: SliderProps) {
    const previousButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const paginationRef = useRef<HTMLDivElement>(null);
    const resolvedDirection =
        direction ??
        (typeof document !== "undefined" && document.documentElement.dir === "rtl"
            ? "rtl"
            : "ltr");
    const autoplayOptions = autoplay
        ? {
              delay: typeof autoplay === "number" ? autoplay : 4000,
              disableOnInteraction: stopAutoplayOnInteraction,
              pauseOnMouseEnter,
          }
        : false;
    const visibleSlides =
        typeof slidesPerView === "number" ? slidesPerView : 1;
    const canLoop = loop && items.length > visibleSlides;

    if (items.length === 0) {
        return null;
    }

    return (
        <section
            className={`avora-slider avora-slider--${orientation} avora-slider--arrows-${arrowsPosition} avora-slider--pagination-${paginationPosition} ${className}`.trim()}
            aria-label={ariaLabel}
            dir={resolvedDirection}
        >
            {arrows && (
                <>
                    <button
                        ref={previousButtonRef}
                        type="button"
                        className={`swiper-button-prev avora-slider__arrow ${arrowClassName}`.trim()}
                        aria-label={previousArrowLabel}
                    >
                        {previousArrowIcon ?? <DefaultPreviousIcon />}
                    </button>
                    <button
                        ref={nextButtonRef}
                        type="button"
                        className={`swiper-button-next avora-slider__arrow ${arrowClassName}`.trim()}
                        aria-label={nextArrowLabel}
                    >
                        {nextArrowIcon ?? <DefaultNextIcon />}
                    </button>
                </>
            )}

            {pagination && (
                <div
                    ref={paginationRef}
                    className={`swiper-pagination avora-slider__pagination ${paginationClassName}`.trim()}
                    aria-hidden="true"
                />
            )}

            <Swiper
                key={resolvedDirection}
                modules={[
                    A11y,
                    Autoplay,
                    Keyboard,
                    Mousewheel,
                    Navigation,
                    Pagination,
                ]}
                direction={orientation}
                mousewheel={
                    mousewheel
                        ? {
                              forceToAxis: true,
                              releaseOnEdges: mousewheelReleaseOnEdges,
                              sensitivity: mousewheelSensitivity,
                          }
                        : false
                }
                slidesPerView={slidesPerView}
                slidesPerGroup={slidesPerGroup}
                spaceBetween={spaceBetween}
                breakpoints={breakpoints}
                loop={canLoop}
                navigation={
                    arrows
                        ? {
                              prevEl: previousButtonRef.current,
                              nextEl: nextButtonRef.current,
                          }
                        : false
                }
                onBeforeInit={(swiper) => {
                    if (arrows && swiper.params.navigation) {
                        const navigation = swiper.params.navigation;
                        if (typeof navigation !== "boolean") {
                            navigation.prevEl = previousButtonRef.current;
                            navigation.nextEl = nextButtonRef.current;
                        }
                    }

                    if (pagination && swiper.params.pagination) {
                        const paginationOptions = swiper.params.pagination;
                        if (typeof paginationOptions !== "boolean") {
                            paginationOptions.el = paginationRef.current;
                        }
                    }
                }}
                pagination={
                    pagination
                        ? {
                              el: paginationRef.current,
                              clickable: paginationType === "bullets",
                              type: paginationType,
                              bulletClass: `swiper-pagination-bullet ${paginationBulletClassName}`.trim(),
                              bulletActiveClass: `swiper-pagination-bullet-active ${paginationActiveBulletClassName}`.trim(),
                              renderBullet: renderPaginationBullet,
                          }
                        : false
                }
                autoplay={autoplayOptions}
                speed={speed}
                allowTouchMove={allowTouchMove}
                centeredSlides={centeredSlides}
                grabCursor={grabCursor}
                keyboard={{ enabled: true, onlyInViewport: true }}
                a11y={{ enabled: true }}
                onSlideChange={(swiper) => onSlideChange?.(swiper.realIndex)}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id} aria-label={item.ariaLabel}>
                        {item.content}
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
        
    );
}

function DefaultPreviousIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function DefaultNextIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
