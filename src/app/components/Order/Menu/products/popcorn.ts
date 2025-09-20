import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const Popcorn: ConfigProduct = {
    id: 'popcorn',
    title: 'Popcorn Chicken',
    image: 'https://cdn.smartonlineorder.com/wp-content/uploads/sites/3370/2021/09/popcorn.png',
    attributes: [
        { id: 'heat', name: 'Style', values: ['Crispy', 'Glazed'] }, // reuse heat slot
        { id: 'part', name: 'Type', values: ['Popcorn'] },
        { id: 'size', name: 'Sizes', values: ['Small', 'Large'] },
    ],
    variants: [
        { sku:'popcorn-crispy-s', attrs:{ heat:'Crispy', part:'Popcorn', size:'Small' }, priceCents: 9.99 },
        { sku:'popcorn-crispy-l', attrs:{ heat:'Crispy', part:'Popcorn', size:'Large' }, priceCents: 16.99 },
        { sku:'popcorn-glazed-s', attrs:{ heat:'Glazed', part:'Popcorn', size:'Small' }, priceCents: 12.99 },
        { sku:'popcorn-glazed-l', attrs:{ heat:'Glazed', part:'Popcorn', size:'Large' }, priceCents: 18.99 },
    ],
};
export default Popcorn;
