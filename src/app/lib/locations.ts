import {DeliveryPartner, StoreLocation} from "@/app/lib/types";

export const LOCATIONS: StoreLocation[] = [
    {
        id: "montclair_01",
        brand: "Good Chicken",
        city: "Montclair",
        address: "114 Bloomfield Ave, Montclair, NJ 07042",
        phone: "+1 (973) 337-5075",
        hours: "10am ~ 10pm",
        open: true,
        services: ["Dine-in", "Take out"],
        mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6039.864532511089!2d-74.2105586!3d40.807482199999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2556860800fd9%3A0x7c8e4fce5d9aa643!2sGood%20Chicken!5e0!3m2!1sen!2sus!4v1756665637991!5m2!1sen!2sus",
        deliveryPartners: {
            [DeliveryPartner.UberEats]: "https://www.ubereats.com/store/good-chicken/Xqp8qycyQIGmq_r6pXMKQA?pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMkdvb2QlMjBDaGlja2VuJTIyJTJDJTIycmVmZXJlbmNlJTIyJTNBJTIyQ2hJSjJRLUFZR2hWd29rUlE2YWFYYzVQam53JTIyJTJDJTIycmVmZXJlbmNlVHlwZSUyMiUzQSUyMmdvb2dsZV9wbGFjZXMlMjIlMkMlMjJsYXRpdHVkZSUyMiUzQTQwLjgwNzU2OTM3ODgxNjMyJTJDJTIybG9uZ2l0dWRlJTIyJTNBLTc0LjIxMDQxMzg0NDUyNSU3RA%3D%3D",
            [DeliveryPartner.Doordash]: "https://order.online/store/good-chicken-montclair-2355703/?hideModal=true&pickup=true",
        }
    },
    {
        id: "jersey-city_01",
        brand: "Good Chicken",
        city: "Jersey City",
        address: "414 Grand St Jersey City, NJ 07302",
        phone: "+1 (973) 337-5075",
        hours: "10am ~ 10pm",
        open: true,
        services: ["Dine-in", "Take out"],
        mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6048.040092383556!2d-74.05243399999999!3d40.7175752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250b7cecdfd47%3A0x3fbde0a2129e6c01!2s414%20Grand%20St%2C%20Jersey%20City%2C%20NJ%2007302!5e0!3m2!1sen!2sus!4v1756992079385!5m2!1sen!2sus",
        deliveryPartners: {
            [DeliveryPartner.UberEats]: "https://www.ubereats.com/store/good-chicken/Xqp8qycyQIGmq_r6pXMKQA?pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMkdvb2QlMjBDaGlja2VuJTIyJTJDJTIycmVmZXJlbmNlJTIyJTNBJTIyQ2hJSjJRLUFZR2hWd29rUlE2YWFYYzVQam53JTIyJTJDJTIycmVmZXJlbmNlVHlwZSUyMiUzQSUyMmdvb2dsZV9wbGFjZXMlMjIlMkMlMjJsYXRpdHVkZSUyMiUzQTQwLjgwNzU2OTM3ODgxNjMyJTJDJTIybG9uZ2l0dWRlJTIyJTNBLTc0LjIxMDQxMzg0NDUyNSU3RA%3D%3D",
            [DeliveryPartner.Doordash]: "https://order.online/store/good-chicken-montclair-2355703/?hideModal=true&pickup=true",
        },
    },
];
