import axios from 'axios';
import {NextResponse} from 'next/server';


// LOCATIONS_URL=https://your-pos-or-db.example.com/locations
// NEXT_PUBLIC_BASE_URL=http://localhost:3000
export async function GET() {
    // try {
    //     const upstream = process.env.LOCATIONS_URL;
    //     if (upstream) {
    //         const { data } = await axios.get(upstream, { timeout: 8000 });
    //         return NextResponse.json({ locations: data });
    //     }
    // } catch (err) {
    //     console.error('Upstream LOCATIONS_URL failed, serving static:', err);
    // }

    const locations = [
        {
            id: 'montclair',
            name: 'Montclair',
            address: '114 Bloomfield Ave. Montclair, NJ 07042',
            lat: 40.8136,
            lng: -74.214,
            orderUrl: 'https://goodchickenusa.com/',
            mapsUrl: 'https://maps.app.goo.gl/xJvhZdaU3xHMMqvz7',
            phone: '',
            image: '/montclair.webp'
        },
        {
            id: 'jerseyCity',
            name: 'Jersey City',
            address: '414 Gand St Jersey City, NJ',
            lat: 40.8136,
            lng: -74.214,
            orderUrl: 'https://goodchickenusa.com/',
            mapsUrl: 'https://maps.app.goo.gl/',
            phone: '',
            image: '/montclair.webp'

        }
    ];

    return NextResponse.json({locations});
}
