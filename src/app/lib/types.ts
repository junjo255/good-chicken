import React from "react";
import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";

export type ModifierChoice = {
    id: string;
    name: string;
    priceCents: number; // 0 if free
};


export type ModifierGroup = {
    id: string;
    name: string;
    min: number; // e.g., 0
    max: number; // e.g., 3
    choices: ModifierChoice[];
};


export type MenuItem = {
    id: string;
    name: string;
    description?: string;
    priceCents: number;
    imageUrl?: string;
    category: string;
    modifiers?: ModifierGroup[];
};


export type CartModifier = { id: string; name: string; priceCents: number };
export type CartItem = {
    id: string; // menu item id
    name: string;
    basePriceCents: number;
    quantity: number;
    modifiers: CartModifier[];
    notes?: string;
};


export type OrderType = 'pickup' | 'delivery';

export type IgMedia = {
    id: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
    caption?: string;
    like_count?: number;
    comments_count?: number;
};

export type IgProfile = {
    id: string;
    username: string;
    name?: string;
    profilePicUrl?: string;
    posts?: number | null;
    followers?: number | null;
    following?: number | null;
    isVerified?: boolean;
};

export type Location = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    orderUrl: string;
    mapsUrl: string;
    phone?: string;
    image?: string;
};

export type Category = { id: string; label: string; icon: React.ReactNode };

export type CardItem = {
    id: string;
    name: string;
    desc: string;
    image: string;
    isNew?: boolean;
    category: 'chicken' | 'hotDogs' | 'sides' | 'beverages';
    product?: ConfigProduct;
    startingPriceCents?: number;
};

export type StoreLocation = {
    id: string;
    brand: string;
    city: string;
    address: string;
    phone?: string;
    hours?: string;
    open: boolean;
    services?: string[];
    mapsEmbedUrl: string;
    deliveryPartners: Partial<Record<DeliveryPartner, string>>;
};


export enum DeliveryPartner {
    UberEats = "uberEats",
    Doordash = "doordash",
}