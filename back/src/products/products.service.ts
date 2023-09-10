import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/db/prisma.service';

interface ProductData {
  product_code: string;
  new_price: string;
}

interface CheckRules {
  code: boolean;
  price: boolean;
  isNumber: boolean;
  isFilled: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async updatePrices(data: ProductData[]) {
    console.log('updatePrices: ', data);
    return true;
    const dataArray = Object.values(data);

    for (const item of dataArray) {
      const updatePrice = await this.update(
        Number(item.product_code),
        Number(item.new_price),
      );

      if (updatePrice) {
        console.log(
          'O preço do produto ',
          Number(item.product_code),
          ' foi atualizado para ',
          Number(item.new_price),
        );
      } else {
        console.log(
          'Erro ao atualizar o preço do produto ',
          Number(item.product_code),
          ' para ',
          Number(item.new_price),
        );
      }
    }

    return true;
  }

  async validate(data: ProductData[]) {
    console.log('Validate: ', data);
    const validate = [];
    const dataArray = Object.values(data);

    for (const item of dataArray) {
      console.log('Item: ', item);
      let isItemValid: CheckRules = {
        code: true,
        price: true,
        isNumber: true,
        isFilled: true,
      };

      if (item.new_price.trim() === '' || item.product_code.trim() === '') {
        isItemValid.isFilled = false;
      }
      if (!isNaN(Number(item.product_code))) {
        const product = await this.findOne(Number(item.product_code));
        if (product) {
          if (!(typeof Number(item.new_price) === 'number')) {
            isItemValid.isNumber = false;
          }

          if (!(product.sales_price < Number(item.new_price))) {
            isItemValid.price = false;
          }
        } else {
          isItemValid.code = false;
          isItemValid.price = false;
        }
      } else {
        isItemValid.code = false;
        isItemValid.price = false;
      }

      validate.push(isItemValid);
    }
    console.log('Validate end:', validate);
    return validate;
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

    if (product) {
      return {
        ...product,
        code: Number(product.code.toString()),
        cost_price: Number(product.cost_price),
        sales_price: Number(product.sales_price),
      };
    }
    return false;
  }

  async update(id: number, new_price: number) {
    const product = await this.prisma.products.update({
      where: {
        code: id,
      },
      data: {
        cost_price: new_price,
      },
    });

    if (product) {
      return true;
    }
    return false;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
