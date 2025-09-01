import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const items = [
    { name: 'Lemonade', price: 4.99 },
    { name: 'Blue Lemonade', price: 5.49 },
    { name: 'Strawberry Lemonade', price: 5.49 },
] as const;

const Lemonade: ConfigProduct = {
    id: 'lemonade',
    title: 'Lemonade (Carbonated)',
    image: '/fried-chicken.webp', // swap to lemonade photo
    attributes: [
        { id: 'heat', name: 'Flavor', values: items.map(i => i.name) },
        { id: 'part', name: 'Type', values: ['Carbonated'] },
        { id: 'size', name: 'Size', values: ['Regular'] },
    ],
    variants: items.map(i => ({
        sku: `lemonade-${i.name}`,
        attrs: { heat: i.name, part: 'Carbonated', size: 'Regular' },
        priceCents: i.price,
    })),
};
export default Lemonade;
