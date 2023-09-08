import { products } from './products';
import { packs } from './packs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.products.create({
      data: product,
    });
  }

  for (const pack of packs) {
    await prisma.packs.create({
      data: pack,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
