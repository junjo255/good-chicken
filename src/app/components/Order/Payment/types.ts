export type PaymentKind = "personal" | "business" | "wallet";

export type Pm = {
    id: string;
    label: string;
    brand: "visa" | "mastercard" | "applepay" | "card";
    last4?: string;
    kind: PaymentKind;
    available?: boolean;
    note?: string;
};
