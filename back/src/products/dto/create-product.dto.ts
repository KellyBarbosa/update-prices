import { Product } from '../entities/product.entity';

export class CreateProductDto extends Product {
  code: number;
  cost_price: number;
}
