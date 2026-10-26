import { ZodError } from "zod";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Dados inválidos.", errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
  }
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ message: status === 500 ? "Erro interno do servidor." : error.message });
}
