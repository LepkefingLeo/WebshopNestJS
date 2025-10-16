import { Module } from '@nestjs/common';
import { ProductsController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [ProductsController],
  providers: [AppService],
})
export class AppModule {}
