import { CartItem } from './types';


export function lineItemTotalCents(item: CartItem) {
    const mods = item.modifiers.reduce((sum, m) => sum + m.priceCents, 0);
    return (item.basePriceCents + mods) * item.quantity;
}


export function cartSubtotalCents(items: CartItem[]) {
    return items.reduce((sum, i) => sum + lineItemTotalCents(i), 0);
}


export function taxCents(subtotalCents: number, taxRateNumber: number) {
    return Math.round(subtotalCents * taxRateNumber);
}


export function totalCents(subtotal: number, tax: number) {
    return subtotal + tax;
}