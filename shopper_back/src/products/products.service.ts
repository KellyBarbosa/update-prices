import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
    const products = await this.prisma.products.findMany();

    return products.map((product) => ({
      ...product,
      code: Number(product.code.toString()),
      cost_price: Number(product.cost_price),
      sales_price: Number(product.sales_price),
    }));
  }

  async findOne(id: number) {
    const product = await this.prisma.products.findUnique({
      where: {
        code: id,
      },
    });

    return {
      ...product,
      code: Number(product.code.toString()),
      cost_price: Number(product.cost_price),
      sales_price: Number(product.sales_price),
    };
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
