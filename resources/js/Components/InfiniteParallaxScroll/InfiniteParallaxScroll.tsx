import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import "lenis/dist/lenis.css";
import "./InfiniteParallaxScroll.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ParallaxSlide {
  src: string;
  alt?: string;
}

export interface InfiniteParallaxScrollProps {
  slides: readonly ParallaxSlide[];
  title?: string;
  subtitle?: string;
}

interface RenderedSlide extends ParallaxSlide {
  key: string;
  duplicate: boolean;
}

export default function InfiniteParallaxScroll({
  slides,
  title = "The Never Ending Story",
  subtitle = "Infinite scroll · Lenis · GSAP",
}: InfiniteParallaxScrollProps) {
  const rootRef = useRef<HTMLMainElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const renderedSlides = useMemo<RenderedSlide[]>(() => {
    if (slides.length === 0) return [];

    const originalSlides = slides.map((slide, index) => ({
      ...slide,
      key: `slide-${index}`,
      duplicate: false,
    }));

    return [
      ...originalSlides,
      {
        ...slides[0],
        key: "slide-loop-duplicate",
        duplicate: true,
      },
    ];
  }, [slides]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const wrapper = wrapperRef.current;
      const content = contentRef.current;

      if (!root || !wrapper || !content || renderedSlides.length === 0) {
        return undefined;
      }

      const lenis = new Lenis({
        wrapper,
        content,
        infinite: true,
        syncTouch: true,
        autoRaf: false,
      });

      const snap = new Snap(lenis, {
        type: "mandatory",
        debounce: 500,
        duration: 0.9,
        easing: (progress: number) => 1 - Math.pow(1 - progress, 4),
      });

      ScrollTrigger.scrollerProxy(wrapper, {
        scrollTop(value?: number) {
          if (typeof value === "number") {
            lenis.scrollTo(value, { immediate: true });
          }

          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: wrapper.clientWidth,
            height: wrapper.clientHeight,
          } as DOMRect;
        },
        pinType: "transform",
      });

      const sections = gsap.utils.toArray<HTMLElement>(
        ".infinite-parallax__hero",
        root,
      );

      snap.addElements(sections, { align: "start" });

      const updateScrollTrigger = (): void => ScrollTrigger.update();
      const resizeLenis = (): void => lenis.resize();
      const updateLenis = (time: number): void => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      ScrollTrigger.addEventListener("refresh", resizeLenis);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      const mediaQuery = gsap.matchMedia();

      mediaQuery.add(
        {
          motionAllowed: "(prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const shouldReduceMotion = Boolean(context.conditions?.reduceMotion);

          if (shouldReduceMotion) {
            gsap.set(".infinite-parallax__picture", { yPercent: 0 });
            return;
          }

          sections.forEach((section) => {
            const picture = section.querySelector<HTMLElement>(
              ".infinite-parallax__picture",
            );

            if (!picture) return;

            gsap.fromTo(
              picture,
              { yPercent: -50 },
              {
                yPercent: 50,
                ease: "none",
                scrollTrigger: {
                  scroller: wrapper,
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  fastScrollEnd: true,
                },
              },
            );
          });
        },
      );

      ScrollTrigger.refresh();

      return () => {
        snap.stop();
        lenis.off("scroll", updateScrollTrigger);
        ScrollTrigger.removeEventListener("refresh", resizeLenis);
        gsap.ticker.remove(updateLenis);
        mediaQuery.revert();
        lenis.destroy();

        gsap.ticker.lagSmoothing(500, 33);
      };
    },
    {
      scope: rootRef,
      dependencies: [renderedSlides.length],
      revertOnUpdate: true,
    },
  );

  if (renderedSlides.length === 0) {
    return (
      <div className="infinite-parallax__empty">
        Add at least one image to the slides array.
      </div>
    );
  }

  return (
    <main ref={rootRef} className="infinite-parallax">
      <div ref={wrapperRef} className="infinite-parallax__wrapper">
        <div ref={contentRef} className="infinite-parallax__content">
          <header className="infinite-parallax__header">
            <div>
              <p className="infinite-parallax__eyebrow">{subtitle}</p>
              <h1>{title}</h1>
            </div>

            <p className="infinite-parallax__hint">Scroll to explore</p>
          </header>

          {renderedSlides.map((slide, index) => (
            <section
              className="infinite-parallax__hero"
              key={slide.key}
              aria-hidden={slide.duplicate || undefined}
            >
              <picture className="infinite-parallax__picture">
                <img
                  src={slide.src}
                  alt={slide.duplicate ? "" : slide.alt ?? `Slide ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  draggable={false}
                />
              </picture>

              <div className="infinite-parallax__index" aria-hidden="true">
                {String((index % slides.length) + 1).padStart(2, "0")}
              </div>
            </section>
          ))}

          <footer className="infinite-parallax__footer">
            <span>GSAP</span>
            <span>Lenis</span>
            <span>React + TypeScript</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
