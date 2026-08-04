import { useEffect, useRef, useState } from 'react';
import './DepthGallery.css';
import { Experience } from './runtime/Experience';
import { Engine } from './runtime/Experience/Engine';




// The visual engine is adapted from the MIT-licensed Codrops demo.


interface DepthGalleryProps {
    title?: string;
    subtitle?: string;
    scrollHint?: string;
    className?: string;
}

export default function DepthGallery({
    title = 'Atmospheric Depth Gallery',
    subtitle = 'Three.js · Parallax · GLSL',
    scrollHint = 'Scroll to explore',
    className = '',
}: DepthGalleryProps) {
    const rootRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;

        if (!root || !canvas) {
            return;
        }

        const experience = new Experience({ host: root });
        const engine = new Engine(canvas, experience, { host: root });
        let isMounted = true;

        engine.init().catch((reason: unknown) => {
            console.error('Depth gallery initialization failed:', reason);

            if (!isMounted) {
                return;
            }

            setError(
                reason instanceof Error
                    ? reason.message
                    : 'The 3D gallery could not start.',
            );
        });

        return () => {
            isMounted = false;
            engine.dispose();
        };
    }, []);

    return (
        <main
            ref={rootRef}
            className={`depth-gallery ${className}`.trim()}
            aria-label={title}
        >
            <canvas
                ref={canvasRef}
                className="depth-gallery__canvas"
                aria-hidden="true"
            />

            <header className="depth-gallery__frame">
                <div>
                    <p className="depth-gallery__eyebrow">{subtitle}</p>
                    <h1 className="depth-gallery__title">{title}</h1>
                </div>

                <p className="depth-gallery__hint">{scrollHint}</p>
            </header>

            {error && (
                <div className="depth-gallery__error" role="alert">
                    <strong>WebGL error</strong>
                    <span>{error}</span>
                </div>
            )}
        </main>
    );
}
