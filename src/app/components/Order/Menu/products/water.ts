import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const Water: ConfigProduct = {
    id: 'water',
    title: 'Bottled Water',
    image: 'https://unsplash.com/photos/a-bottle-of-water-sitting-on-top-of-a-table-aa3Js2ymB3k',
    attributes: [
        { id: 'heat', name: 'Type', values: ['Water'] },
        { id: 'part', name: 'Select', values: ['—'] },
        { id: 'size', name: 'Size', values: ['Bottle'] },
    ],
    variants: [{ sku: 'water-bottle', attrs: { heat: 'Water', part: '—', size: 'Bottle' }, priceCents: 1. }],
};
export default Water;
