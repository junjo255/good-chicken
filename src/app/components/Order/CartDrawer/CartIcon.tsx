import React from "react";
import {motion} from "framer-motion";


export function CartIcon({
                               count = 0,
                               onAdd,
                               size = 40,
                               className = "",
                               label = "Cart",
                           }: {
    count?: number;
    onAdd?: () => void;
    size?: number;
    className?: string;
    label?: string;
}) {
    const liveRef = React.useRef<HTMLDivElement | null>(null);


    React.useEffect(() => {
        if (liveRef.current) {
            liveRef.current.textContent = `${label} updated: ${count} ${count === 1 ? "item" : "items"}`;
        }
    }, [count, label]);


    return (
        <div className="relative inline-flex">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-cart-icon lucide-shopping-cart"
                >
                    <circle cx="8" cy="21" r="1"/>
                    <circle cx="19" cy="21" r="1"/>
                    <path
                        stroke="#3F3126"
                        d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
                    />
                </svg>


                {count > 0 && (
                    <motion.span
                        key={count}
                        initial={{scale: 1}}
                        animate={{scale: [1, 1.18, 1]}}
                        transition={{duration: 0.28, ease: "easeOut"}}
                        aria-hidden
                        className="absolute -top-2 -right-2 grid w-6 h-6 place-items-center rounded-full text-sm bg-[#AF3935] font-bold text-white"
                    >
                        {count}
                    </motion.span>
                )}


            <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true"/>
        </div>
    );
}