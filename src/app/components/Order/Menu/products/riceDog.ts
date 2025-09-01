import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";



const base = { Original: 4.49, 'Half & Half': 4.99, Mozzarella: 4.99 } as const;

const RiceDog: ConfigProduct = {
    id: 'rice-dog',
    title: 'Rice Dog',
    image: '/hot-dog.jpg',
    attributes: [
        { id: 'heat', name: 'Type', values: ['Original', 'Half & Half', 'Mozzarella'] }, // reuse "heat" slot
        { id: 'part', name: 'Additional Topping', values: ['None', 'Cheddar (+$1.00)'] },
        { id: 'size', name: 'Size', values: ['Single'] },
    ],
    variants: [
        // Original
        { sku: 'rice-original', attrs: { heat: 'Original', 'part': 'None', size: 'Single' },           priceCents: base.Original },
        { sku: 'rice-original-cheddar', attrs: { heat: 'Original', 'part': 'Cheddar (+$1.00)', size: 'Single' }, priceCents: base.Original + 1 },

        // Half & Half
        { sku: 'rice-half', attrs: { heat: 'Half & Half', 'part': 'None', size: 'Single' },            priceCents: base['Half & Half'] },
        { sku: 'rice-half-cheddar', attrs: { heat: 'Half & Half', 'part': 'Cheddar (+$1.00)', size: 'Single' },  priceCents: base['Half & Half'] + 1 },

        // Mozzarella
        { sku: 'rice-mozz', attrs: { heat: 'Mozzarella', 'part': 'None', size: 'Single' },             priceCents: base.Mozzarella },
        { sku: 'rice-mozz-cheddar', attrs: { heat: 'Mozzarella', 'part': 'Cheddar (+$1.00)', size: 'Single' },   priceCents: base.Mozzarella + 1 },
    ],
};

export default RiceDog;
