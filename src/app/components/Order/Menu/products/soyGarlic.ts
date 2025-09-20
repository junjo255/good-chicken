import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const SoyGarlic: ConfigProduct = {
    id: 'soy-garlic',
    title: 'Soy Garlic',
    image: 'https://cdn.smartonlineorder.com/wp-content/uploads/sites/3370/2021/09/soy-garlic-hot.jpg',
    ribbon: 'MILD or HOT',
    attributes: [
        { id: 'heat', name: 'Spices', values: ['Mild', 'Hot'] },
        { id: 'part', name: 'Parts', values: ['Wings', 'Drumsticks', 'Combo'] },
        { id: 'size', name: 'Sizes', values: ['8pcs', '16pcs', '3pcs', '6pcs', '1+3', '3+7'] },
    ],
    variants: [
        { sku:'soy-wings-8-m',  attrs:{ heat:'Mild', part:'Wings',      size:'8pcs' },  priceCents: 14.99 },
        { sku:'soy-wings-8-h',  attrs:{ heat:'Hot',  part:'Wings',      size:'8pcs' },  priceCents: 14.99 },
        { sku:'soy-wings-16-m', attrs:{ heat:'Mild', part:'Wings',      size:'16pcs' }, priceCents: 28.99 },
        { sku:'soy-wings-16-h', attrs:{ heat:'Hot',  part:'Wings',      size:'16pcs' }, priceCents: 28.99 },
        { sku:'soy-drum-3-m',   attrs:{ heat:'Mild', part:'Drumsticks', size:'3pcs' },  priceCents: 12.99 },
        { sku:'soy-drum-3-h',   attrs:{ heat:'Hot',  part:'Drumsticks', size:'3pcs' },  priceCents: 12.99 },
        { sku:'soy-drum-6-m',   attrs:{ heat:'Mild', part:'Drumsticks', size:'6pcs' },  priceCents: 20.99 },
        { sku:'soy-drum-6-h',   attrs:{ heat:'Hot',  part:'Drumsticks', size:'6pcs' },  priceCents: 20.99 },
        { sku:'soy-combo-1-3-m',attrs:{ heat:'Mild', part:'Combo',      size:'1+3' },   priceCents: 12.99 },
        { sku:'soy-combo-1-3-h',attrs:{ heat:'Hot',  part:'Combo',      size:'1+3' },   priceCents: 12.99 },
        { sku:'soy-combo-3-7-m',attrs:{ heat:'Mild', part:'Combo',      size:'3+7' },   priceCents: 28.99 },
        { sku:'soy-combo-3-7-h',attrs:{ heat:'Hot',  part:'Combo',      size:'3+7' },   priceCents: 28.99 },
    ],
};
export default SoyGarlic;
