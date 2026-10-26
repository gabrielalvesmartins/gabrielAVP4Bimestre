import { z } from "zod";
const equipmentFields = { name: z.string().trim().min(2).max(100), category: z.string().trim().min(2).max(80), description: z.string().trim().max(500).optional().nullable(), location: z.string().trim().min(2).max(120) };
export const equipmentSchema = z.object({ body: z.object(equipmentFields) });
export const equipmentUpdateSchema = z.object({ body: z.object(Object.fromEntries(Object.entries(equipmentFields).map(([key, value]) => [key, value.optional()])).refine((data) => Object.keys(data).length > 0, "Informe ao menos um campo.")), params: z.object({ id: z.string().min(1) }) });
export const idParamSchema = z.object({ params: z.object({ id: z.string().min(1) }) });
