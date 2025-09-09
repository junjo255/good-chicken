'use client';

import React, {useMemo, useState} from 'react';
import Link from 'next/link';
import {Menu as MenuIcon, Sparkles, Drumstick, Package2, Utensils, Plus} from 'lucide-react';
import Crispy from '@/app/components/Order/Menu/products/crispy';
import Popcorn from '@/app/components/Order/Menu/products/popcorn';
import SoyGarlic from '@/app/components/Order/Menu/products/soyGarlic';
import Glazed from '@/app/components/Order/Menu/products/glazed';
import OptionModal, {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";
import PotatoDog from "@/app/components/Order/Menu/products/potatoDog";
import RiceDog from "@/app/components/Order/Menu/products/riceDog";
import Lemonade from "@/app/components/Order/Menu/products/lemonade";
import Mojito from "@/app/components/Order/Menu/products/mojito";
import Water from "@/app/components/Order/Menu/products/water";
import Soda from "@/app/components/Order/Menu/products/soda";
import IcedTea from "@/app/components/Order/Menu/products/icedTea";
import {CardItem, CartModifier, Category, StoreLocation} from "@/app/lib/types";
import {useCart} from "@/app/lib/cart";
import {useRouter} from "next/navigation";

export const CATEGORIES: Category[] = [
    {id: 'all', label: 'ALL', icon: <MenuIcon className="h-4 w-4"/>},
    {id: 'new', label: 'New', icon: <Sparkles className="h-4 w-4"/>},
    {id: 'chicken', label: 'Korean Fried Chicken', icon: <Drumstick className="h-4 w-4"/>},
    {id: 'hotDogs', label: 'Hot Dog', icon: <Package2 className="h-4 w-4"/>},
    {id: 'beverages', label: 'Beverage', icon: <Drumstick className="h-4 w-4"/>},
    {id: 'sides', label: 'Sides', icon: <Utensils className="h-4 w-4"/>},
    {id: 'dipping', label: 'Dipping Sauce', icon: <Utensils className="h-4 w-4"/>}
];

export const ITEMS: CardItem[] = [
    {
        id: 'crispy',
        name: 'Crispy Chicken',
        desc: 'Wings, Drumsticks, or Combo · Mild/Hot',
        image: '/fried-chicken.webp',
        isNew: true,
        category: 'chicken',
        product: Crispy,
        startingPriceCents: Math.min(...Crispy.variants.map(v => v.priceCents)),
    },
    {
        id: 'popcorn',
        name: 'Popcorn Chicken',
        desc: 'Crispy or Glazed · Small/Large',
        image: 'https://media.istockphoto.com/id/470177926/photo/homemade-crispy-popcorn-chicken.jpg?s=1024x1024&w=is&k=20&c=KrKLuXFflBfx_Pn_XPxbqqfHYgbTEJpCDXgI3SnOGO0=',
        category: 'chicken',
        product: Popcorn,
        startingPriceCents: Math.min(...Popcorn.variants.map(v => v.priceCents)),
    },
    {
        id: 'soy-garlic',
        name: 'Soy Garlic Chicken',
        desc: 'Wings, Drumsticks, or Combo · Mild/Hot',
        image: '/fried-chicken.webp',
        category: 'chicken',
        product: SoyGarlic,
        startingPriceCents: Math.min(...SoyGarlic.variants.map(v => v.priceCents)),
    },
    {
        id: 'glazed',
        name: 'Glazed Chicken',
        desc: 'Wings, Drumsticks, or Combo · Mild/Hot',
        image: '/fried-chicken.webp',
        category: 'chicken',
        product: Glazed,
        startingPriceCents: Math.min(...Glazed.variants.map(v => v.priceCents)),
    },
    {
        id: 'rice-dog',
        name: 'Rice Dog',
        desc: 'Original / Half & Half / Mozzarella · + Cheddar (+$1)',
        image: '/hot-dog.jpg',
        category: 'hotDogs',
        product: RiceDog,
        startingPriceCents: Math.min(...RiceDog.variants.map(v => v.priceCents)),
    },
    {
        id: 'potato-dog',
        name: 'Potato Dog',
        desc: 'Original / Half & Half / Mozzarella · + Cheddar (+$1)',
        image: '/hot-dog.jpg',
        category: 'hotDogs',
        product: PotatoDog,
        startingPriceCents: Math.min(...PotatoDog.variants.map(v => v.priceCents)),
    },
    {
        id: 'iced-tea',
        name: 'Iced Tea',
        desc: 'Peach Green / Dragon Fruit Green / Tropical Mango Black · + Lychee Jelly (+$1)',
        image: 'http://media.istockphoto.com/id/2166552535/photo/refreshing-summer-lychee-tea-in-a-glass-on-wooden-table.jpg?s=1024x1024&w=is&k=20&c=YfPNmanP468YxYpMPAW92jB4AEtYG4hoOabooz8adFI=',
        category: 'beverages',
        product: IcedTea,
        startingPriceCents: Math.min(...IcedTea.variants.map(v => v.priceCents)),
    },
    {
        id: 'lemonade',
        name: 'Lemonade (Carbonated)',
        desc: 'Lemonade / Blue / Strawberry',
        image: 'http://media.istockphoto.com/id/2225267085/photo/enjoying-a-refreshing-mint-lime-drink-in-the-embracing-nature-surrounding-us-outside.jpg?s=1024x1024&w=is&k=20&c=vq9fZArvuwUHdIMVcGrX5otywU1ZScsb58ybr8JoA0A=',
        category: 'beverages',
        product: Lemonade,
        startingPriceCents: Math.min(...Lemonade.variants.map(v => v.priceCents)),
    },
    {
        id: 'mojito',
        name: 'Mojito (Carbonated)',
        desc: 'Tropical Mango / Strawberry',
        image: 'https://media.istockphoto.com/id/108269364/photo/mojito.jpg?s=1024x1024&w=is&k=20&c=CXFFJh04tF8SfuBPtMtGlwDtmv0tFsWeeJ0-LUyMPuM=',
        category: 'beverages',
        product: Mojito,
        startingPriceCents: Math.min(...Mojito.variants.map(v => v.priceCents)),
    },
    {
        id: 'water',
        name: 'Bottled Water',
        desc: '',
        image: 'http://media.istockphoto.com/id/185072125/photo/bottle-of-spring-water.jpg?s=1024x1024&w=is&k=20&c=D86eKU5KwXC7pVlwHcP1sGQ9vbYA1sKAp3Pu05FDm9Y=',
        category: 'beverages',
        product: Water,
        startingPriceCents: Math.min(...Water.variants.map(v => v.priceCents)),
    },
    {
        id: 'soda',
        name: 'Soda',
        desc: '',
        image: 'https://media.istockphoto.com/id/458464735/photo/coke.jpg?s=1024x1024&w=is&k=20&c=Fgw7bpBiVsaVnhun9uNodZhXEJVCnLLbwKMFj7p-mCk=',
        category: 'beverages',
        product: Soda,
        startingPriceCents: Math.min(...Soda.variants.map(v => v.priceCents)),
    },

];

function Price({cents}: { cents: number }) {
    return <span className="font-semibold tracking-tight">
            {cents.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
         </span>;
}

function NewBadge() {
    return (
        <span
            className="absolute left-3 top-3 rounded-full bg-[#ff8a00] px-2 py-[2px] text-xs font-bold text-white shadow-sm">
          NEW
        </span>
    );
}

export default function OrderingMenu()  {
    const [active, setActive] = useState<string>('all');
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<ConfigProduct | null>(null);
    const [sel, setSel] = useState<Partial<{ heat: string; part: string; size: string }>>({});
    const {addItem} = useCart();

    const filtered = useMemo(() => {
        if (active === 'all') return ITEMS;
        if (active === 'new') return ITEMS.filter(i => i.isNew);
        return ITEMS.filter(i => i.category === (active as any));
    }, [active]);

    function openPicker(product: ConfigProduct) {
        setCurrent(product);
        setSel({});
        setOpen(true);
    }

    function handleAdd({
                           sku,
                           name,
                           priceCents,
                       }: {
        sku: string;
        name: string;
        priceCents: number;
    }) {
        // Construct modifiers based on selections
        const modifiers: CartModifier[] = [];

        if (sel.part) {
            modifiers.push({
                id: "part",
                name: sel.part,
                priceCents: 0,
            });
        }

        if (sel.heat) {
            modifiers.push({
                id: "heat",
                name: sel.heat,
                priceCents: 0,
            });
        }

        // Static example modifiers to replicate screenshot
        modifiers.push(
            {
                id: "included",
                name: "Included sides",
                priceCents: 0,
            },
            {
                id: "salsa",
                name: "Fresh Tomato Salsa",
                priceCents: 0,
            }
        );

        addItem(sku, name, priceCents, modifiers);
        setOpen(false);
    }

    return (
        <main className="mx-auto max-w-6xl px-6">
            <div
                className="mx-auto max-w-6xl px-4 mb-8 aos-init aos-animate"
                data-aos="zoom-in"
                data-aos-delay="350"
                data-aos-duration="500"
            >
                <div
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    {CATEGORIES
                        .map((c) => {
                            const on = c.id === active;
                            return (
                                <>
                                <button
                                    key={c.id}
                                    onClick={() => setActive(c.id)}

                                    className={
                                        "flex-wrap pr-3 sm:inline-flex items-center text-yellow sm:gap-2 pb-1 sm:pb-4 sm:px-5 sm:py-3 text-sm font-semibold tracking-wider transition-all " +
                                        (on
                                            ? "text-[#AF3935] cursor-pointer"
                                            : "text-[#6b7280] hover:text-[#AF3935] hover:border-white cursor-pointer ")
                                    }
                                >
                                    {c.icon && <span className="grid place-items-center">{c.icon}</span>}
                                    <span>{c.label}</span>
                                </button>
                                </>

                            );
                        })}
                </div>
            </div>

            <section className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3" style={{padding: 0, margin: 0}}>
                {filtered.map(item => (
                    <article key={item.id} className="group">
                        <div className="relative overflow-hidden rounded-[14px] border border-neutral-200 bg-white">
                            <div className="relative">
                                <img src={item.image} alt={item.name} className="h-[220px] w-full object-cover"/>
                                {item.isNew && <NewBadge/>}
                            </div>

                            <div className="px-3 pb-5 pt-4">
                                <h3 className="mb-1 text-[18px] font-semibold leading-snug">{item.name}</h3>
                                <p className="min-h-[40px] whitespace-pre-line text-[15px] leading-5 text-[#262626]">{item.desc}</p>

                                <div className="mt-3 flex items-center justify-between">
                                    <div className="text-[18px]">
                                        {item.startingPriceCents != null ? (
                                            <Price cents={item.startingPriceCents}/>
                                        ) : (
                                            <span className="font-semibold">$—</span>
                                        )}
                                    </div>

                                    {item.product ? (
                                        <button
                                            onClick={() => openPicker(item.product!)}
                                            className="inline-flex w-8 h-8 items-center justify-center p-0 rounded-full border border-[#262626] bg-white text-[12px] leading-none transition-colors hover:bg-[#AF3935] hover:border-[#AF3935] hover:cursor-pointer"
                                            aria-label="Add"
                                        >
                                            <Plus
                                                size={17}
                                                strokeWidth={3}
                                                className="transition-colors text-[#3F3126] group-hover:text-[#fff] "
                                                aria-hidden="true"
                                            />
                                        </button>
                                    ) : (
                                        <Link
                                            href="#"
                                            className="inline-flex w-8 h-8 items-center justify-center p-0 rounded-full border border-[#AF3935] bg-[#3F3126] text-[12px] leading-none transition-colors hover:bg-[#AF3935] hover:border-[#AF3935] hover:cursor-pointer"
                                            aria-label="Add"
                                        >
                                            <Plus
                                                size={17}
                                                strokeWidth={3}
                                                className="transition-colors text-[#3F3126] group-hover:text-[#fff]"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            {current && (
                <OptionModal
                    open={open}
                    onClose={() => setOpen(false)}
                    product={current}
                    sel={sel}
                    setSel={setSel}
                    onAdd={handleAdd}
                />
            )}
        </main>
    );
}
