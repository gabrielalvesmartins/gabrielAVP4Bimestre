import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";
export const list = () => prisma.equipment.findMany({ orderBy: { name: "asc" } });
export async function get(id) { const item = await prisma.equipment.findUnique({ where: { id } }); if (!item) throw new HttpError(404, "Equipamento não encontrado."); return item; }
export const create = (data) => prisma.equipment.create({ data });
export async function update(id, data) { await get(id); return prisma.equipment.update({ where: { id }, data }); }
export async function remove(id) { await get(id); const active = await prisma.reservation.count({ where: { equipmentId: id, status: "ACTIVE", endsAt: { gt: new Date() } } }); if (active) throw new HttpError(409, "Não é possível excluir equipamento com reservas ativas ou futuras."); await prisma.equipment.delete({ where: { id } }); }
