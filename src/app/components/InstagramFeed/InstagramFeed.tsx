'use client';

import {useEffect, useMemo, useState} from 'react';
import styles from './instagram.module.css';
import {IgMedia, IgProfile} from "@/app/lib/types";

type ApiResponse = {
    profile: IgProfile;
    posts: IgMedia[];
    nextCursor: string | null;
};

function fmt(n?: number | null) {
    if (!n && n !== 0) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

export default function InstagramFeed({endpoint = '/api/instagram'}: { endpoint?: string }) {
    const [profile, setProfile] = useState<IgProfile | null>(null);
    const [posts, setPosts] = useState<IgMedia[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const load = async (after?: string) => {
        setLoading(true);
        setErr(null);
        try {
            const url = new URL(endpoint, window.location.origin);
            if (after) url.searchParams.set('after', after);
            url.searchParams.set('limit', '12');
            const res = await fetch(url.toString(), {cache: 'no-store'});
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: ApiResponse = await res.json();
            if (!profile) setProfile(data.profile);
            setPosts(prev => after ? [...prev, ...data.posts] : data.posts);
            setCursor(data.nextCursor);
        } catch (e: any) {
            setErr(e.message || 'Failed to load Instagram feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(); /* first page */
    }, []);

    const displayName = useMemo(() => profile?.name || profile?.username || 'Instagram', [profile]);

    return (
        <section className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <img
                        className={styles.avatar}
                        src={profile?.profilePicUrl || '/ig-avatar-fallback.png'}
                        alt={`${displayName} avatar`}
                    />
                    <div className={styles.meta}>
                        <div className={styles.nameRow}>
                            <span className={styles.name}>{displayName}</span>
                            {profile?.isVerified && (
                                <span className={styles.badge} aria-label="Verified">
                  {/* blue verified check */}
                                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                    <path fill="#1DA1F2"
                          d="M12 2.25l2.05 2.01 2.86-.71 1.22 2.7 2.9.44-.34 2.92 2.1 1.98-2.1 1.98.34 2.92-2.9.44-1.22 2.7-2.86-.71L12 21.75l-2.05-2.01-2.86.71-1.22-2.7-2.9-.44.34-2.92L1.16 12l2.1-1.98-.34-2.92 2.9-.44 1.22-2.7 2.86.71L12 2.25z"/>
                    <path fill="#fff" d="M10.6 12.9l-2.1-2.1 1.4-1.4 0.7 0.7 3.2-3.2 1.4 1.4-4.6 4.6z"/>
                  </svg>
                </span>
                            )}
                            {profile && <span className={styles.handle}>@{profile.username}</span>}
                        </div>

                        <ul className={styles.stats}>
                            <li><strong>{fmt(profile?.posts ?? posts.length)}</strong> Posts</li>
                            <li><strong>{fmt(profile?.followers)}</strong> Followers</li>
                            <li><strong>{fmt(profile?.following)}</strong> Following</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.followWrap}>
                    <button className={styles.followBtn}>Follow</button>
                </div>
            </div>

            {/* Grid */}
            {err && <div className={styles.error}>{err}</div>}

            <ul className={styles.grid}>
                {posts.map((p) => {
                    const isVideo = p.media_type === 'VIDEO';
                    const isCarousel = p.media_type === 'CAROUSEL_ALBUM';
                    const src = p.thumbnail_url || p.media_url;

                    return (
                        <li key={p.id} className={styles.tile}>
                            <a href={p.permalink} target="_blank" rel="noreferrer" className={styles.tileLink}
                               aria-label="Open post on Instagram">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt={p.caption || 'Instagram post'} className={styles.img}/>
                                {/* top-right indicator */}
                                {(isVideo || isCarousel) && (
                                    <span className={styles.kind} aria-hidden>
                                    {isVideo ? (
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path fill="currentColor" d="M8 5v14l11-7z"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="18" height="18">
                                            <path fill="currentColor" d="M7 7h10v10H7zM4 4h10v10H4z"/>
                                        </svg>
                                    )}
                                  </span>
                                )}

                                <div className={styles.hover}>
                                    <div className={styles.counts}>
                                        <span className={styles.count}>
                                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                                              <path fill="currentColor"
                                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            {fmt(p.like_count ?? null)}
                                        </span>
                                        <span className={styles.count}>
                                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                                              <path fill="currentColor"
                                                    d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
                                            </svg>
                                            {fmt(p.comments_count ?? null)}
                                        </span>
                                    </div>
                                    {p.caption && <p className={styles.caption}>{p.caption}</p>}
                                </div>
                            </a>
                        </li>
                    );
                })}
            </ul>

            <div className={styles.loadMoreRow}>
                <button
                    className={styles.loadMore}
                    onClick={() => cursor && load(cursor)}
                    disabled={!cursor || loading}
                >
                    {loading ? 'Loading…' : (cursor ? 'Load more' : 'No more posts')}
                </button>
            </div>
        </section>
    );
}
