export class CreateOrderDto {
  name: string;
  billingCountry: string;
  billingZip: string;
  billingCity: string;
  billingStreet: string;
  shippingCountry: string;
  shippingZip: string;
  shippingCity: string;
  shippingStreet: string;
  coupon?: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  productId: string;
}
