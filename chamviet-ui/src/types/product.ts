export interface Product {
    id: string;
    title: string;
    shortDescription: string;
    priceLabel: string;
    compareAtPriceLabel?: string;
    discountLabel?: string;
    collectionLabel?: string;
    reviewsLabel?: string;
    ageLabel?: string;
    topicLabel?: string;
    badgeLabel?: string;
    image?: string;
}
