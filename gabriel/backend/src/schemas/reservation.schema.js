import { z } from "zod";
const reservationFields = { equipmentId: z.string().min(1), startsAt: z.iso.datetime(), endsAt: z.iso.datetime(), purpose: z.string().trim().min(3).max(300) };
export const reservationSchema = z.object({ body: z.object(reservationFields) });
export const reservationUpdateSchema = z.object({ body: z.object(Object.fromEntries(Object.entries(reservationFields).map(([key, value]) => [key, value.optional()])).refine((data) => Object.keys(data).length > 0, "Informe ao menos um campo.")), params: z.object({ id: z.string().min(1) }) });
export const reservationIdSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
