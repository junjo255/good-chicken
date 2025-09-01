'use client';
import React, { useMemo, useState } from "react";
import { CardItem, Category } from "@/app/lib/types";
import { CATEGORIES, ITEMS } from "@/app/components/Order/Menu/Menu";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface MenuCarouselProps {
    categories?: Category[];
    items?: CardItem[];
}

export default function MenuCarousel({
                                         categories = CATEGORIES,
                                         items = ITEMS,
                                     }: MenuCarouselProps) {
    const [activeCat, setActiveCat] = useState<string>("chicken");
    const [index, setIndex] = useState(1);

    const filtered = useMemo(() => {
        if (activeCat === "all") return items;
        if (activeCat === "new") return items.filter((i) => i.isNew);
        return items.filter((i) => i.category === (activeCat as any));
    }, [activeCat, items]);

    const safeIndex = filtered.length ? index % filtered.length : 0;

    const visible = useMemo(() => {
        if (!filtered.length) return [] as number[];
        const wrap = (i: number) => (i + filtered.length) % filtered.length;
        return [wrap(safeIndex - 1), wrap(safeIndex), wrap(safeIndex + 1)];
    }, [filtered.length, safeIndex]);

    const go = (dir: 1 | -1) => {
        if (!filtered.length) return;
        setIndex((n) => (n + dir + filtered.length) % filtered.length);
    };

    return (
        <section className="w-full text-[#423023]">
            <div
                className="aos-init aos-animate"
                data-aos="zoom-in"
                data-aos-delay="350"
                data-aos-duration="500"
            >
                <h2
                    className="section-title"
                >
                    Your New Favorite <span style={{color: "#C02A2E"}}>Korean Fried Chicken</span> Starts Here!
                </h2>

            </div>

            <div
                className="mx-auto max-w-6xl px-4 pt-8 mb-8 aos-init aos-animate"
                data-aos="zoom-in"
                data-aos-delay="350"
                data-aos-duration="500"
            >
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {categories
                        .filter((category) => category.id !== "all" && category.id !== "new")
                        .map((c) => {
                            const isActive = c.id === activeCat;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        setActiveCat(c.id);
                                        setIndex(1);
                                    }}
                                    className={
                                        "inline-flex items-center gap-2 rounded-full border border-[#C02A2E6B]  pb-4 px-5 py-3 text-sm font-semibold tracking-wider transition-all " +
                                        (isActive
                                            ? "bg-[#C02A2E] text-white cursor-pointer"
                                            : "bg-white text-[#C02A2E] hover:bg-[#C02A2E6B] hover:text-white hover:border-white cursor-pointer ")
                                    }
                                >
                                    {c.icon && <span className="grid place-items-center">{c.icon}</span>}
                                    <span>{c.label}</span>
                                </button>
                            );
                        })}
                </div>
            </div>

            <div
                className="mx-auto mt-18 max-w-6xl px-4 aos-init aos-animate"
                data-aos="zoom-in"
                data-aos-delay="350"
                data-aos-duration="500"
            >
                {!filtered.length ? (
                    <div
                        className="flex h-72 items-center justify-center rounded-xl border border-dashed border-[#e2d6c2] bg-white/50 text-sm text-neutral-600">
                        No items in this category yet.
                    </div>
                ) : (
                    <div className="relative flex items-center justify-between">
                        {/* Left arrow */}
                        <div className="mb-6 flex justify-start">
                            <button
                                aria-label="Previous"
                                onClick={() => go(-1)}
                                className="absolute z-30 -left-6 top-1/2 -translate-y-1/2 rounded-full border border-[#C02A2E] bg-white p-1 cursor-pointer  hover:scale-105 focus:outline-none aos-init aos-animate"
                            >
                                <ChevronLeft color="#C02A2E" size={40}/>
                            </button>
                        </div>

                        {/* Cards */}
                        <div className="grid w-full grid-cols-1 place-items-center gap-10 md:grid-cols-3 md:gap-20">
                            {visible.map((idx, col) => {
                                const item = filtered[idx];
                                const isCenter = col === 1;

                                const imageSizeClasses = isCenter
                                    ? "aspect-square md:max-w-[560px] lg:max-w-[640px]"
                                    : "aspect-square md:max-w-[220px] lg:max-w-[260px]";

                                const cardEmphasisClasses = isCenter
                                    ? "md:scale-105 lg:scale-110 md:z-20"
                                    : "hidden md:flex md:opacity-80 md:scale-90";

                                return (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col items-center text-center transition-all duration-300 overflow-hidden md:px-2 ${cardEmphasisClasses}`}
                                    >
                                        <div className={`relative mx-auto w-full ${imageSizeClasses}`}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="z-0 h-full w-full rounded-full object-cover"
                                            />
                                            {item.isNew && (
                                                <span
                                                    className="absolute left-4 top-4 rounded-full bg-[#FF365E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white ">
                                                  New
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            className={`mt-6 font-extrabold tracking-wide ${isCenter ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                                            {item.name}
                                        </div>

                                        <div
                                            className={`mt-3 max-w-md text-sm text-neutral-800 ${isCenter ? "" : "md:max-w-[16rem]"}`}>
                                            <div className="uppercase tracking-wide">{item.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right arrow */}
                        <button
                            aria-label="Next"
                            onClick={() => go(1)}
                            className="absolute -right-6 top-1/2 -translate-y-1/2 rounded-full border border-[#C02A2E] bg-white p-1 hover:scale-105 focus:outline-none cursor-pointer aos-init aos-animate"
                            data-aos="zoom-in"
                            data-aos-delay="350"
                            data-aos-duration="500"
                        >
                            <ChevronRight color="#C02A2E" size={40}/>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
