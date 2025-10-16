import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
    { id: 1, name: 'Fekete póló', price: 4990, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0vLvoiWLhz0DmxCFvBxCYycNargkyF-PVmjzikyD8gA&s'},
    { id: 2, name: 'Barna póló', price: 4990, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHgnmWE6kQg6skIn-j16kg1PCQrQc6F-wQyUgwLGlJpw&s' },
    { id: 3, name: 'Kék póló', price: 4990, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSksA8HFTqSXCPElIqRKj93euSe4wCP_nIReyO-fPkFlA&s'}];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  validateOrder(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name) errors.push('A név megadása kötelező.');
    if (!data.billingAddress) errors.push('A számlázási cím megadása kötelező.');
    if (!data.shippingAddress) errors.push('A szállítási cím megadása kötelező.');

   if (data.coupon) {
      const couponRegex = /^[A-Z]{2}-\d{4}$/;
      if (!couponRegex.test(data.coupon)) errors.push('A kupon formátuma BB-SSSS kell legyen.');
    }

    if (data.cardNumber) {
      if (data.cardNumber.replace(/\s|-/g, '').length !== 16) errors.push('A bankkártya számnak 16 számjegyűnek kell lennie.');
    }
    if (data.expiry) {
      const [month, year] = data.expiry.split('/').map((x: string) => parseInt(x, 10));
      const now = new Date();
      const expiryDate = new Date(2000 + year, month - 1);
      if (expiryDate < now) errors.push('A lejárati dátum nem lehet a múltban.');
    }
    if (data.cvv && data.cvv.length !== 3) errors.push('A CVV-nek 3 számjegyűnek kell lennie.');

    return { valid: errors.length === 0, errors };
  }

  saveOrder(data: OrderData): void {
    const orderRecord = {
      productId: data.productId,
      name: data.name,
      billingAddress: data.billingAddress,
      shippingAddress: data.shippingAddress,
      coupon: data.coupon || '',
    };

    const filePath = path.join(__dirname, '..', 'orders.csv');

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'productId,name,billingAddress,shippingAddress,coupon\n');
    }

    const line = `${orderRecord.productId},"${orderRecord.name}","${orderRecord.billingAddress}","${orderRecord.shippingAddress}","${orderRecord.coupon}"\n`;
    fs.appendFileSync(filePath, line);
  }
}
