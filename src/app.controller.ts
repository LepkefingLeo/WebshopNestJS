import { Controller, Get, Query, Render, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { CreateOrderDto } from './order.dto';

@Controller()
export class ProductsController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getProducts() {
    return { products: this.appService.getProducts() };
  }

  @Get('order')
  @Render('order')
  getOrder(@Query('productId') productId: string) {
    const product = this.appService.getProductById(Number(productId));
    if (!product) {
      return { form: {}, errors: ['Termék nem található!'] };
    }

    return { form: { productId: product.id }, errors: [], product };
  }

  @Get('success')
  @Render('success')
  getOrderSuccess(@Query('name') name: string) {
    return { name: name };
  }

  @Post('order')
  async submitOrder(@Body() body: CreateOrderDto, @Res() res: Response) {
    const errors: string[] = [];

    if (!body.name) {
      errors.push('Név megadása kötelező.');
    }

    if (!body.billingCountry) {
      errors.push('Számlázási ország megadása kötelező.');
    }
    if (!body.billingZip) {
      errors.push('Számlázási irányítószám megadása kötelező.');
    }
    if (!body.billingCity) {
      errors.push('Számlázási város megadása kötelező.');
    }
    if (!body.billingStreet) {
      errors.push('Számlázási utca megadása kötelező.');
    }

    if (!body.shippingCountry) {
      errors.push('Szállítási ország megadása kötelező.');
    }
    if (!body.shippingZip) {
      errors.push('Szállítási irányítószám megadása kötelező.');
    }
    if (!body.shippingCity) {
      errors.push('Szállítási város megadása kötelező.');
    }
    if (!body.shippingStreet) {
      errors.push('Szállítási utca megadása kötelező.');
    }

    if (!body.cardNumber || body.cardNumber.length !== 16 || isNaN(Number(body.cardNumber))) {
      errors.push('Érvényes bankkártyaszám megadása kötelező (16 számjegy).');
    }

    if (!body.expiry || !/^\d{2}\/\d{2}$/.test(body.expiry)) {
      errors.push('Hibás lejárati dátum formátum (MM/YY).');
    } else {
      const [month, year] = body.expiry.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (Number(year) < currentYear || (Number(year) === currentYear && Number(month) < currentMonth)) {
        errors.push('A kártya lejárt!');
      }
    }

    if (!body.cvc || body.cvc.length !== 3 || isNaN(Number(body.cvc))) {
      errors.push('Érvényes CVC megadása kötelező (3 számjegy).');
    }

    if (errors.length > 0) {
      const product = this.appService.getProductById(Number(body.productId));
      const formData = { ...body, cardNumber: '', expiry: '', cvc: '' };
      return res.render('order', { errors, form: formData, product });
    }

    return res.redirect(`/success?name=${body.name}`);
  }
}
