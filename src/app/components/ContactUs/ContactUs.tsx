'use client';

import styles from './ContactUs.module.css';

export default function ContactUs() {
    return (
        <section
            id="Contact"
            className="about pt-20 pb-20"
            data-aos="fade-up"
        >
            <div className={styles.container}>
                <h2
                    className="section-title"
                    data-aos="fade-up"
                    data-aos-duration="600"
                >
                    Contact Us
                </h2>
                <p className={`${styles.center} ${styles.muted}`}>
                    Questions, feedback, or large orders? We’d love to hear from you.
                </p>
                <div className={styles.cols2}>
                    <div className="card" style={{maxWidth: "500px"}}>
                        <div className="card-body">
                            <p className={styles.muted} style={{ marginTop: 6 }}>
                                <a href="mailto:goodchickenusa@gmail.com">
                                    goodchickenusa@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
