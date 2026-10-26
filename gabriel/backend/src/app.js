import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { equipmentRouter } from "./routes/equipment.routes.js";
import { reservationRouter } from "./routes/reservation.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL?.split(",") || true }));
app.use(express.json());
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/equipments", equipmentRouter);
app.use("/api/reservations", reservationRouter);
app.use((req, res) => res.status(404).json({ message: "Rota não encontrada." }));
app.use(errorHandler);
export default app;
