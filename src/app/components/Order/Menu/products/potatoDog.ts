import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";

const base = { Original: 5.49, 'Half & Half': 5.99, Mozzarella: 5.99 } as const;

const PotatoDog: ConfigProduct = {
    id: 'potato-dog',
    title: 'Potato Dog',
    image: '/hot-dog.jpg',
    attributes: [
        { id: 'heat', name: 'Type', values: ['Original', 'Half & Half', 'Mozzarella'] },
        { id: 'part', name: 'Additional Topping', values: ['None', 'Cheddar (+$1.00)'] },
        { id: 'size', name: 'Size', values: ['Single'] },
    ],
    variants: [
        { sku: 'potato-original', attrs: { heat: 'Original', 'part': 'None', size: 'Single' },           priceCents: base.Original },
        { sku: 'potato-original-cheddar', attrs: { heat: 'Original', 'part': 'Cheddar (+$1.00)', size: 'Single' }, priceCents: base.Original + 1 },

        { sku: 'potato-half', attrs: { heat: 'Half & Half', 'part': 'None', size: 'Single' },            priceCents: base['Half & Half'] },
        { sku: 'potato-half-cheddar', attrs: { heat: 'Half & Half', 'part': 'Cheddar (+$1.00)', size: 'Single' },  priceCents: base['Half & Half'] + 1 },

        { sku: 'potato-mozz', attrs: { heat: 'Mozzarella', 'part': 'None', size: 'Single' },             priceCents: base.Mozzarella },
        { sku: 'potato-mozz-cheddar', attrs: { heat: 'Mozzarella', 'part': 'Cheddar (+$1.00)', size: 'Single' },   priceCents: base.Mozzarella + 1 },
    ],
};

export default PotatoDog;
