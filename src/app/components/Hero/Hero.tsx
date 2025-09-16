'use client';
import React, {useEffect, useState} from "react";
import styles from "./Hero.module.css";
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.hero} role="banner">
            <div className={`${styles.inner} container`}>
                <p
                    className={styles.tagline}
                    data-aos="fade-up"
                    data-aos-duration="500"
                >
                    wait until you say,
                </p>

                <h1
                    className={styles.titleTop}
                    data-aos="fade-up"
                    data-aos-delay="120"
                    data-aos-duration="650"
                >
                    THAT WAS SOME
                </h1>

                <h1
                    className={styles.titleMain}
                    data-aos="fade-up"
                    data-aos-delay="220"
                    data-aos-duration="700"
                >
                    GOOD CHICKEN
                </h1>

                <div
                    className={styles.actions}
                    data-aos="fade-up"
                    data-aos-delay="220"
                    data-aos-duration="700"
                    data-aos-offset="0"
                    data-aos-anchor-placement="top-bottom"
                >
                    <Link href="/order" className="cta">Order Now</Link>
                    <Link href="/#FindUs" className="cta ghost">Find a Location</Link>
                </div>
            </div>
        </section>
    );
}
