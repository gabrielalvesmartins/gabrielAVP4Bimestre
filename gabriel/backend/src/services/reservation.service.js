import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";
const include = { equipment: true, user: { select: { id: true, name: true, email: true } } };
const isAdmin = (user) => user.role === "ADMIN";
async function ownedReservation(id, user) { const reservation = await prisma.reservation.findUnique({ where: { id }, include }); if (!reservation) throw new HttpError(404, "Reserva não encontrada."); if (!isAdmin(user) && reservation.userId !== user.id) throw new HttpError(403, "Você só pode acessar suas próprias reservas."); return reservation; }
export function list(user) { return prisma.reservation.findMany({ where: isAdmin(user) ? {} : { userId: user.id }, include, orderBy: { startsAt: "asc" } }); }
export async function get(id, user) { return ownedReservation(id, user); }
export async function create(input, user) {
  const startsAt = new Date(input.startsAt), endsAt = new Date(input.endsAt);
  if (endsAt <= startsAt) throw new HttpError(400, "O horário final deve ser posterior ao inicial.");
  if (startsAt <= new Date()) throw new HttpError(400, "A reserva deve começar no futuro.");
  if (!(await prisma.equipment.findUnique({ where: { id: input.equipmentId } }))) throw new HttpError(404, "Equipamento não encontrado.");
  const collision = await prisma.reservation.findFirst({ where: { equipmentId: input.equipmentId, status: "ACTIVE", startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } });
  if (collision) throw new HttpError(409, "Equipamento já reservado nesse intervalo.");
  return prisma.reservation.create({ data: { ...input, startsAt, endsAt, userId: user.id }, include });
}
export async function update(id, input, user) {
  const current = await ownedReservation(id, user);
  if (current.status === "CANCELLED") throw new HttpError(409, "Reservas canceladas não podem ser alteradas.");
  const data = { ...input };
  if (input.startsAt) data.startsAt = new Date(input.startsAt);
  if (input.endsAt) data.endsAt = new Date(input.endsAt);
  const startsAt = data.startsAt || current.startsAt, endsAt = data.endsAt || current.endsAt, equipmentId = data.equipmentId || current.equipmentId;
  if (endsAt <= startsAt) throw new HttpError(400, "O horário final deve ser posterior ao inicial.");
  if (startsAt <= new Date()) throw new HttpError(400, "A reserva deve começar no futuro.");
  if (data.equipmentId && !(await prisma.equipment.findUnique({ where: { id: equipmentId } }))) throw new HttpError(404, "Equipamento não encontrado.");
  const collision = await prisma.reservation.findFirst({ where: { id: { not: id }, equipmentId, status: "ACTIVE", startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } });
  if (collision) throw new HttpError(409, "Equipamento já reservado nesse intervalo.");
  return prisma.reservation.update({ where: { id }, data, include });
}
export async function remove(id, user) { const reservation = await ownedReservation(id, user); if (reservation.status === "CANCELLED") throw new HttpError(409, "Reserva já cancelada."); return prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" }, include }); }
