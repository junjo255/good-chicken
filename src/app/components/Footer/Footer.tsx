'use client';

import {LOCATIONS} from "@/app/lib/locations";

type FooterLocation = { id: string; name: string; mapsUrl: string };

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                {/* Locations */}
                <nav aria-labelledby="footer-locations">
                    <h3 id="footer-locations" className="footer-title">Locations</h3>
                    <ul className="footer-list">
                        {LOCATIONS.map(loc => (
                            <li key={loc.id}>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                        loc.address
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {loc.city}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* General Info */}
                <nav aria-labelledby="footer-general">
                    <h3 id="footer-general" className="footer-title">General Info</h3>
                    <ul className="footer-list">
                        {/*<li><a href="/nutrition-and-allergens">Nutrition &amp; Allergens</a></li>*/}
                        <li><a href="/support">Customer Support</a></li>
                        <li><a href="/legal">Legal</a></li>
                        <li><a href="/franchising">Franchising</a></li>
                    </ul>
                </nav>

                {/* Media */}
                <div aria-labelledby="footer-media">
                    <h3 id="footer-media" className="footer-title">Media</h3>
                    <div className="footer-social">
                        <a
                            href="https://instagram.com/good_chicken_montclair"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className="ig-link"
                            title="Follow us on Instagram"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                                <path fill="currentColor"
                                      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.75a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 18 6.75z"/>
                            </svg>
                            <span className="visually-hidden">Instagram</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="container footer-legal">
                © 2025 GoodChickenUSA, Inc. All rights reserved.
            </div>
        </footer>
    );
}
