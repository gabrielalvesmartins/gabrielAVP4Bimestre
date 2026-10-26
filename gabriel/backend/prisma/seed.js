import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
try {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!name || !email || !password || password === "replace-with-a-strong-password") throw new Error("Configure ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD seguros no .env antes de executar o seed.");
  await prisma.user.upsert({ where: { email }, update: { role: "ADMIN" }, create: { name, email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" } });
  console.log(`Administrador pronto: ${email}`);
} finally { await prisma.$disconnect(); }
