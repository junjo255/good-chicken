'use client';
import {useState, useEffect, useRef} from 'react';
import styles from './Header.module.css';
import {usePathname} from 'next/navigation';
import CartDrawer from "@/app/components/CartDrawer/CartDrawer";
import {useCart} from "@/app/lib/cart";
import {CartIcon} from "@/app/components/CartDrawer/CartIcon";
import Link from "next/link";

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
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        const banner = document.querySelector<HTMLElement>("section[role='banner']");
        const recomputeScrolled = () => {
            if (banner) {
                const rect = banner.getBoundingClientRect();
                setScrolled(rect.bottom <= 10);
            } else {
                const heroHeight =
                    (document.querySelector("section[role='banner']")?.scrollHeight ?? 0) - 10;
                setScrolled(window.scrollY > heroHeight);
            }
        };

        let observer: IntersectionObserver | null = null;

        if (banner && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    setScrolled(!entry.isIntersecting);
                },
                {
                    root: null,
                    threshold: 0.01,
                    rootMargin: '-1px 0px 0px 0px',
                }
            );
            observer.observe(banner);
        } else {
            const onScroll = () => recomputeScrolled();
            window.addEventListener('scroll', onScroll, {passive: true});
            recomputeScrolled();
            return () => window.removeEventListener('scroll', onScroll);
        }

        const onHashOrHistory = () => {
            requestAnimationFrame(recomputeScrolled);
        };

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

    const logoSrc = (scrolled || noScroll) ? "/Good-Chicken-logo.png" : "/Good-Chicken-white-logo.png";
    const isOrderPath = pathname.startsWith("/order")
    const cart = useCart();

    const itemCount = cart.items?.reduce((n, i) => n + (i.quantity ?? 1), 0) ?? 0;

    const cartBtnRef = useRef<HTMLButtonElement | null>(null);

    return (
        <header
            className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${!scrolled && noScroll ? styles.headerNoScroll : ""}`}
            id="top"
            data-aos="fade-down"
            data-aos-duration="400"
        >
            <div className={styles.inner}>
                <div className={styles.brandRow}>
                    <Link href="/" className={styles.brand} aria-label="BBQ Chicken home">
                        <img
                            width="85" height="85"
                            src={logoSrc}
                            alt="Good Chicken"
                        />
                    </Link>

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
                                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2"
                                      strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2"
                                      strokeLinecap="round"/>
                            </svg>
                        )}
                    </button>
                </div>

                <nav className={`${styles.nav} ${styles.navCluster}`} aria-label="Primary">
                    <ul id="primary-navigation-left" className={`${styles.navList} ${styles.leftList}`}>
                        {leftItems.map(({label, href, emphasize}) => (
                            <li key={`l-${label}`} className={styles.navItem}>
                                <a href={href} className={`${styles.link} ${emphasize ? styles.emphasize : ''}`}>
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <a href="#" className={`${styles.brand} ${styles.centerBrand}`} aria-label="BBQ Chicken home">
                        <img width="85" height="85"
                             src={logoSrc}
                             alt="Good Chicken"/>
                    </a>

                    <ul id="primary-navigation-right" className={`${styles.navList} ${styles.rightList}`}>
                        {rightItems.map(({label, href, emphasize}) => (
                            <li key={`r-${label}`} className={styles.navItem}>
                                <a href={href} className={`${styles.link} ${emphasize ? styles.emphasize : ''}`}>
                                    {label}
                                </a>
                            </li>
                        ))}

                        {
                            isOrderPath ?
                                <>
                                    <button
                                        aria-label="Open cart"
                                        ref={cartBtnRef}
                                        onClick={() => setCartOpen(true)}
                                        className="relative cursor-pointer"
                                    >
                                        <CartIcon
                                            className="h-6 w-6"
                                            count={itemCount}
                                            onAdd={() => setCartOpen(true)}
                                        />
                                    </button>

                                    <CartDrawer
                                        open={cartOpen}
                                        setOpen={setCartOpen}
                                        anchorRef={cartBtnRef}
                                    />
                                </>
                                : null
                        }
                    </ul>

                </nav>

                {/* Mobile */}
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
                                    onClick={() => setOpen(false)}
                                >
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
