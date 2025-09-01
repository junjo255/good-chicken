'use client';
import { useEffect, useState } from 'react';
import type { CartItem, CartModifier } from './types';


const KEY = 'restaurant_cart_v1';


export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [tipCents, setTipCents] = useState(0);


    useEffect(() => {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setItems(parsed.items || []);
                setTipCents(parsed.tipCents || 0);
            }
        } catch {}
    }, []);


    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify({ items, tipCents }));
    }, [items, tipCents]);


    function addItem(id: string, name: string, basePriceCents: number, modifiers: CartModifier[] = []) {
        setItems(prev => [...prev, { id, name, basePriceCents, quantity: 1, modifiers }]);
    }


    function updateItem(index: number, next: Partial<CartItem>) {
        setItems(prev => prev.map((it, i) => (i === index ? { ...it, ...next } : it)));
    }


    function removeItem(index: number) {
        setItems(prev => prev.filter((_, i) => i !== index));
    }


    function clear() {
        setItems([]);
        setTipCents(0);
    }


    return { items, tipCents, setTipCents, addItem, updateItem, removeItem, clear };
}