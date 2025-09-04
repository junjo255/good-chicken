'use client';
// import React from "react";
//
// export default function AboutUs() {
//     return (
//         <section id="about" className="about" data-aos="fade-up">
//             <div className="container">
//                 <h2 className="section-title"
//                     data-aos="fade-up"
//                     data-aos-duration="600">
//                     Welcome to Good Chicken
//                 </h2>
//
//                 <p className="center muted"
//                    data-aos="fade-up"
//                    data-aos-delay="120">
//                     Motivated to prepare and provide the most delicious and healthiest
//                     premium high quality fried chicken!
//                 </p>
//
//                 <p className="center muted"
//                    data-aos="fade-up"
//                    data-aos-delay="200">
//                     We are thirsty to satisfy your family and friends’ cravings for some
//                     GOOD CHICKEN.
//                 </p>
//
//                 <p className="center muted"
//                    data-aos="fade-up"
//                    data-aos-delay="280">
//                     Call us today to order our chicken because it won’t be your last!
//                 </p>
//             </div>
//         </section>
//     );
// }


import React from "react";
import Marquee from "react-fast-marquee";

/**
 * Pixel-faithful replication of the provided hero layout.
 * - Huge left headline (yellow) on brick-red background
 * - Right column: white copy + pill CTA
 * - Three images with specific shapes (rounded, oval mask, rounded)
 *
 * Drop this into a Next.js project (Tailwind recommended) or any React app.
 * You can swap image URLs via props.
 */

type Props = {
    leftImage?: string;   // interior/store image
    centerImage?: string; // product image (on beige oval)
    rightImage?: string;  // storefront image at night
};

export default function AboutUs({
                                    leftImage = "https://media.istockphoto.com/id/2150279684/photo/delicious-juicy-chicken-wings-baked-on-the-grill-with-salt-spices-and-herbs.jpg?s=2048x2048&w=is&k=20&c=2xKsnybN7ukPS4--ACdgYgB_EAqk-McayXxLWTnTnVI=",
                                    centerImage = "https://media.istockphoto.com/id/2155391736/photo/american-style-fried-chicken-wings-on-a-plate.jpg?s=2048x2048&w=is&k=20&c=RciGI-LPIPfOp-w3a3p__6pW_KU21JqY-eFqNkoAJPw=",
                                    rightImage = "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop",
                                }: Props) {
    return (
        <section
            className="w-full"
            style={{
                backgroundColor: "#AF3935",
            }}
        >
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-14 pb-16 relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Headline */}
                    <div className="lg:col-span-6">
                        <h1
                            className="font-extrabold leading-[0.95] tracking-tight"
                            style={{
                                fontSize: "clamp(44px, 9vw, 96px)",
                                color: "#F4BB1C",
                                textTransform: "uppercase",
                            }}
                        >
                            <span className="block">Crisp,</span>
                            <span className="block">Golden,</span>
                            <span className="block">Unforgettable</span>
                        </h1>
                    </div>

                    {/* Copy + CTA */}
                    <div className="lg:col-span-6 lg:pl-8">
                        <p className="text-white/95 text-base md:text-lg leading-relaxed max-w-[560px]"
                           style={{fontFamily: "GothamRnd-Light "}}>
                           <span
                               style={{
                                   color: "#E9BC46",
                                   fontSize: "1.7rem",
                                   fontWeight: 500,
                                   fontFamily: "GothamSSM-Medium"
                               }}
                           >
                               Welcome to Good Chicken!
                           </span>
                            <br/>
                            Motivated to prepare and provide the most delicious and healthiest
                            premium high quality fried chicken!
                            <br/>
                            We are thirsty to satisfy your family and friends’ cravings for some
                            <span
                                style={{
                                    color: "#E9BC46",
                                    fontWeight: 500,
                                    fontFamily: "GothamSSM-Medium"
                                }}
                                >
                                {` GOOD CHICKEN.`}
                            </span>
                        </p>
                    </div>
                </div>

                {/* IMAGES ROW */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    {/*<Marquee*/}
                    {/*    speed={20}*/}
                    {/*    style={{fontSize: "100px", color:"#F4BB1C"}}*/}
                    {/*>*/}
                    <div className="lg:col-span-5">
                        <div className="overflow-hidden rounded-[24px] shadow-sm">
                            <img src={leftImage} alt="Interior" className="w-full h-auto object-cover"/>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex items-end justify-center">
                        <div
                            className="relative w-full max-w-[560px] aspect-[5/3]"
                            // style={{
                            //     backgroundColor: "#E8DCCB", // beige oval
                            //     borderRadius: "999px / 360px", // ellipse
                            // }}
                        >
                            <img
                                src={centerImage}
                                alt="Product"
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[84%] h-auto object-contain"
                                style={{filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))"}}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-[24px] shadow-sm">
                            <img src={rightImage} alt="Storefront" className="w-full h-auto object-cover"/>
                        </div>
                    </div>
                    {/*</Marquee>*/}

                </div>
            </div>
        </section>
    );
}
