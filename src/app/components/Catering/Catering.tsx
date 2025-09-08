'use client';

export default function Catering() {
    return (
        <section
            id="catering"
            className="about pt-20"
            data-aos="fade-up"
        >
            <div className="container">
                <h2
                    className="section-title"
                    data-aos="fade-up"
                    data-aos-duration="600"
                >
                    Catering
                </h2>

                <p className="center muted"
                   data-aos="fade-up"
                   data-aos-delay="120">
                    Feeding a crowd? From game days to office lunches, we’ve got platters and family packs.
                </p>

                <div className="center" style={{ marginTop: 18 }}
                     data-aos="zoom-in"
                     data-aos-delay="220">
                    <a className="cta" href="https://goodchickenusa.com/" target="_blank" rel="noreferrer">
                        Get a Catering Quote
                    </a>
                </div>
            </div>
        </section>
    );
}
