'use client';

import React, {useState, useEffect, useRef} from 'react';
import styles from './Header.module.css';
import {usePathname} from 'next/navigation';
import {useCart} from "@/app/lib/cart";
import Link from "next/link";
import {CartIcon} from "@/app/components/Order/CartDrawer/CartIcon";
import CartDrawer from "@/app/components/Order/CartDrawer/CartDrawer";
import {CircleUserRound} from "lucide-react";
import UserDropdown from "@/app/components/Order/UserMenu/UserMenu";
import {supabase} from "@/app/lib/supabase/client";
import {useAuth} from "@/app/components/Auth/AuthProvider";
import {Line} from "@/app/components/ui/Card";

const navItems = [
    {label: 'ORDER NOW', href: '/order', emphasize: true},
    {label: 'LOCATIONS', href: '/#FindUs'},
    {label: 'MENU', href: '/#Menu'},
    {label: 'CATERING', href: '/#Contact'},
    {label: 'FRANCHISING', href: '/#Contact'},
    {label: 'CONTACT US', href: '/#Contact'},
];

export default function Header() {
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [noScroll, setNoScroll] = useState(false);

    const mid = Math.ceil(navItems.length / 2);
    const leftItems = navItems.slice(0, mid);
    const rightItems = navItems.slice(mid);
    const [cartOpen, setCartOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const userBtnRef = useRef<HTMLButtonElement | null>(null);
    const userMenuRef = useRef<HTMLDivElement | null>(null);

    const headerRef = useRef<HTMLElement | null>(null);
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSessionUserId(data.session?.user?.id ?? null);
        };
        getSession();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setSessionUserId(session?.user?.id ?? null);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const setH = () => {
            document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
        };
        setH();
        const ro = new ResizeObserver(setH);
        ro.observe(el);
        window.addEventListener('resize', setH);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', setH);
        };
    }, [open, scrolled, noScroll]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!open) return;
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        window.addEventListener('click', onClick);
        return () => window.removeEventListener('click', onClick);
    }, [open]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
                setUserMenuOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!open) return;
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        window.addEventListener('click', onClick);
        return () => window.removeEventListener('click', onClick);
    }, [open]);

    useEffect(() => {
        const banner = document.querySelector<HTMLElement>("section[role='banner']");
        const recomputeScrolled = () => {
            if (banner) {
                const rect = banner.getBoundingClientRect();
                setScrolled(rect.bottom <= 10);
            } else {
                const heroHeight = (document.querySelector("section[role='banner']")?.scrollHeight ?? 0) - 10;
                setScrolled(window.scrollY > heroHeight);
            }
        };

        let observer: IntersectionObserver | null = null;
        if (banner && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                (entries) => { setScrolled(!entries[0].isIntersecting); },
                { root: null, threshold: 0.01, rootMargin: '-1px 0px 0px 0px' }
            );
            observer.observe(banner);
        } else {
            const onScroll = () => recomputeScrolled();
            window.addEventListener('scroll', onScroll, { passive: true });
            recomputeScrolled();
            return () => window.removeEventListener('scroll', onScroll);
        }

        const onHashOrHistory = () => { requestAnimationFrame(recomputeScrolled); };
        window.addEventListener('hashchange', onHashOrHistory);
        window.addEventListener('popstate', onHashOrHistory);
        window.addEventListener('load', onHashOrHistory);
        requestAnimationFrame(recomputeScrolled);

        return () => {
            if (observer && banner) observer.disconnect();
            window.removeEventListener('hashchange', onHashOrHistory);
            window.removeEventListener('popstate', onHashOrHistory);
            window.removeEventListener('load', onHashOrHistory);
        };
    }, []);

    useEffect(() => {
        const update = () => {
            const root = document.documentElement;
            const body = document.body;
            const scrollH = Math.max(root.scrollHeight, body.scrollHeight);
            const clientH = root.clientHeight;
            setNoScroll(scrollH <= clientH + 1);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(document.documentElement);
        window.addEventListener("resize", update);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, []);

    useEffect(() => {
        if (cartOpen) setUserMenuOpen(false);
    }, [cartOpen]);

    useEffect(() => {
        if (userMenuOpen) setCartOpen(false);
    }, [userMenuOpen]);


    const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

    const logoSrc = (scrolled || noScroll || (isMobile && open))
        ? "/logo/GoodChicken-logo.png"
        : "/logo/GoodChicken-logo_white.png";
    const isOrderPath = pathname.startsWith("/order");
    const cart = useCart();
    const itemCount = cart.items?.reduce((n, i) => n + (i.quantity ?? 1), 0) ?? 0;

    const cartBtnRef = useRef<HTMLButtonElement | null>(null);

    const toggleCartDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setOpen((v) => !v)
    }
    const { userId, openAuth } = useAuth();

    function UserDisplay() {
        if (!userId) {
            return (
                <button
                    onClick={() => {
                        setUserMenuOpen(false);
                        openAuth();
                    }}
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E9BC46] text-[#3F3126] font-semibold"
                >
                    Login
                </button>
            );
        }

        return (
            <>
                <button
                    ref={userBtnRef}
                    onClick={() => setUserMenuOpen(v => !v)}
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="Account menu"
                    className="cursor-pointer flex items-center"
                >
                    <CircleUserRound className="h-7 w-7" color="#3F3126" />
                </button>

                <UserDropdown
                    open={userMenuOpen}
                    onClose={() => setUserMenuOpen(false)}
                    anchorRef={userBtnRef}
                >

                    <button
                        className="block w-full text-left px-4 py-2 text-md hover:rounded-md hover:bg-gray-100"
                    >
                        Manage Account
                    </button>
                    <Line className="my-2"/>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            setUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-md hover:rounded-md hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </UserDropdown>
            </>
        );
    }

    return (
        <header
            ref={headerRef}
            className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${!scrolled && noScroll ? styles.headerNoScroll : ""}`}
            id="top"
            data-aos="fade-down"
            data-aos-duration="400"
        >
            <div className={`${styles.inner} ${isMobile && open ? styles.mobileMenuOpen : ""}`}>
                {/* Mobile brand row (shown only under 1024px) */}
                <div className={styles.brandRow}>
                    <button
                        type="button"
                        className={styles.menuButton}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-controls="primary-navigation"
                        aria-expanded={open}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen((v) => !v);
                        }}
                    >
                        {!open ? (
                            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                                <path style={{color: "#3F3126"}} d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        )}
                    </button>

                    <Link href="/" className={styles.brand} aria-label="BBQ Chicken home">
                        <img width="85" height="85" src={logoSrc} alt="Good Chicken" />
                    </Link>

                    {isOrderPath && isMobile? (
                        <>
                            {/* Mobile actions: single absolutely-positioned container */}
                            <div className={styles.cartButton}>
                                <div className="inline-flex items-center gap-6 relative">
                                    <button
                                        aria-label="Open cart"
                                        ref={cartBtnRef}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCartOpen(prev => {
                                                const next = !prev;
                                                if (next) setUserMenuOpen(false);
                                                return next;
                                            });
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <CartIcon className="h-6 w-6" count={itemCount} onAdd={() => setCartOpen(v => !v)} />
                                    </button>

                                  <UserDisplay />
                                </div>
                            </div>

                            <CartDrawer
                                open={cartOpen}
                                setOpen={setCartOpen}
                                anchorRef={cartBtnRef}
                            />
                        </>
                    ) : null}
                </div>

                {/* Desktop / tablet nav cluster */}
                <nav className={`${styles.nav} ${styles.navCluster}`} aria-label="Primary">
                    <ul id="primary-navigation-left" className={`${styles.navList} ${styles.leftList}`}>
                        {leftItems.map(({label, href, emphasize}) => (
                            <li key={`l-${label}`} className={styles.navItem}>
                                <a href={href} className={`${styles.link} ${emphasize ? styles.emphasize : ''}`}>{label}</a>
                            </li>
                        ))}
                    </ul>

                    <Link href="/" className={`${styles.brand} ${styles.centerBrand}`} aria-label="BBQ Chicken home">
                        <img width="85" height="85" src={logoSrc} alt="Good Chicken"/>
                    </Link>

                    <ul id="primary-navigation-right" className={`${styles.navList} ${styles.rightList}`}>
                        {rightItems.map(({label, href, emphasize}) => (
                            <li key={`r-${label}`} className={styles.navItem}>
                                <a href={href} className={`${styles.link} ${emphasize ? styles.emphasize : ''}`}>{label}</a>
                            </li>
                        ))}

                        {isOrderPath && !isMobile ? (
                            <>
                                {/* Cart */}
                                <li className={styles.navItem}>
                                    <button
                                        aria-label="Open cart"
                                        ref={cartBtnRef}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCartOpen(prev => {
                                                const next = !prev;
                                                if (next) setUserMenuOpen(false);
                                                return next;
                                            });
                                        }}
                                        className="relative cursor-pointer flex items-center gap-2"
                                    >
                                        <CartIcon className="h-6 w-6" count={itemCount} onAdd={() => setCartOpen(true)} />
                                    </button>
                                </li>

                                {/* User + dropdown (desktop) */}
                                <li className={`${styles.navItem} relative`}>
                                    <UserDisplay />
                                </li>

                                <CartDrawer open={cartOpen} setOpen={setCartOpen} anchorRef={cartBtnRef} />
                            </>
                        ) : null}
                    </ul>
                </nav>

                {/* Mobile menu panel */}
                <div
                    ref={menuRef}
                    className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                >
                    <ul className={styles.mobileNavList}>
                        {navItems.map(({label, href, emphasize}) => (
                            <li key={`m-${label}`} className={styles.mobileNavItem}>
                                <a
                                    href={href}
                                    className={`${styles.link} ${styles.mobileLink} ${emphasize ? styles.emphasize : ''}`}
                                    onClick={(e) => {
                                        setOpen(false);
                                        setCartOpen(false);
                                        setUserMenuOpen(false);
                                    }}                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
}
