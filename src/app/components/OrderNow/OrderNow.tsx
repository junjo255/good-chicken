'use client';

import styles from "@/app/components/Hero/Hero.module.css";
import Link from "next/link";
import React from "react";

export default function OrderNow() {
    return (
        <section
            id="order"
            className="aboutaos-init aos-animate mt-10 pt-25 pb-15"
            data-aos="zoom-in"
            data-aos-delay="350"
            data-aos-duration="500"
        >
            <div className="container center">
                {/*<h2 className="section-title">Order Now</h2>*/}
                <h3 className="order-pt"
                    style={{
                        marginBottom: 18,
                        fontFamily: "Fontania, sans-serif",
                        color: "#AF3935",
                        fontSize: "70px"
                    }}
                >
                    Craving that juicy goodness? <br/> <span style={{color: "#E9BC46", fontSize: "80px"}}>We’ve got you.</span>
                </h3>
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
