'use client';
import {useState, useEffect, useRef} from 'react';
import styles from './Header.module.css';

const navItems = [
    {label: 'ORDER NOW', href: '/order', emphasize: true},
    {label: 'LOCATIONS', href: '#FindUs'},
    {label: 'MENU', href: '#Menu'},
    {label: 'CATERING', href: '#Contact'},
    {label: 'FRANCHISING', href: '#Contact'},
    {label: 'CONTACT US', href: '#Contact'},
];

export default function Header() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [noScroll, setNoScroll] = useState(false);

    const mid = Math.ceil(navItems.length / 2);
    const leftItems = navItems.slice(0, mid);
    const rightItems = navItems.slice(mid);

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
        const onScroll = () => {
            const heroHeight = (document.querySelector("section[role='banner']")?.scrollHeight ?? 0) - 10;
            setScrolled(window.scrollY > heroHeight);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const update = () => {
            const root = document.documentElement;
            const body = document.body;
            const scrollH = Math.max(root.scrollHeight, body.scrollHeight);
            const clientH = root.clientHeight;
            // tiny fudge factor for sub-pixel rounding
            setNoScroll(scrollH <= clientH + 1);
        };

        update();                 // on mount
        const ro = new ResizeObserver(update);
        ro.observe(document.documentElement);
        window.addEventListener("resize", update);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, []);

    const darkAssets = scrolled || noScroll;

    return (
        <header
            className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${!scrolled && noScroll ? styles.headerNoScroll : ""}`}
            id="top"
            data-aos="fade-down"
            data-aos-duration="400"
        >
            <div className={styles.inner}>
                <div className={styles.brandRow}>
                    <a href="#" className={styles.brand} aria-label="BBQ Chicken home">
                        <img
                            width="85" height="85"
                            src={darkAssets ? "/Good-Chicken-logo.png" : "/Good-Chicken-white-logo.png"}
                            alt="Good Chicken"
                        />
                    </a>

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
                             src={darkAssets ? "/Good-Chicken-logo.png" : "/Good-Chicken-white-logo.png"}
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
