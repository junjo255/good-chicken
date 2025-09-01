'use client';

import styles from "@/app/components/Hero/Hero.module.css";
import Link from "next/link";
import React from "react";

export default function OrderNow() {
    return (
        <section
            id="order"
            className="aboutaos-init aos-animate"
            data-aos="zoom-in"
            data-aos-delay="350"
            data-aos-duration="500"
        >
            <div className="container center">
                <h2 className="section-title">Order Now</h2>
                <p className="muted" style={{marginBottom: 18}}>
                    Craving that juicy goodness? We’ve got you.
                </p>
                <div
                    className={styles.actions}
                    data-aos="fade-up"
                    data-aos-delay="320"
                    data-aos-duration="650"
                >
                    <Link href="/order" className="cta">Order Now</Link>
                    <a href="#locations" className="cta ghost">Find a Location</a>
                </div>
            </div>
        </section>
    );
}
