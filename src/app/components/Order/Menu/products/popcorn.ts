import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const Popcorn: ConfigProduct = {
    id: 'popcorn',
    title: 'Popcorn Chicken',
    image: 'https://media.istockphoto.com/id/470177926/photo/homemade-crispy-popcorn-chicken.jpg?s=1024x1024&w=is&k=20&c=KrKLuXFflBfx_Pn_XPxbqqfHYgbTEJpCDXgI3SnOGO0=',
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
