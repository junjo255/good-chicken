import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";



const flavors = ['Peach Green Tea', 'Dragon Fruit Green Tea', 'Tropical Mango Black Tea'] as const;

const IcedTea: ConfigProduct = {
    id: 'iced-tea',
    title: 'Iced Tea',
    image: '/fried-chicken.webp', // swap to tea photo
    attributes: [
        { id: 'heat', name: 'Flavor', values: [...flavors] },                          // reuse heat as "Flavor"
        { id: 'part', name: 'Additional Topping', values: ['None', 'Lychee Jelly (+$1.00)'] },
        { id: 'size', name: 'Size', values: ['Regular'] },
    ],
    variants: [
        ...flavors.map((fl) => ({
            sku: `tea-${fl}-none`,
            attrs: { heat: fl, part: 'None', size: 'Regular' },
            priceCents: 4.49,
        })),
        ...flavors.map((fl) => ({
            sku: `tea-${fl}-lychee`,
            attrs: { heat: fl, part: 'Lychee Jelly (+$1.00)', size: 'Regular' },
            priceCents: 4.49 + 1,
        })),
    ],
};
export default IcedTea;
