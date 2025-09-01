import {ConfigProduct} from "@/app/components/Order/Menu/OptionalModal";


const Crispy: ConfigProduct = {
    id: 'crispy',
    title: 'Crispy',
    image: '/fried-chicken.webp',
    ribbon: 'MILD or HOT',
    attributes: [
        { id: 'heat', name: 'Spices', values: ['Mild', 'Hot'] },
        { id: 'part', name: 'Parts', values: ['Wings', 'Drumsticks', 'Combo'] },
        { id: 'size', name: 'Sizes', values: ['8pcs', '16pcs', '3pcs', '6pcs', '1+3', '3+7'] },
    ],
    variants: [
        { sku: 'crispy-wings-8-m',  attrs: { heat:'Mild', part:'Wings',      size:'8pcs' },  priceCents: 12.9 },
        { sku: 'crispy-wings-8-h',  attrs: { heat:'Hot',  part:'Wings',      size:'8pcs' },  priceCents: 12.9 },
        { sku: 'crispy-wings-16-m', attrs: { heat:'Mild', part:'Wings',      size:'16pcs' }, priceCents: 24.9 },
        { sku: 'crispy-wings-16-h', attrs: { heat:'Hot',  part:'Wings',      size:'16pcs' }, priceCents: 24.9 },
        { sku: 'crispy-drum-3-m',   attrs: { heat:'Mild', part:'Drumsticks', size:'3pcs' },  priceCents: 10.9 },
        { sku: 'crispy-drum-3-h',   attrs: { heat:'Hot',  part:'Drumsticks', size:'3pcs' },  priceCents: 10.9 },
        { sku: 'crispy-drum-6-m',   attrs: { heat:'Mild', part:'Drumsticks', size:'6pcs' },  priceCents: 18.9 },
        { sku: 'crispy-drum-6-h',   attrs: { heat:'Hot',  part:'Drumsticks', size:'6pcs' },  priceCents: 18.9 },
        { sku: 'crispy-combo-1-3-m',attrs: { heat:'Mild', part:'Combo',      size:'1+3' },   priceCents: 10.9 },
        { sku: 'crispy-combo-1-3-h',attrs: { heat:'Hot',  part:'Combo',      size:'1+3' },   priceCents: 10.9 },
        { sku: 'crispy-combo-3-7-m',attrs: { heat:'Mild', part:'Combo',      size:'3+7' },   priceCents: 24.9 },
        { sku: 'crispy-combo-3-7-h',attrs: { heat:'Hot',  part:'Combo',      size:'3+7' },   priceCents: 24.9 },
    ],
};
export default Crispy;

