import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function upsertUserByEmail({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`INFO user already exists: ${email}`);
    return;
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      emailVerified: true,
    },
  });

  console.log(`OK user created: ${email}`);
}

async function ensureProduct(product) {
  const existing = await prisma.product.findFirst({
    where: { name: product.name },
  });

  if (existing) {
    console.log(`INFO product already exists: ${product.name}`);
    return;
  }

  await prisma.product.create({ data: product });
  console.log(`OK product created: ${product.name}`);
}

async function main() {
  console.log('Starting seed/check-or-create script...');

  await upsertUserByEmail({
    name: 'Admin User',
    email: 'admin@aureva.com',
    password: 'Admin@123',
    role: 'admin',
  });

  await upsertUserByEmail({
    name: 'John Doe',
    email: 'customer@aureva.com',
    password: 'Customer@123',
    role: 'customer',
  });

  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High quality wireless headphones',
      price: 99.99,
      stock: 50,
      category: 'Electronics',
      brand: 'AudioMax',
      image: 'headphones.jpg',
    },
    {
      name: 'Smartphone Case',
      description: 'Durable case for smartphone',
      price: 19.99,
      stock: 200,
      category: 'Accessories',
      brand: 'CasePro',
      image: 'case.jpg',
    },
    {
      name: 'Running Shoes',
      description: 'Comfortable running shoes',
      price: 79.99,
      stock: 100,
      category: 'Footwear',
      brand: 'RunFast',
      image: 'shoes.jpg',
    },
  ];

  for (const product of products) {
    await ensureProduct(product);
  }

  console.log('Seed/check-or-create script finished.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
