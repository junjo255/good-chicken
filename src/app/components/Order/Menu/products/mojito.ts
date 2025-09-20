import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const items = [
    { name: 'Tropical Mango Mojito', price: 5.49 },
    { name: 'Strawberry Mojito', price: 5.49 },
] as const;

const Mojito: ConfigProduct = {
    id: 'mojito',
    title: 'Mojito (Carbonated)',
    image: 'https://cdn.smartonlineorder.com/wp-content/uploads/sites/3370/2021/09/Tropical-Mango-Mojito.jpg', // swap to mojito photo
    attributes: [
        { id: 'heat', name: 'Flavor', values: items.map(i => i.name) },
        { id: 'part', name: 'Type', values: ['Carbonated'] },
        { id: 'size', name: 'Size', values: ['Regular'] },
    ],
    variants: items.map(i => ({
        sku: `mojito-${i.name}`,
        attrs: { heat: i.name, part: 'Carbonated', size: 'Regular' },
        priceCents: i.price,
    })),
};
export default Mojito;
