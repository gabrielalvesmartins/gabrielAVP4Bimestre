import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Autenticação necessária." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true } });
    if (!user) return res.status(401).json({ message: "Sessão inválida." });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ message: "Acesso restrito ao administrador." });
  next();
}
