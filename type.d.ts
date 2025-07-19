export interface ProductProps{
    id:number;
    title:string;
    price: number;
    description:string;
    category:string;
    image:string;
    rating?: Rating;
    reviews?: Review[];
    isActive?: boolean;
}

export interface Rating {
    rate: number;
    count: number;
}

export interface ReviewImageData {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    previewUrl: string;
}

export interface Review {
    id: string;
    productId: number;
    userId: string;
    userName: string;
    userImage?: string;
    reviewImage?: ReviewImageData | null;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface StoreProduct{
    id:number;
    title:string;
    price: number;
    description:string;
    category:string;
    image:string;
    quantity:number;
    rating?: Rating;
    reviews?: Review[];
    isActive?: boolean;
}

export interface OrderItemDetails {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    category?: string;
    description?: string;
}

export interface PaymentInfo {
    cardType: 'Visa' | 'Mastercard' | 'American Express' | 'Other';
    cardLastFour: string;
    paymentCompleted?: boolean;
    paymentCompletedAt?: string;
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    items: OrderItemDetails[];
    totalAmount: number;
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: string;
    paymentInfo?: PaymentInfo;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed';
    createdAt: string;
    estimatedDelivery?: string;
}

export interface UserOrderSummary {
    orderId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: number;
}

export interface Address {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
}

export interface stateProps{
    productData: StoreProduct[];
    favoriteData: ProductProps[];
    userInfo: null | string;
    next: any;
}