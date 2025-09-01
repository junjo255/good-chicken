import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";

const Soda: ConfigProduct = {
    id: 'soda',
    title: 'Soda',
    image: '/fried-chicken.webp', // swap to soda image
    attributes: [
        { id: 'heat', name: 'Type', values: ['Soda'] },
        { id: 'part', name: 'Select', values: ['—'] },
        { id: 'size', name: 'Size', values: ['Can'] },
    ],
    variants: [{ sku: 'soda-can', attrs: { heat: 'Soda', part: '—', size: 'Can' }, priceCents: 2.0 }],
};
export default Soda;
