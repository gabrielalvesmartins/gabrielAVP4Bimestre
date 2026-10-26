import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Este e-mail já está cadastrado.");
  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) }, select: { id: true, name: true, email: true, role: true } });
  return { user };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new HttpError(401, "E-mail ou senha incorretos.");
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "2h" });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
