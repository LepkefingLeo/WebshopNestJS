import { Injectable } from '@nestjs/common';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface OrderData {
  productId: number;
  name: string;
  billingAddress: string;
  shippingAddress: string;
  coupon?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

@Injectable()
export class AppService {
  private products: Product[] = [
    { id: 1, name: 'Fekete póló', price: 4990, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0vLvoiWLhz0DmxCFvBxCYycNargkyF-PVmjzikyD8gA&s' },
    { id: 2, name: 'Szürke póló', price: 4990, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHgnmWE6kQg6skIn-j16kg1PCQrQc6F-wQyUgwLGlJpw&s' },
    { id: 3, name: 'Kék póló', price: 4990, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSksA8HFTqSXCPElIqRKj93euSe4wCP_nIReyO-fPkFlA&s' }];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
