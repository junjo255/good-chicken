// app/components/TempInstagramFeed.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
    /** Instagram post/reel URLs, e.g. https://www.instagram.com/p/XXXX/ or https://www.instagram.com/reel/XXXX/ */
    urls: string[];
    /** Optional fixed height (px). Instagram iframes don’t auto-resize without their script. */
    height?: number; // default 560
};

/** Ensure we hit Instagram's embed endpoint */
function toEmbedUrl(raw: string): string {
    // Accept post/reel URLs; append `/embed` (and strip existing query/hash)
    const u = new URL(raw);
    u.search = "";
    u.hash = "";
    if (!u.pathname.endsWith("/")) u.pathname += "/";
    if (!u.pathname.endsWith("/embed/")) u.pathname += "embed/";
    return u.toString();
}

/** Lazy-mount the iframe only when it enters the viewport */
function LazyInsta({ src, height = 560 }: { src: string; height?: number }) {
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        setMounted(true);
                        io.disconnect();
                    }
                });
            },
            { rootMargin: "200px 0px" } // start loading a bit before it’s visible
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                width: "100%",
                maxWidth: "1200px",
                margin: "1rem auto",
                borderRadius: 16,
                overflow: "hidden",
                // Create a subtle card look yourself if you want; no default shadow/border
                // boxShadow: "0 10px 20px rgba(0,0,0,.08)",
            }}
        >
            {mounted ? (
                <iframe
                    src={src}
                    title="Instagram embed"
                    loading="lazy"
                    allowTransparency={true}
                    allowFullScreen
                    scrolling="no"
                    style={{
                        display: "block",
                        width: "100%",
                        height,
                        border: "none",
                        outline: "none",
                        padding: "20px",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                    }}
                />
            ) : (
                // Lightweight placeholder (no network fetch)
                <div
                    style={{
                        height,
                        background: "rgba(0,0,0,0.04)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 14,
                        color: "rgba(0,0,0,0.6)",
                    }}
                >
                    Loading Instagram…
                </div>
            )}
        </div>
    );
}

export default function TempInstagramFeed({ urls, height = 560 }: Props) {
    return (
        <div style={{ display: "grid", gap: 16 }}>
            {urls.map((u) => (
                <LazyInsta key={u} src={toEmbedUrl(u)} height={height} />
            ))}
        </div>
    );
}
